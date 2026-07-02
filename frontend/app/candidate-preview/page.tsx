'use client'

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Flag,
  RotateCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  Save,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react"

import { getQuestions } from "@/lib/mockData"
import { Question } from "@/types/question"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AdminHeader } from "@/components/shared/admin-header"

interface QuestionNavState {
  answered: boolean;
  flagged: boolean;
}

function PreviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const questionId = searchParams.get("id")

  const initialQuestions = getQuestions()
  const initialTarget = initialQuestions.find((q) => q.id === questionId) || initialQuestions.find((q) => q.id === "q5") || initialQuestions[0]

  const [questions] = useState<Question[]>(initialQuestions)
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(initialTarget ?? null)
  
  // Navigation states for 45 questions
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionNavState>>(() => {
    const defaultStates: Record<number, QuestionNavState> = {}
    for (let i = 1; i <= 45; i++) {
      defaultStates[i] = {
        answered: i < 12 && i !== 5 && i !== 8,
        flagged: i === 5 || i === 8 || i === 12,
      }
    }
    return defaultStates
  })
  const [activeNavIndex, setActiveNavIndex] = useState(12) // Default question 12 is active

  // Code editor text state
  const [codeValue, setCodeValue] = useState(initialTarget?.starterCode ?? "")

  // Clock countdown timer
  const [timerString, setTimerString] = useState("01:45:20")
  const [, setTimeLeftSeconds] = useState(6320) // 1 hr, 45 mins, 20 seconds

  // Code execution console output
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [lastSavedString, setLastSavedString] = useState("10:24 AM")

  // Submission Dialog
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  // Timer Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        const next = prev - 1
        const hours = Math.floor(next / 3600).toString().padStart(2, "0")
        const mins = Math.floor((next % 3600) / 60).toString().padStart(2, "0")
        const secs = (next % 60).toString().padStart(2, "0")
        setTimerString(`${hours}:${mins}:${secs}`)
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!activeQuestion) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground">
        Loading Candidate Exam Interface...
      </div>
    )
  }

  // Handle Flag click toggle
  const toggleFlag = () => {
    setQuestionStates((prev) => {
      const current = prev[activeNavIndex] || { answered: false, flagged: false }
      return {
        ...prev,
        [activeNavIndex]: {
          ...current,
          flagged: !current.flagged,
        },
      }
    })
  }

  // Handle grid selection
  const selectQuestionFromGrid = (index: number) => {
    setActiveNavIndex(index)
    // If the index maps to our list of mock questions (we have 5), we can cycle or map them
    const mockIdx = (index - 1) % questions.length
    const nextQ = questions[mockIdx]
    if (nextQ) {
      setActiveQuestion(nextQ)
      setCodeValue(nextQ.starterCode)
      setConsoleOutput(null)
    }
  }

  // Run test cases action
  const runCodeTests = () => {
    setIsRunningTests(true)
    setConsoleOutput("Compiling files & launching execution runner...")
    
    setTimeout(() => {
      setConsoleOutput(
        `[INFO] Running 1 Public Test Case...
✓ Test Case 1: Base Case Passed (14ms)
  - Input: [10, 3, 5, 6, 2]
  - Expected Output: [180, 600, 360, 300, 900]
  - Actual Output: [180, 600, 360, 300, 900]

✓ Validation tests completed. Output is correct! (100% score)`
      )
      setIsRunningTests(false)

      // Mark as answered
      setQuestionStates(prev => ({
        ...prev,
        [activeNavIndex]: {
          ...prev[activeNavIndex],
          answered: true
        }
      }))
    }, 1200)
  }

  // Save Progress
  const saveCodeProgress = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const mins = now.getMinutes().toString().padStart(2, "0")
    const period = now.getHours() >= 12 ? "PM" : "AM"
    setLastSavedString(`${hours}:${mins} ${period}`)
    
    // Mark as answered
    setQuestionStates(prev => ({
      ...prev,
      [activeNavIndex]: {
        ...prev[activeNavIndex],
        answered: true
      }
    }))
    
    alert("Progress saved successfully to exam server!")
  }

  // Next Question
  const nextQuestion = () => {
    const nextIdx = activeNavIndex < 45 ? activeNavIndex + 1 : 1
    selectQuestionFromGrid(nextIdx)
  }

  // Previous Question
  const prevQuestion = () => {
    const prevIdx = activeNavIndex > 1 ? activeNavIndex - 1 : 45
    selectQuestionFromGrid(prevIdx)
  }

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <AdminHeader timerCount={timerString} />

      <div className="container-app mx-auto flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8 lg:py-6 xl:px-10">
        
        {/* Question Navigation — collapsible on tablet/mobile */}
        <aside className="w-full shrink-0 lg:w-64 xl:w-72">
          <div className="flex flex-col rounded-xl border border-border bg-white dark:bg-zinc-950">
            <button
              type="button"
              onClick={() => setIsNavOpen((prev) => !prev)}
              className="flex items-center justify-between gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:cursor-default lg:pointer-events-none"
              aria-expanded={isNavOpen}
              aria-controls="question-navigation-panel"
            >
              <span className="section-label">Question Navigation</span>
              <span className="text-xs font-semibold text-muted-foreground lg:hidden">
                Q{activeNavIndex} of 45
              </span>
              {isNavOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground lg:hidden" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground lg:hidden" aria-hidden="true" />
              )}
            </button>

            <div
              id="question-navigation-panel"
              className={cn(
                "flex flex-col justify-between border-t border-zinc-100 px-4 pb-4 dark:border-zinc-800",
                "max-lg:overflow-hidden max-lg:transition-all max-lg:duration-200",
                isNavOpen ? "max-lg:max-h-[480px] max-lg:opacity-100" : "max-lg:max-h-0 max-lg:border-t-0 max-lg:opacity-0 max-lg:pb-0",
                "lg:max-h-none lg:opacity-100 lg:pb-5 lg:pt-2"
              )}
            >
              <div className="grid grid-cols-5 gap-2 py-4 select-none sm:grid-cols-9 lg:grid-cols-5" role="list" aria-label="Question list">
                {Array.from({ length: 45 }).map((_, idx) => {
                  const num = idx + 1
                  const state = questionStates[num] || { answered: false, flagged: false }
                  const isActive = num === activeNavIndex

                  return (
                    <button
                      key={num}
                      type="button"
                      role="listitem"
                      aria-label={`Question ${num}${isActive ? ", current" : ""}${state.flagged ? ", flagged" : ""}${state.answered ? ", answered" : ""}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => {
                        selectQuestionFromGrid(num)
                        if (window.innerWidth < 1024) setIsNavOpen(false)
                      }}
                      className={cn(
                        "flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        isActive
                          ? "scale-105 border-primary bg-primary text-white"
                          : state.answered
                          ? "border-purple-200 bg-purple-100/50 text-primary dark:bg-purple-950/20 dark:text-purple-300"
                          : state.flagged
                          ? "border-amber-300 bg-amber-100/50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300"
                          : "border-border bg-white text-muted-foreground hover:bg-zinc-50 dark:bg-zinc-900"
                      )}
                    >
                      {num}
                    </button>
                  )
                })}
              </div>

              <div className="space-y-2 border-t border-zinc-100 pt-4 text-xs font-semibold text-muted-foreground select-none dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-purple-200 dark:bg-purple-800" aria-hidden="true" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-300" aria-hidden="true" />
                  <span>Flagged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" aria-hidden="true" />
                  <span>Unvisited</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content — stacks on mobile/tablet */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:flex-row">
          {/* Problem Statement column */}
          <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto lg:max-w-[45%]">
          {/* Question Meta Title Header */}
          <Card className="shrink-0">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground select-none">
                  Question {activeNavIndex} of 45
                </span>
                <span className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50 mt-1 select-none">
                  {activeQuestion.type === "Programming" ? "Coding Challenge" : "Multiple Response"}: {activeQuestion.title}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleFlag}
                className={cn(
                  "gap-1.5 text-xs shadow-none shrink-0",
                  questionStates[activeNavIndex]?.flagged && "bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/20"
                )}
              >
                <Flag className="h-3.5 w-3.5" />
                {questionStates[activeNavIndex]?.flagged ? "Flagged" : "Flag for Review"}
              </Button>
            </CardContent>
          </Card>

          {/* Problem Statement Card */}
          <Card className="flex-1">
            <CardContent className="space-y-6 p-6">
              {/* Problem statement body */}
              <div className="space-y-4">
                <h4 className="font-heading text-lg font-bold border-b border-zinc-100 pb-2 dark:border-zinc-800/60">
                  Problem Statement
                </h4>
                
                {/* Render statement with basic HTML/Markdown styling supported */}
                <div
                  className="text-sm leading-relaxed text-zinc-700 space-y-3 dark:text-zinc-300 whitespace-pre-line font-sans"
                  dangerouslySetInnerHTML={{
                    __html: activeQuestion.problemStatement
                      .replace(/### (.*)/g, "<h5 class='font-heading font-bold text-zinc-900 dark:text-white mt-4 mb-2'>$1</h5>")
                      .replace(/\*\*(.*)\*\*/g, "<strong>$1</strong>")
                      .replace(/`([^`]+)`/g, "<code class='bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono'>$1</code>"),
                  }}
                />
              </div>

              {/* Public Test cases console */}
              {activeQuestion.testCases && activeQuestion.testCases.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                  <h5 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-50 select-none">
                    Public Test Cases
                  </h5>

                  {activeQuestion.testCases.filter(tc => tc.isPublic).map((tc, idx) => (
                    <div
                      key={tc.id}
                      className="rounded-lg border border-border bg-zinc-50 p-4 space-y-3 dark:bg-zinc-900/50"
                    >
                      <span className="text-[10px] font-extrabold tracking-wider text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase leading-none select-none">
                        Test Case {idx + 1}
                      </span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase select-none block mb-1">
                            Sample Input
                          </span>
                          <div className="p-2.5 rounded bg-white border border-border overflow-x-auto dark:bg-zinc-850">
                            {tc.input}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase select-none block mb-1">
                            Expected Output
                          </span>
                          <div className="p-2.5 rounded bg-white border border-border overflow-x-auto dark:bg-zinc-850">
                            {tc.expectedOutput}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Code Editor column */}
        <section className="flex min-w-0 flex-1 flex-col gap-4 lg:max-w-[55%]">
          <Card className="flex min-h-[400px] flex-1 flex-col overflow-hidden lg:min-h-[500px]">
            <div className="bg-zinc-100 border-b border-border px-5 py-3 flex items-center justify-between text-sm select-none dark:bg-zinc-900">
              <span className="font-heading font-bold text-zinc-800 dark:text-zinc-200">
                Solution Editor {activeQuestion.type === "Programming" ? "(JavaScript)" : "(Selection)"}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCodeValue(activeQuestion.starterCode)}
                  className="toolbar-btn"
                  title="Reset to starter template"
                  aria-label="Reset to starter template"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button type="button" className="toolbar-btn" title="Editor configuration" aria-label="Editor configuration">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Dark Code Input panel */}
            <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-50 font-mono text-xs overflow-hidden relative">
              <textarea
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                aria-label="Solution code editor"
                className="w-full flex-1 resize-none border-0 bg-transparent p-5 font-mono text-xs leading-relaxed outline-none focus:ring-0"
                style={{ tabSize: 4 }}
              />

              {/* Absolute Validation/Test Run Console overlay */}
              {consoleOutput && (
                <div className="absolute inset-x-0 bottom-0 max-h-48 overflow-y-auto bg-zinc-900 border-t border-zinc-800 p-4 font-mono text-[11px] text-zinc-300 animate-in slide-in-from-bottom duration-250">
                  <div className="flex items-center justify-between text-zinc-400 select-none pb-1.5 border-b border-zinc-850 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[9px]">Execution Output</span>
                    <button
                      type="button"
                      onClick={() => setConsoleOutput(null)}
                      className="rounded p-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      aria-label="Close execution output"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                </div>
              )}
            </div>

            {/* Run test bar */}
            <div className="border-t border-border p-4 bg-white dark:bg-zinc-950 flex items-center justify-between gap-4 select-none">
              <Button
                variant="outline"
                onClick={runCodeTests}
                disabled={isRunningTests || activeQuestion.type !== "Programming"}
                className="h-8 text-xs font-bold border-primary text-primary hover:bg-primary/5 gap-1.5 shadow-none"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {isRunningTests ? "Running..." : "Run Tests"}
              </Button>

              <span className="text-[10px] text-muted-foreground font-semibold">
                Last saved at {lastSavedString}
              </span>
            </div>
          </Card>

          {/* Previous, Save Progress, Save & Next Question button row */}
          <div className="grid grid-cols-1 gap-3 select-none sm:grid-cols-3">
            <Button
              variant="outline"
              onClick={prevQuestion}
              className="h-10 border-border bg-white text-xs font-bold text-zinc-700 shadow-none hover:bg-zinc-50"
            >
              <ChevronLeft className="mr-1 h-4 w-4 shrink-0" />
              Previous
            </Button>
            
            <Button
              onClick={saveCodeProgress}
              className="h-10 bg-[#7f4d79] text-xs font-bold text-white hover:bg-[#653660]"
            >
              <Save className="mr-1 h-4 w-4 shrink-0" />
              Save Progress
            </Button>

            <Button
              onClick={nextQuestion}
              className="h-10 bg-[#FF6200] text-xs font-bold text-white hover:bg-[#e05600]"
            >
              Save & Next
              <ChevronRight className="ml-1 h-4 w-4 shrink-0" />
            </Button>
          </div>
        </section>
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

      {/* Submit Confirmation Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent onClose={() => setIsSubmitOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-50">Submit Examination</DialogTitle>
            <DialogDescription>
              Are you sure you want to end your exam session and submit all answers for grading? 
              Once submitted, you will not be able to log back in or modify your code responses.
            </DialogDescription>
          </DialogHeader>

          {/* Brief breakdown info */}
          <div className="bg-amber-50 rounded-lg p-4 flex gap-3 text-amber-800 text-xs my-4 dark:bg-amber-950/20 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <span className="font-bold select-none block mb-0.5">Attention Candidate</span>
              <span>You have completed 9 of 45 questions. 36 questions are still unvisited or unanswered.</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitOpen(false)}
            >
              Return to Exam
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsSubmitOpen(false)
                router.push("/question-bank")
                alert("Exam session submitted successfully! Returning to admin console.")
              }}
              className="bg-[#510047] text-white hover:bg-[#6c1d5f] border-transparent"
            >
              Confirm Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CandidatePreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground">
        Loading Candidate Context...
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
