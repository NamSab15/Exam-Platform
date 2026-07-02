'use client'

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Flag,
  RotateCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Play,
  Save,
  ArrowRight,
  CheckCircle,
  FileDown,
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const questionId = searchParams.get("id")

  const [questions, setQuestions] = useState<Question[]>([])
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null)
  
  // Navigation states for 45 questions
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionNavState>>({})
  const [activeNavIndex, setActiveNavIndex] = useState(12) // Default question 12 is active

  // Code editor text state
  const [codeValue, setCodeValue] = useState("")

  // Clock countdown timer
  const [timerString, setTimerString] = useState("01:45:20")
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(6320) // 1 hr, 45 mins, 20 seconds

  // Code execution console output
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [lastSavedString, setLastSavedString] = useState("10:24 AM")

  // Submission Dialog
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)

  // Initialize navigation grid state (1 to 45)
  useEffect(() => {
    const defaultStates: Record<number, QuestionNavState> = {}
    for (let i = 1; i <= 45; i++) {
      defaultStates[i] = {
        answered: i < 12 && i !== 5 && i !== 8, // Questions 1-4, 6-7, 9-11 answered
        flagged: i === 5 || i === 8 || i === 12, // Questions 5, 8 flagged (12 starts flagged)
      }
    }
    setQuestionStates(defaultStates)
  }, [])

  // Load question
  useEffect(() => {
    const data = getQuestions()
    setQuestions(data)
    
    // Find loaded question or fallback to q5 (Array Transformation coding challenge)
    const target = data.find(q => q.id === questionId) || data.find(q => q.id === 'q5') || data[0]
    if (target) {
      setActiveQuestion(target)
      setCodeValue(target.starterCode)
    }
  }, [questionId])

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-foreground flex flex-col">
      {/* Header with Countdown timer */}
      <AdminHeader timerCount={timerString} />

      {/* Grid container with split panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 items-stretch overflow-hidden">
        
        {/* Left Side: Question Navigation Grid (col-span-3) */}
        <aside className="col-span-1 lg:col-span-3 bg-white border border-border rounded-xl p-5 flex flex-col justify-between dark:bg-zinc-950">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none block">
              Question Navigation
            </span>

            {/* Navigation Grid 1 to 45 */}
            <div className="grid grid-cols-5 gap-2 select-none">
              {Array.from({ length: 45 }).map((_, idx) => {
                const num = idx + 1
                const state = questionStates[num] || { answered: false, flagged: false }
                const isActive = num === activeNavIndex

                return (
                  <button
                    key={num}
                    onClick={() => selectQuestionFromGrid(num)}
                    className={cn(
                      "h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center",
                      // Active selected style
                      isActive
                        ? "bg-primary border-primary text-white scale-105"
                        : // Answered styling (light pink/purple)
                        state.answered
                        ? "bg-purple-100/50 border-purple-200 text-primary dark:bg-purple-950/20 dark:text-purple-300"
                        : // Flagged styling (light orange/yellow)
                        state.flagged
                        ? "bg-amber-100/50 border-amber-300 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300"
                        : // Unvisited standard styling
                          "bg-white border-border text-muted-foreground hover:bg-zinc-50 dark:bg-zinc-900"
                    )}
                  >
                    {num}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation Legend */}
          <div className="border-t border-zinc-100 pt-4 mt-6 space-y-2 text-xs font-semibold text-muted-foreground select-none dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-200 dark:bg-purple-800 shrink-0" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shrink-0" />
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
              <span>Unvisited</span>
            </div>
          </div>
        </aside>

        {/* Center: Question Problem Statement (col-span-5) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 overflow-y-auto">
          {/* Question Meta Title Header */}
          <Card className="shadow-none shrink-0">
            <CardContent className="p-5 flex items-center justify-between gap-4">
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
          <Card className="flex-1 shadow-none">
            <CardContent className="p-6 space-y-6">
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

        {/* Right Side: Code Editor Workspace (col-span-4) */}
        <section className="col-span-1 lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Solution Editor Panel */}
          <Card className="flex-1 shadow-none flex flex-col overflow-hidden min-h-[500px]">
            <div className="bg-zinc-100 border-b border-border px-5 py-3 flex items-center justify-between text-sm select-none dark:bg-zinc-900">
              <span className="font-heading font-bold text-zinc-800 dark:text-zinc-200">
                Solution Editor {activeQuestion.type === "Programming" ? "(JavaScript)" : "(Selection)"}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCodeValue(activeQuestion.starterCode)}
                  className="p-1 rounded hover:bg-zinc-200 text-zinc-500 dark:hover:bg-zinc-800"
                  title="Reset to starter template"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button className="p-1 rounded hover:bg-zinc-200 text-zinc-500 dark:hover:bg-zinc-800" title="Editor configuration">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Dark Code Input panel */}
            <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-50 font-mono text-xs overflow-hidden relative">
              <textarea
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                className="w-full flex-1 p-5 bg-transparent border-0 outline-none resize-none font-mono text-xs leading-relaxed focus:ring-0"
                style={{ tabSize: 4 }}
              />

              {/* Absolute Validation/Test Run Console overlay */}
              {consoleOutput && (
                <div className="absolute inset-x-0 bottom-0 max-h-48 overflow-y-auto bg-zinc-900 border-t border-zinc-800 p-4 font-mono text-[11px] text-zinc-300 animate-in slide-in-from-bottom duration-250">
                  <div className="flex items-center justify-between text-zinc-400 select-none pb-1.5 border-b border-zinc-850 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[9px]">Execution Output</span>
                    <button
                      onClick={() => setConsoleOutput(null)}
                      className="p-0.5 hover:bg-zinc-800 rounded"
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
          <div className="grid grid-cols-3 gap-3 select-none">
            <Button
              variant="outline"
              onClick={prevQuestion}
              className="h-10 text-xs font-bold border-border shadow-none text-zinc-700 bg-white hover:bg-zinc-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1 shrink-0" />
              Previous
            </Button>
            
            <Button
              onClick={saveCodeProgress}
              className="h-10 text-xs font-bold bg-[#7f4d79] hover:bg-[#653660] text-white"
            >
              <Save className="h-4 w-4 mr-1 shrink-0" />
              Save Progress
            </Button>

            <Button
              onClick={nextQuestion}
              className="h-10 text-xs font-bold bg-[#FF6200] hover:bg-[#e05600] text-white"
            >
              Save & Next
              <ChevronRight className="h-4 w-4 ml-1 shrink-0" />
            </Button>
          </div>
        </section>
      </div>

      {/* Bottom submit final exam footer bar */}
      <footer className="h-16 border-t border-border bg-white dark:bg-zinc-950 px-6 flex items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <span>All changes saved locally</span>
        </div>

        <Button
          onClick={() => setIsSubmitOpen(true)}
          className="bg-[#510047] hover:bg-[#6c1d5f] text-white gap-1.5 text-xs font-bold"
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
