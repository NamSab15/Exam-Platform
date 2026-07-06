'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';

import { getQuestions } from '@/lib/team2/mock/questionMock';
import { Button } from '@/components/ui/button';
import { AdminHeader } from '@/components/shared/admin-header';

import { useCandidateNavigation } from '@/hooks/team2/useCandidateNavigation';
import { QuestionNavigator } from './QuestionNavigator';
import { ProblemStatementView } from './ProblemStatementView';
import { SolutionEditor } from './SolutionEditor';
import { SubmitConfirmDialog } from './SubmitConfirmDialog';

interface CandidatePreviewClientProps {
  questionId: string | null;
}

export function CandidatePreviewClient({ questionId }: CandidatePreviewClientProps) {
  const router = useRouter();

  const initialQuestions = getQuestions();
  const initialTarget =
    initialQuestions.find((q) => q.id === questionId) ||
    initialQuestions.find((q) => q.id === 'q5') ||
    initialQuestions[0];

  const {
    activeQuestion,
    activeNavIndex,
    questionStates,
    codeValue,
    setCodeValue,
    timerString,
    consoleOutput,
    setConsoleOutput,
    isRunningTests,
    lastSavedString,
    isSubmitOpen,
    setIsSubmitOpen,
    isNavOpen,
    setIsNavOpen,
    selectQuestionFromGrid,
    toggleFlag,
    runCodeTests,
    saveCodeProgress,
    nextQuestion,
    prevQuestion,
  } = useCandidateNavigation(initialQuestions, initialTarget);

  if (!activeQuestion) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground">
        Loading Candidate Exam Interface...
      </div>
    );
  }

  const handleConfirmSubmit = () => {
    setIsSubmitOpen(false);
    router.push('/question-bank');
    alert('Exam session submitted successfully! Returning to admin console.');
  };

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <AdminHeader timerCount={timerString} />

      <div className="container-app mx-auto flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8 lg:py-6 xl:px-10">
        <QuestionNavigator
          activeNavIndex={activeNavIndex}
          questionStates={questionStates}
          isNavOpen={isNavOpen}
          setIsNavOpen={setIsNavOpen}
          onSelectQuestion={selectQuestionFromGrid}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:flex-row">
          <ProblemStatementView
            question={activeQuestion}
            activeNavIndex={activeNavIndex}
            questionStates={questionStates}
            onToggleFlag={toggleFlag}
          />

          <SolutionEditor
            question={activeQuestion}
            codeValue={codeValue}
            onChangeCode={setCodeValue}
            onResetCode={() => setCodeValue(activeQuestion.starterCode)}
            consoleOutput={consoleOutput}
            onClearConsole={() => setConsoleOutput(null)}
            isRunningTests={isRunningTests}
            onRunTests={runCodeTests}
            lastSavedString={lastSavedString}
            onSaveProgress={saveCodeProgress}
            onNext={nextQuestion}
            onPrev={prevQuestion}
          />
        </div>
      </div>

      <footer className="flex h-auto min-h-16 flex-col items-stretch justify-between gap-3 border-t border-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:px-6 dark:bg-zinc-950 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <span>All changes saved locally</span>
        </div>

        <Button
          onClick={() => setIsSubmitOpen(true)}
          className="w-full gap-1.5 bg-[#510047] text-xs font-bold text-white hover:bg-[#6c1d5f] sm:w-auto"
        >
          Submit Final Exam
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </footer>

      <SubmitConfirmDialog
        isOpen={isSubmitOpen}
        onOpenChange={setIsSubmitOpen}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
export default CandidatePreviewClient;
