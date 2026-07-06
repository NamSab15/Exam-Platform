'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { AdminSidebar } from '@/components/shared/admin-sidebar';
import { AdminHeader } from '@/components/shared/admin-header';
import { getQuestions } from '@/lib/team2/mock/questionMock';
import { Question } from '@/types/team2/question';

import { BasicInfoSection, BasicInfoData } from './BasicInfoSection';
import { TimingSection, TimingData } from './TimingSection';
import { MarksConfiguration, MarksData } from './MarksConfiguration';
import { SectionsManager, ExamSection } from './SectionsManager';
import { CandidateEligibilitySection, EligibilityData } from './CandidateEligibilitySection';
import { ExamRulesSection, RulesData } from './ExamRulesSection';
import { QuestionSelectionSection } from './QuestionSelectionSection';
import { SummaryCards } from './SummaryCards';
import { ExamPreviewDialog } from './ExamPreviewDialog';

const LOCAL_DRAFT_KEY = 'xebia_exam_platform_exam_setup_draft';
const LOCAL_PUBLISH_KEY = 'xebia_exam_platform_exam_setup_published';

export function ExamSetupClient() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);

  // Page States
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    name: '',
    description: '',
    subject: '',
    course: '',
    semester: '',
    type: '',
    difficulty: 'Medium',
  });

  const [timing, setTiming] = useState<TimingData>({
    duration: 120,
    startDate: '',
    endDate: '',
    timeZone: 'IST',
  });

  const [marks, setMarks] = useState<MarksData>({
    totalMarks: 100,
    passingMarks: 40,
    negativeMarking: 0,
    partialMarking: true,
  });

  const [sections, setSections] = useState<ExamSection[]>([]);

  const [eligibility, setEligibility] = useState<EligibilityData>({
    everyone: true,
    batches: [],
    courses: [],
    semesters: [],
    students: [],
  });

  const [rules, setRules] = useState<RulesData>({
    shuffleQuestions: false,
    shuffleOptions: false,
    showResults: true,
    allowReview: true,
    allowBackNavigation: true,
    fullscreen: false,
    webcamProctoring: false,
    disableCopyPaste: false,
  });

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadDraftAndQuestions = () => {
    const loadedQuestions = getQuestions();
    setQuestions(loadedQuestions);

    const savedDraft = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.basicInfo) setBasicInfo(parsed.basicInfo);
        if (parsed.timing) setTiming(parsed.timing);
        if (parsed.marks) setMarks(parsed.marks);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.eligibility) setEligibility(parsed.eligibility);
        if (parsed.rules) setRules(parsed.rules);
        if (parsed.selectedQuestionIds) setSelectedQuestionIds(parsed.selectedQuestionIds);
        toast.info('Draft session loaded from local storage');
      } catch (err) {
        console.error('Error parsing exam setup draft', err);
      }
    }
  };

  // Load question bank on mount & check for local session drafts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDraftAndQuestions();
  }, []);

  // Calculate selected question points sum
  const calculatedQuestionsPoints = useMemo(() => {
    return questions
      .filter((q) => selectedQuestionIds.includes(q.id))
      .reduce((sum, q) => sum + (q.basePoints || 0), 0);
  }, [questions, selectedQuestionIds]);

  const handleQuestionSelectionChange = (newIds: string[]) => {
    setSelectedQuestionIds(newIds);
    const points = questions
      .filter((q) => newIds.includes(q.id))
      .reduce((sum, q) => sum + (q.basePoints || 0), 0);
    if (points > 0) {
      setMarks((prev) => ({
        ...prev,
        totalMarks: points,
      }));
    }
  };

  const handleUpdateBasicInfo = (field: keyof BasicInfoData, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateTiming = (field: keyof TimingData, value: string | number) => {
    setTiming((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateMarks = (field: keyof MarksData, value: string | number | boolean) => {
    setMarks((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateEligibility = (field: keyof EligibilityData, value: boolean | string[]) => {
    setEligibility((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateRules = (field: keyof RulesData, value: boolean) => {
    setRules((prev) => ({ ...prev, [field]: value }));
  };

  // Check validity for Publish action
  const isValid = useMemo(() => {
    return (
      basicInfo.name.trim() !== '' &&
      timing.duration > 0 &&
      marks.passingMarks > 0 &&
      marks.passingMarks <= marks.totalMarks &&
      sections.length >= 1 &&
      selectedQuestionIds.length >= 1
    );
  }, [basicInfo.name, timing.duration, marks.passingMarks, marks.totalMarks, sections.length, selectedQuestionIds]);

  const handleSaveDraft = () => {
    const data = {
      basicInfo,
      timing,
      marks,
      sections,
      eligibility,
      rules,
      selectedQuestionIds,
    };
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(data));
    toast.success('Exam configuration draft saved successfully!');
  };

  const handlePublish = () => {
    if (!isValid) {
      toast.error('Please configure all required fields before publishing.');
      return;
    }

    const data = {
      basicInfo,
      timing,
      marks,
      sections,
      eligibility,
      rules,
      selectedQuestionIds,
      publishedAt: new Date().toISOString(),
    };

    // Save to published array in localStorage
    try {
      const existingStr = localStorage.getItem(LOCAL_PUBLISH_KEY);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem(LOCAL_PUBLISH_KEY, JSON.stringify([...existing, data]));

      // Clear the draft session
      localStorage.removeItem(LOCAL_DRAFT_KEY);

      toast.success('Exam published successfully! Redirecting to Question Bank...');
      router.push('/question-bank');
    } catch (err) {
      console.error('Error saving published exam', err);
      toast.error('Failed to publish exam. Please check storage capacity.');
    }
  };

  const currentConfigData = {
    basicInfo,
    timing,
    marks,
    sections,
    eligibility,
    rules,
    selectedQuestionIds,
  };

  return (
    <div className="page-shell">
      <AdminSidebar />

      <div className="page-content-offset">
        <AdminHeader />

        <main className="page-main container-app">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-zinc-800 dark:text-zinc-200">Exam Configuration</span>
          </div>

          {/* Heading Description */}
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
            <h1 className="font-heading text-2xl font-bold tracking-tight select-none">
              Exam Configuration Setup
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl select-none">
              Configure parameters, rules, candidate listings, scheduling windows, and proctoring locks for active examination structures.
            </p>
          </div>

          {/* Double Column Workspace Layout */}
          <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Side */}
            <div className="flex flex-col gap-6 xl:col-span-8">
              {/* 1. Basic Info */}
              <BasicInfoSection data={basicInfo} onChange={handleUpdateBasicInfo} />

              {/* 2. Timing */}
              <TimingSection data={timing} onChange={handleUpdateTiming} />

              {/* 3. Marks */}
              <MarksConfiguration
                data={marks}
                onChange={handleUpdateMarks}
                calculatedQuestionsPoints={calculatedQuestionsPoints}
              />

              {/* 4. Sections */}
              <SectionsManager sections={sections} onChange={setSections} />

              {/* 5. Eligibility */}
              <CandidateEligibilitySection data={eligibility} onChange={handleUpdateEligibility} />

              {/* 6. Rules */}
              <ExamRulesSection data={rules} onChange={handleUpdateRules} />

              {/* 7. Question selection table */}
              <QuestionSelectionSection
                questions={questions}
                selectedIds={selectedQuestionIds}
                onChange={handleQuestionSelectionChange}
              />
            </div>

            {/* Sticky summary & triggers side */}
            <div className="xl:col-span-4">
              <SummaryCards
                selectedQuestionsCount={selectedQuestionIds.length}
                sectionsCount={sections.length}
                totalMarks={marks.totalMarks}
                duration={timing.duration}
                onSaveDraft={handleSaveDraft}
                onPreview={() => setIsPreviewOpen(true)}
                onPublish={handlePublish}
                isValid={isValid}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Simulator instructions preview overlay dialog */}
      <ExamPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        examData={currentConfigData}
      />
    </div>
  );
}

export default ExamSetupClient;
