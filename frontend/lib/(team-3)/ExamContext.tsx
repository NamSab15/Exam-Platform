"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getItem, removeItem, setItem } from "./idb";

export type QuestionStatus = "unanswered" | "answered" | "review";

export type Question = {
  id: string;
  type: "mcq" | "programming";
  status: QuestionStatus;
  answer?: string;  // For MCQ: selected option index as string
  code?: string;    // For Programming: current code in editor
};

export type ExamState = {
  examId: string;
  sessionId?: string;           // Set once a session is started via the backend
  questions: Question[];
  currentQuestionId: string;
  remainingSeconds: number;
  /** Per-question cached code execution output. Stored in IDB, never sent to server. */
  codeOutputs: Record<string, string>;
};

type SubmitResult = {
  sessionId: string;
  totalScore: number;
  passed: boolean;
  certificateUrl?: string;
};

type ExamContextType = {
  state: ExamState | null;
  isLoading: boolean;
  setAnswer: (questionId: string, answer: string) => void;
  setCode: (questionId: string, code: string) => void;
  setQuestionStatus: (questionId: string, status: QuestionStatus) => void;
  setCurrentQuestion: (questionId: string) => void;
  decrementTimer: () => void;
  /** Cache the output of a code execution run client-side only */
  setCodeOutput: (questionId: string, output: string) => void;
  /**
   * The ONLY API call for submission. Reads answers from IDB state and POSTs
   * to /sessions/{sessionId}/submit. All other state is cached client-side.
   */
  submitExam: () => Promise<SubmitResult>;
  /** Remove exam data from IDB after submission */
  clearExamCache: () => Promise<void>;
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_EXAMS_API_URL ?? "http://localhost:8003/api/v1";

export function ExamProvider({ children, examId }: { children: React.ReactNode; examId: string }) {
  const [state, setState] = useState<ExamState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Initialise from IDB or fetch from API ── */
  useEffect(() => {
    const init = async () => {
      const cached = await getItem<ExamState>(`exam_${examId}`);
      if (cached) {
        setState(cached);
      } else {
        /*
         * First load: fetch questions from the backend.
         * TODO: replace this mock with a real API call to Team 2's question service
         * once integration is complete. The endpoint will be something like:
         *   GET /api/v1/exams/{examId}/questions
         * The response is cached to IDB so subsequent page loads never hit the server.
         */
        const initialState: ExamState = {
          examId,
          remainingSeconds: 3600,
          currentQuestionId: "q1",
          codeOutputs: {},
          questions: [
            { id: "q1", type: "mcq", status: "unanswered" },
            { id: "q2", type: "mcq", status: "unanswered" },
            { id: "q3", type: "programming", status: "unanswered" },
          ],
        };
        setState(initialState);
        await setItem(`exam_${examId}`, initialState);
      }
      setIsLoading(false);
    };
    init();
  }, [examId]);

  /* ── Sync to IDB on every state change ── */
  useEffect(() => {
    if (state && !isLoading) {
      setItem(`exam_${examId}`, state);
    }
  }, [state, examId, isLoading]);

  /* ── Mutations ── */

  const setAnswer = (questionId: string, answer: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, answer, status: "answered" } : q
        ),
      };
    });
  };

  const setCode = (questionId: string, code: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, code, status: "answered" } : q
        ),
      };
    });
  };

  const setQuestionStatus = (questionId: string, status: QuestionStatus) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) => (q.id === questionId ? { ...q, status } : q)),
      };
    });
  };

  const setCurrentQuestion = (questionId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, currentQuestionId: questionId };
    });
  };

  const decrementTimer = () => {
    setState((prev) => {
      if (!prev || prev.remainingSeconds <= 0) return prev;
      return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
    });
  };

  /* ── Code output cache (client-side only, never sent to server) ── */
  const setCodeOutput = (questionId: string, output: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        codeOutputs: { ...prev.codeOutputs, [questionId]: output },
      };
    });
  };

  /* ── Submit exam — THE ONLY API CALL ── */
  const submitExam = async (): Promise<SubmitResult> => {
    if (!state) throw new Error("Exam state not loaded");

    const sessionId = state.sessionId;
    if (!sessionId) {
      throw new Error("No active session ID. Start a session first.");
    }

    const response = await fetch(`${API_BASE}/sessions/${sessionId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail ?? `Submit failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      sessionId: data.session_id,
      totalScore: data.total_score,
      passed: data.passed,
      certificateUrl: data.certificate_url,
    };
  };

  /* ── Clear IDB cache after exam is submitted ── */
  const clearExamCache = async () => {
    await removeItem(`exam_${examId}`);
  };

  return (
    <ExamContext.Provider
      value={{
        state,
        isLoading,
        setAnswer,
        setCode,
        setQuestionStatus,
        setCurrentQuestion,
        decrementTimer,
        setCodeOutput,
        submitExam,
        clearExamCache,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
}
