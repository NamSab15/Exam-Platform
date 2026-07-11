"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useExam } from "@/lib/(team-3)/ExamContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Circle, HelpCircle, Lock, Loader2 } from "lucide-react";

export default function SubmissionPage() {
  const router = useRouter();
  const { state, isLoading, submitExam, clearExamCache } = useExam();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [passed, setPassed] = useState<boolean | null>(null);

  if (isLoading || !state) {
    return <div className="flex items-center justify-center w-full h-screen">Loading...</div>;
  }

  const answered = state.questions.filter((q) => q.status === "answered").length;
  const unanswered = state.questions.filter((q) => q.status === "unanswered").length;
  const review = state.questions.filter((q) => q.status === "review").length;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitExam();
      setResultScore(result.totalScore);
      setPassed(result.passed);
      setIsSubmitted(true);
      await clearExamCache();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewResults = () => {
    router.push(`/exam/${state.examId}/results`);
  };

  if (isSubmitted) {
    return (
      <div className="flex w-full h-full bg-[#f7f8fc] items-center justify-center p-6">
        <div className="bg-white rounded-lg border border-[#d5c1cc] p-10 max-w-lg w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-[#01ac9f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#01ac9f]" />
          </div>
          <h1 className="text-3xl font-bold font-sans text-[#21191e] mb-2">Exam Submitted</h1>
          {resultScore !== null && (
            <div className="my-4 flex flex-col items-center gap-1">
              <span className={`text-5xl font-black tabular-nums ${passed ? "text-[#01ac9f]" : "text-[#ff6200]"}`}>
                {resultScore.toFixed(1)}%
              </span>
              <span className={`text-sm font-semibold uppercase tracking-wider ${passed ? "text-[#01ac9f]" : "text-[#ff6200]"}`}>
                {passed ? "✓ Passed" : "✗ Not Passed"}
              </span>
            </div>
          )}
          <p className="text-[#51434c] font-sans mb-8">
            Your assessment has been successfully submitted and locked. You can no longer make any changes.
          </p>
          <Button 
            onClick={handleViewResults} 
            className="w-full bg-[#6c1d5f] hover:bg-[#4a1e47] text-white py-6 text-lg"
          >
            View Scorecard & Results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-[#f7f8fc] items-center justify-center p-6">
      <div className="bg-white rounded-lg border border-[#d5c1cc] p-8 max-w-2xl w-full shadow-sm">
        <h1 className="text-3xl font-bold font-sans text-[#21191e] mb-2">Confirm Submission</h1>
        <p className="text-[#51434c] font-sans mb-8">
          Please review your exam status before submitting. Once submitted, you cannot return to the exam.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#f9eaf0] rounded-lg p-6 flex flex-col items-center border border-[#d5c1cc]">
            <CheckCircle2 className="w-8 h-8 text-[#01ac9f] mb-3" />
            <span className="text-3xl font-bold text-[#21191e] font-mono">{answered}</span>
            <span className="text-sm font-semibold text-[#51434c] uppercase tracking-wider mt-1">Answered</span>
          </div>
          
          <div className={`rounded-lg p-6 flex flex-col items-center border ${unanswered > 0 ? "bg-[#fff0e5] border-[#ff6200]" : "bg-[#f9eaf0] border-[#d5c1cc]"}`}>
            <Circle className={`w-8 h-8 mb-3 ${unanswered > 0 ? "text-[#ff6200]" : "text-[#83727c]"}`} />
            <span className="text-3xl font-bold text-[#21191e] font-mono">{unanswered}</span>
            <span className="text-sm font-semibold text-[#51434c] uppercase tracking-wider mt-1">Unanswered</span>
          </div>
          
          <div className="bg-[#f9eaf0] rounded-lg p-6 flex flex-col items-center border border-[#d5c1cc]">
            <HelpCircle className="w-8 h-8 text-[#ff6200] mb-3" />
            <span className="text-3xl font-bold text-[#21191e] font-mono">{review}</span>
            <span className="text-sm font-semibold text-[#51434c] uppercase tracking-wider mt-1">For Review</span>
          </div>
        </div>

        {unanswered > 0 && (
          <div className="flex items-start gap-3 p-4 bg-[#fff0e5] border border-[#ff6200] rounded-md mb-8">
            <AlertTriangle className="w-5 h-5 text-[#ff6200] shrink-0 mt-0.5" />
            <p className="text-sm text-[#21191e]">
              <strong>Warning:</strong> You have {unanswered} unanswered question{unanswered > 1 ? "s" : ""}. 
              Are you sure you want to submit?
            </p>
          </div>
        )}

        {submitError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-md mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {submitError}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-[#eddfe5]">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="border-[#6c1d5f] text-[#6c1d5f] hover:bg-[#f9eaf0]"
          >
            Return to Exam
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#ff6200] hover:bg-[#e65800] text-white font-semibold gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              "Submit Exam"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
