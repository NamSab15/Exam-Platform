'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Eye, Save } from 'lucide-react';

import { getQuestions } from '@/lib/team2/mock/questionMock';
import { Question, QuestionStatus, QuestionType, QuestionDifficulty } from '@/types/team2/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminSidebar } from '@/components/shared/admin-sidebar';
import { AdminHeader } from '@/components/shared/admin-header';

import { useEditorState } from '@/hooks/team2/useEditorState';
import { TypeSelector } from './TypeSelector';
import { ProblemStatementEditor } from './ProblemStatementEditor';
import { StarterCodeEditor } from './StarterCodeEditor';
import { TestCaseManager } from './TestCaseManager';
import { MetadataSidebar } from './MetadataSidebar';
import { SyncStatusBanner } from './SyncStatusBanner';
import { cn } from '@/lib/utils';

interface QuestionEditorClientProps {
  questionId: string | null;
  isNew: boolean;
}

export function QuestionEditorClient({ questionId, isNew }: QuestionEditorClientProps) {
  const router = useRouter();

  const initialQuestion = React.useMemo(() => {
    const questions = getQuestions();

    if (isNew) {
      return {
        id: 'new-question',
        title: 'New Custom Question',
        version: 'V1.0',
        type: 'Programming' as QuestionType,
        difficulty: 'Medium' as QuestionDifficulty,
        status: 'Draft' as QuestionStatus,
        tags: ['General'],
        skills: ['Logic'],
        refCount: 0,
        problemStatement: 'Implement a function ...',
        starterCode: 'def solve():\n    pass',
        testCases: [
          {
            id: 'new-test-case',
            input: '1',
            expectedOutput: '1',
            isPublic: true,
            timeLimit: '1.0s',
            memoryLimit: '256MB',
            matchType: 'Exact Match',
          },
        ],
        cognitiveLevel: 'Applying',
        basePoints: 10,
        negativeMarking: 0,
        partialMarking: false,
        defaultGradingMode: 'Exact String Match',
        lastModified: 'Just now',
        creator: 'Sarah Jenkins',
      } as Question;
    }

    return (
      questions.find((q) => q.id === questionId) ||
      questions.find((q) => q.id === 'q4') ||
      null
    );
  }, [questionId, isNew]);

  const {
    question,
    newTopicTag,
    setNewTopicTag,
    newSkillTag,
    setNewSkillTag,
    latexOn,
    setLatexOn,
    publishTimer,
    updateField,
    handleTypeChange,
    updateTestCase,
    addTestCase,
    removeTestCase,
    addTopicTag,
    removeTopicTag,
    addSkillTag,
    removeSkillTag,
    handleSave,
  } = useEditorState(initialQuestion, () => {
    router.push('/question-bank');
  });

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground">
        Loading Question Config...
      </div>
    );
  }

  return (
    <div className="page-shell">
      <AdminSidebar />

      <div className="page-content-offset">
        <AdminHeader />

        <main className="page-main container-app">
          {/* Sub Header / Control panel */}
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push('/question-bank')}
                className="h-9 w-9 shrink-0 rounded-lg shadow-none"
                aria-label="Back to question bank"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <Input
                    value={question.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="font-heading text-xl font-bold bg-transparent border-transparent hover:border-zinc-200 focus-visible:border-primary focus-visible:ring-0 p-0 h-auto w-auto max-w-sm sm:max-w-md"
                  />

                  {/* Status Dropdown Pill */}
                  <select
                    value={question.status}
                    onChange={(e) => updateField('status', e.target.value as QuestionStatus)}
                    className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded-full border border-transparent select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
                      question.status === 'Published' &&
                        'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
                      question.status === 'Draft' &&
                        'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
                      question.status === 'Retired' &&
                        'bg-zinc-500/10 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400'
                    )}
                  >
                    <option value="Draft">DRAFT</option>
                    <option value="Published">PUBLISHED</option>
                    <option value="Retired">RETIRED</option>
                  </select>
                </div>

                <span className="text-xs text-muted-foreground select-none">
                  {question.version} • Last modified {question.lastModified}
                </span>
              </div>
            </div>

            {/* Sub-Header Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Roll Back Action (Mocked response: Restored Version 4.1)')}
                className="gap-1.5 text-xs shadow-none"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Roll Back
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/candidate-preview?id=${question.id}`)}
                className="gap-1.5 text-xs shadow-none"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </Button>

              <Button
                onClick={handleSave}
                className="gap-1.5 bg-primary text-white hover:bg-primary/95 text-xs"
              >
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Main Form Split Panel */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              <TypeSelector currentType={question.type} onTypeChange={handleTypeChange} />

              <ProblemStatementEditor
                value={question.problemStatement}
                onChange={(val) => updateField('problemStatement', val)}
                latexOn={latexOn}
                onLatexToggle={setLatexOn}
              />

              {question.type === 'Programming' && (
                <>
                  <StarterCodeEditor
                    value={question.starterCode}
                    onChange={(val) => updateField('starterCode', val)}
                  />

                  <TestCaseManager
                    testCases={question.testCases}
                    onUpdateTestCase={updateTestCase}
                    onAddTestCase={addTestCase}
                    onRemoveTestCase={removeTestCase}
                  />
                </>
              )}
            </div>

            {/* Right Metadata Sidebar Panel Column */}
            <div className="space-y-6 xl:col-span-4">
              <MetadataSidebar
                question={question}
                newTopicTag={newTopicTag}
                setNewTopicTag={setNewTopicTag}
                newSkillTag={newSkillTag}
                setNewSkillTag={setNewSkillTag}
                onUpdateField={updateField}
                onAddTopicTag={addTopicTag}
                onRemoveTopicTag={removeTopicTag}
                onAddSkillTag={addSkillTag}
                onRemoveSkillTag={removeSkillTag}
              />

              <SyncStatusBanner timer={publishTimer} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default QuestionEditorClient;
