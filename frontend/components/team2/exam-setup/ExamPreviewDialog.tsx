'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Award,
  Layers,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExamPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  examData: {
    basicInfo: {
      name: string;
      description: string;
      subject: string;
      course: string;
      semester: string;
      type: string;
      difficulty: string;
    };
    timing: {
      duration: number;
      startDate: string;
      endDate: string;
      timeZone: string;
    };
    marks: {
      totalMarks: number;
      passingMarks: number;
      negativeMarking: number;
      partialMarking: boolean;
    };
    sections: Array<{
      id: string;
      name: string;
      questionType: string;
      numQuestions: number;
      marks: number;
    }>;
    eligibility: {
      everyone: boolean;
      batches: string[];
      courses: string[];
      semesters: string[];
      students: string[];
    };
    rules: {
      shuffleQuestions: boolean;
      shuffleOptions: boolean;
      showResults: boolean;
      allowReview: boolean;
      allowBackNavigation: boolean;
      fullscreen: boolean;
      webcamProctoring: boolean;
      disableCopyPaste: boolean;
    };
    selectedQuestionIds: string[];
  };
}

export function ExamPreviewDialog({ isOpen, onClose, examData }: ExamPreviewDialogProps) {
  const { basicInfo, timing, marks, sections, eligibility, rules, selectedQuestionIds } = examData;

  const isProctored = rules.fullscreen || rules.webcamProctoring;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-2xl bg-zinc-50 dark:bg-zinc-950 p-0 rounded-xl overflow-hidden shadow-2xl border border-border">
        {/* Header banner */}
        <div className="bg-[#510047] text-white p-6 relative select-none">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/90 px-2 py-0.5 rounded-md w-fit">
            Candidate Exam Simulator Preview
          </div>
          <h2 className="text-xl font-bold font-heading mt-2.5 truncate">
            {basicInfo.name || 'Untitled Assessment'}
          </h2>
          <p className="text-xs text-white/80 mt-1 flex flex-wrap gap-x-3 gap-y-1">
            <span>Subject: {basicInfo.subject || 'Not Configured'}</span>
            <span>•</span>
            <span>Course: {basicInfo.course || 'Not Configured'}</span>
          </p>
        </div>

        {/* Scrollable details */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-sm text-zinc-700 dark:text-zinc-300 select-none">
          {/* Top Quick Status Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-zinc-900 border border-border p-3 rounded-xl flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-primary dark:bg-purple-950/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Duration</div>
                <div className="text-xs font-black text-zinc-800 dark:text-zinc-100">{timing.duration || 0} Minutes</div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-border p-3 rounded-xl flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Award className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Scoring</div>
                <div className="text-xs font-black text-zinc-800 dark:text-zinc-100">{marks.totalMarks || 0} Marks</div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-border p-3 rounded-xl flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Questions</div>
                <div className="text-xs font-black text-zinc-800 dark:text-zinc-100">{selectedQuestionIds.length} Qs</div>
              </div>
            </div>
          </div>

          {/* Description */}
          {basicInfo.description && (
            <div className="space-y-1.5">
              <h3 className="section-label">Examination Instructions</h3>
              <div className="bg-white dark:bg-zinc-900 p-4 border border-border rounded-xl text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                {basicInfo.description}
              </div>
            </div>
          )}

          {/* Sections breakdown */}
          <div className="space-y-1.5">
            <h3 className="section-label">Exam Layout ({sections.length} Sections)</h3>
            <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl divide-y divide-zinc-100 dark:divide-zinc-800">
              {sections.length === 0 ? (
                <div className="p-4 text-xs text-center text-muted-foreground">No sections configured.</div>
              ) : (
                sections.map((sec, idx) => (
                  <div key={sec.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{sec.name}</span>
                        <span className="ml-2 text-zinc-400">({sec.questionType} questions)</span>
                      </div>
                    </div>
                    <div className="text-right font-medium text-zinc-600 dark:text-zinc-400">
                      {sec.numQuestions} Questions • {sec.marks} Marks
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Proctoring restrictions & scoring policies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Proctoring Lock status */}
            <div className="space-y-2">
              <h3 className="section-label">Supervision & Security</h3>
              <div className="bg-white dark:bg-zinc-900 border border-border p-4 rounded-xl space-y-2">
                {isProctored ? (
                  <div className="flex items-center gap-2 text-rose-500 font-bold text-xs">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>AI Proctoring Activated</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>Standard Supervision</span>
                  </div>
                )}
                <ul className="space-y-1.5 text-[11px] text-muted-foreground pl-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className={`h-3 w-3 shrink-0 ${rules.fullscreen ? 'text-primary' : 'text-zinc-350'}`} />
                    <span>Fullscreen Enforced: {rules.fullscreen ? 'Yes' : 'No'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className={`h-3 w-3 shrink-0 ${rules.webcamProctoring ? 'text-primary' : 'text-zinc-350'}`} />
                    <span>Webcam Streaming: {rules.webcamProctoring ? 'Yes' : 'No'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className={`h-3 w-3 shrink-0 ${rules.disableCopyPaste ? 'text-primary' : 'text-zinc-350'}`} />
                    <span>Copy/Paste Disabled: {rules.disableCopyPaste ? 'Yes' : 'No'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Exam policies */}
            <div className="space-y-2">
              <h3 className="section-label">Academic Policies</h3>
              <div className="bg-white dark:bg-zinc-900 border border-border p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>Grading & Navigation Rules</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-muted-foreground pl-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className={`h-3 w-3 shrink-0 ${marks.negativeMarking > 0 ? 'text-primary' : 'text-zinc-350'}`} />
                    <span>Negative Marking: {marks.negativeMarking > 0 ? `${marks.negativeMarking}% penalty` : 'No'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className={`h-3 w-3 shrink-0 ${marks.partialMarking ? 'text-primary' : 'text-zinc-350'}`} />
                    <span>Partial Marking: {marks.partialMarking ? 'Yes' : 'No'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className={`h-3 w-3 shrink-0 ${rules.allowBackNavigation ? 'text-primary' : 'text-zinc-350'}`} />
                    <span>Back Navigation: {rules.allowBackNavigation ? 'Allowed' : 'Disabled'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Candidate eligibility checks */}
          <div className="space-y-1.5">
            <h3 className="section-label">Access Eligibility</h3>
            <div className="bg-white dark:bg-zinc-900 border border-border p-4 rounded-xl flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-indigo-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                  {eligibility.everyone ? 'Everyone Eligible' : 'Restricted Group Criteria'}
                </span>
                {!eligibility.everyone && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {eligibility.batches.length > 0 && <Badge variant="outline" className="text-[9px]">Batches ({eligibility.batches.length})</Badge>}
                    {eligibility.courses.length > 0 && <Badge variant="outline" className="text-[9px]">Courses ({eligibility.courses.length})</Badge>}
                    {eligibility.semesters.length > 0 && <Badge variant="outline" className="text-[9px]">Semesters ({eligibility.semesters.length})</Badge>}
                    {eligibility.students.length > 0 && <Badge variant="outline" className="text-[9px]">Students ({eligibility.students.length})</Badge>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer simulation action */}
        <div className="p-4 bg-zinc-100 border-t border-border flex justify-end gap-2 dark:bg-zinc-900 select-none">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs h-9 px-4 cursor-pointer"
          >
            Close Preview
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              alert('Simulation Starting! In a live environment, this starts the test session.');
              onClose();
            }}
            className="bg-[#510047] text-white hover:bg-[#6c1d5f] font-bold text-xs h-9 px-4 cursor-pointer"
          >
            Start Test (Simulation)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ExamPreviewDialog;
