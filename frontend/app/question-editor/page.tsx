'use client'

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  RotateCcw,
  Eye,
  Save,
  Plus,
  Trash2,
  Edit2,
  Code2,
  CheckSquare,
  CircleDot,
  Bold,
  Italic,
  Table as TableIcon,
  Image as ImageIcon,
  List,
  Check,
  Cpu,
  Clock,
  Sparkles,
  RefreshCw,
  X
} from "lucide-react"

import { getQuestions, saveQuestion } from "@/lib/mockData"
import { Question, QuestionType, QuestionDifficulty, QuestionStatus, CognitiveLevel, TestCase } from "@/types/question"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { AdminHeader } from "@/components/shared/admin-header"

function EditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const questionId = searchParams.get("id")
  const isNew = searchParams.get("new") === "true"

  const [question, setQuestion] = useState<Question | null>(null)
  
  // Custom states for tagging input
  const [newTopicTag, setNewTopicTag] = useState("")
  const [newSkillTag, setNewSkillTag] = useState("")
  
  // LaTeX preview switch
  const [latexOn, setLatexOn] = useState(true)

  // Status Banner mock timers
  const [publishTimer, setPublishTimer] = useState(14)

  useEffect(() => {
    const questions = getQuestions()
    let loadedQuestion: Question | undefined

    if (isNew) {
      // Create empty/new question state
      loadedQuestion = {
        id: `q_${Date.now()}`,
        title: "New Custom Question",
        version: "V1.0",
        type: "Programming",
        difficulty: "Medium",
        status: "Draft",
        tags: ["General"],
        skills: ["Logic"],
        refCount: 0,
        problemStatement: "Implement a function ...",
        starterCode: "def solve():\n    pass",
        testCases: [
          {
            id: `tc_${Date.now()}`,
            input: "1",
            expectedOutput: "1",
            isPublic: true,
            timeLimit: "1.0s",
            memoryLimit: "256MB",
            matchType: "Exact Match"
          }
        ],
        cognitiveLevel: "Applying",
        basePoints: 10,
        negativeMarking: 0,
        partialMarking: false,
        defaultGradingMode: "Exact String Match",
        lastModified: "Just now",
        creator: "Sarah Jenkins"
      }
    } else {
      // Load by ID, or fallback to the Graph Theory Dijkstra question
      loadedQuestion = questions.find(q => q.id === questionId) || questions.find(q => q.id === 'q4')
    }

    if (loadedQuestion) {
      setQuestion(JSON.parse(JSON.stringify(loadedQuestion))) // Deep copy
    }
  }, [questionId, isNew])

  // Timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPublishTimer(prev => (prev > 1 ? prev - 1 : 15))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground">
        Loading Question Config...
      </div>
    )
  }

  // Update specific question field helper
  const updateField = (field: keyof Question, value: any) => {
    setQuestion(prev => {
      if (!prev) return null
      return { ...prev, [field]: value }
    })
  }

  // Question Type Selector handlers
  const handleTypeChange = (type: QuestionType) => {
    setQuestion(prev => {
      if (!prev) return null
      let starter = prev.starterCode
      if (type === "MCQ") starter = "// Choose single answer"
      if (type === "MRQ") starter = "// Select options in the UI"
      if (type === "Programming" && prev.type !== "Programming") {
        starter = "def solve():\n    pass"
      }
      return { ...prev, type, starterCode: starter }
    })
  }

  // Test Case updates
  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const updatedTestCases = [...question.testCases]
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value }
    updateField("testCases", updatedTestCases)
  }

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: `tc_${Date.now()}`,
      input: "",
      expectedOutput: "",
      isPublic: true,
      timeLimit: "1.0s",
      memoryLimit: "256MB",
      matchType: "Exact Match"
    }
    updateField("testCases", [...question.testCases, newTestCase])
  }

  const removeTestCase = (index: number) => {
    const updated = question.testCases.filter((_, idx) => idx !== index)
    updateField("testCases", updated)
  }

  // Save changes callback
  const handleSave = () => {
    saveQuestion(question)
    router.push("/question-bank")
  }

  // Topic tags management
  const addTopicTag = () => {
    if (newTopicTag.trim() && !question.tags.includes(newTopicTag.trim())) {
      updateField("tags", [...question.tags, newTopicTag.trim()])
      setNewTopicTag("")
    }
  }

  const removeTopicTag = (tag: string) => {
    updateField("tags", question.tags.filter(t => t !== tag))
  }

  // Skill tags management
  const addSkillTag = () => {
    if (newSkillTag.trim() && !question.skills.includes(newSkillTag.trim())) {
      updateField("skills", [...question.skills, newSkillTag.trim()])
      setNewSkillTag("")
    }
  }

  const removeSkillTag = (skill: string) => {
    updateField("skills", question.skills.filter(s => s !== skill))
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-foreground">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main offset */}
      <div className="pl-72 flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1 p-8 space-y-6 container-app">
          {/* Sub Header / Control panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
            {/* Back & Title */}
            <div className="flex items-start gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/question-bank")}
                className="h-9 w-9 rounded-lg shadow-none shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <Input
                    value={question.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="font-heading text-xl font-bold bg-transparent border-transparent hover:border-zinc-200 focus-visible:border-primary focus-visible:ring-0 p-0 h-auto w-auto max-w-sm sm:max-w-md"
                  />
                  
                  {/* Status Dropdown Pill */}
                  <select
                    value={question.status}
                    onChange={(e) => updateField("status", e.target.value as QuestionStatus)}
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full border border-transparent select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                      question.status === "Published" && "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
                      question.status === "Draft" && "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
                      question.status === "Retired" && "bg-zinc-500/10 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400"
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
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("Roll Back Action (Mocked response: Restored Version 4.1)")}
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Main Form Column */}
            <div className="col-span-1 lg:col-span-8 space-y-6">
              
              {/* Card 1: Question Type Selector */}
              <Card className="shadow-none">
                <CardContent className="p-6">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none block mb-4">
                    Question Type
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* MCQ Type */}
                    <div
                      onClick={() => handleTypeChange("MCQ")}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-5 rounded-lg border-2 cursor-pointer transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 select-none",
                        question.type === "MCQ"
                          ? "border-primary bg-purple-50/10"
                          : "border-border bg-white dark:bg-zinc-800"
                      )}
                    >
                      <CircleDot className={cn("h-6 w-6 mb-2", question.type === "MCQ" ? "text-primary" : "text-zinc-400")} />
                      <span className="font-semibold text-sm">MCQ (Single)</span>
                      
                      {/* Check dot marker */}
                      <div className="absolute top-3 right-3 h-4 w-4 rounded-full border flex items-center justify-center">
                        {question.type === "MCQ" && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>

                    {/* MRQ Type */}
                    <div
                      onClick={() => handleTypeChange("MRQ")}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-5 rounded-lg border-2 cursor-pointer transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 select-none",
                        question.type === "MRQ"
                          ? "border-primary bg-purple-50/10"
                          : "border-border bg-white dark:bg-zinc-800"
                      )}
                    >
                      <CheckSquare className={cn("h-6 w-6 mb-2", question.type === "MRQ" ? "text-primary" : "text-zinc-400")} />
                      <span className="font-semibold text-sm">MRQ (Multiple)</span>
                      
                      <div className="absolute top-3 right-3 h-4 w-4 rounded border flex items-center justify-center">
                        {question.type === "MRQ" && <span className="h-2.5 w-2.5 bg-primary rounded-sm" />}
                      </div>
                    </div>

                    {/* Programming Type */}
                    <div
                      onClick={() => handleTypeChange("Programming")}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-5 rounded-lg border-2 cursor-pointer transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 select-none",
                        question.type === "Programming"
                          ? "border-primary bg-purple-50/10"
                          : "border-border bg-white dark:bg-zinc-800"
                      )}
                    >
                      <Code2 className={cn("h-6 w-6 mb-2", question.type === "Programming" ? "text-primary" : "text-zinc-400")} />
                      <span className="font-semibold text-sm">Programming</span>
                      
                      <div className="absolute top-3 right-3 h-4 w-4 rounded-full border flex items-center justify-center">
                        {question.type === "Programming" && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Problem Statement Editor */}
              <Card className="shadow-none">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 select-none">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                      Problem Statement (Rich Text)
                    </span>
                    
                    <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
                      <span className="hover:underline cursor-pointer">Formatting Guide</span>
                      <div className="flex items-center gap-1.5 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                        <span>Latex Rendering: {latexOn ? "ON" : "OFF"}</span>
                        <Switch checked={latexOn} onCheckedChange={setLatexOn} />
                      </div>
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-1.5 bg-zinc-50 rounded-lg border border-border dark:bg-zinc-900/60 select-none">
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-350" title="Bold"><Bold className="h-4 w-4" /></button>
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-350" title="Italic"><Italic className="h-4 w-4" /></button>
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-350 border-l border-zinc-200 pl-2 ml-1" title="Table"><TableIcon className="h-4 w-4" /></button>
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-350" title="Math Formula">
                      <span className="text-[11px] font-bold font-serif italic">fx</span>
                    </button>
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-350" title="Insert Image"><ImageIcon className="h-4 w-4" /></button>
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-350" title="Bullet List"><List className="h-4 w-4" /></button>
                  </div>

                  {/* Problem statement textarea */}
                  <textarea
                    rows={6}
                    value={question.problemStatement}
                    onChange={(e) => updateField("problemStatement", e.target.value)}
                    className="w-full p-4 rounded-lg border border-border bg-white dark:bg-zinc-800 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    placeholder="Enter your problem description, constraints, and formulas here..."
                  />
                </CardContent>
              </Card>

              {/* Card 3: Starter Code & Environment (only for programming) */}
              {question.type === "Programming" && (
                <Card className="shadow-none">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 select-none">
                      <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                        Starter Code & Environment
                      </span>
                      <span className="text-[11px] text-muted-foreground italic">
                        Read-only code block provided to candidates
                      </span>
                    </div>

                    <div className="flex items-center gap-3 select-none">
                      <select
                        className="h-9 px-3 rounded-lg border border-border bg-white dark:bg-zinc-800 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        defaultValue="python"
                      >
                        <option value="python">Python 3.10</option>
                        <option value="javascript">JavaScript (Node v18)</option>
                        <option value="cpp">C++ (GCC 11)</option>
                      </select>
                    </div>

                    {/* Starter code editor mock */}
                    <div className="rounded-lg overflow-hidden border border-border">
                      <div className="bg-zinc-800 text-zinc-400 px-4 py-2 text-xs font-mono select-none flex items-center justify-between">
                        <span>solution.py</span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
                          Main Template
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        value={question.starterCode}
                        onChange={(e) => updateField("starterCode", e.target.value)}
                        className="w-full p-4 bg-zinc-950 text-zinc-50 font-mono text-xs focus-visible:outline-none leading-relaxed border-0"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Card 4: Test Case Management (only for Programming) */}
              {question.type === "Programming" && (
                <Card className="shadow-none">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                          Test Case Management
                        </span>
                        <span className="text-xs text-muted-foreground select-none">
                          Add Public (visible) and Private (grading) test cases.
                        </span>
                      </div>

                      <Button
                        onClick={addTestCase}
                        className="gap-1 bg-primary text-white hover:bg-primary/95 text-xs h-8 px-3"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Test Case
                      </Button>
                    </div>

                    {/* Test cases list */}
                    <div className="space-y-4">
                      {question.testCases.map((tc, index) => (
                        <div
                          key={tc.id}
                          className="rounded-lg border-2 border-emerald-500 bg-white p-5 space-y-4 dark:bg-zinc-800/20"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2 select-none">
                            <div className="flex items-center gap-2">
                              {/* Toggle Public/Private */}
                              <select
                                value={tc.isPublic ? "public" : "private"}
                                onChange={(e) => updateTestCase(index, "isPublic", e.target.value === "public")}
                                className={cn(
                                  "text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded leading-none border-0 font-sans cursor-pointer focus-visible:ring-1 focus-visible:ring-primary",
                                  tc.isPublic
                                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                                    : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                                )}
                              >
                                <option value="public">PUBLIC</option>
                                <option value="private">PRIVATE</option>
                              </select>
                              
                              <span className="font-heading text-xs font-bold">
                                Test Case {index + 1}: {tc.isPublic ? "Base Case" : "Validation Case"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => removeTestCase(index)}
                                className="p-1 text-zinc-400 hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                title="Delete Test Case"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Input Field */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                                Input
                              </span>
                              <Input
                                value={tc.input}
                                onChange={(e) => updateTestCase(index, "input", e.target.value)}
                                className="font-mono text-xs dark:bg-zinc-900"
                                placeholder="{'A': [('B', 1)]}, 'A'"
                              />
                            </div>

                            {/* Expected Output Field */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                                Expected Output
                              </span>
                              <Input
                                value={tc.expectedOutput}
                                onChange={(e) => updateTestCase(index, "expectedOutput", e.target.value)}
                                className="font-mono text-xs dark:bg-zinc-900"
                                placeholder="{'A': 0, 'B': 1}"
                              />
                            </div>
                          </div>

                          {/* Footer Metrics configurations */}
                          <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground border-t border-zinc-100 pt-3 select-none dark:border-zinc-800/60">
                            {/* Time limit */}
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-zinc-400" />
                              <select
                                value={tc.timeLimit}
                                onChange={(e) => updateTestCase(index, "timeLimit", e.target.value)}
                                className="bg-transparent border-0 font-medium text-foreground py-0 pl-0 cursor-pointer focus:ring-0 focus-visible:outline-none"
                              >
                                <option value="0.5s">0.5s</option>
                                <option value="1.0s">1.0s</option>
                                <option value="2.0s">2.0s</option>
                                <option value="5.0s">5.0s</option>
                              </select>
                            </div>

                            {/* Memory limit */}
                            <div className="flex items-center gap-1.5">
                              <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                              <select
                                value={tc.memoryLimit}
                                onChange={(e) => updateTestCase(index, "memoryLimit", e.target.value)}
                                className="bg-transparent border-0 font-medium text-foreground py-0 pl-0 cursor-pointer focus:ring-0 focus-visible:outline-none"
                              >
                                <option value="128MB">128MB</option>
                                <option value="256MB">256MB</option>
                                <option value="512MB">512MB</option>
                                <option value="1024MB">1024MB</option>
                              </select>
                            </div>

                            {/* Match Type */}
                            <div className="flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-zinc-400" />
                              <select
                                value={tc.matchType}
                                onChange={(e) => updateTestCase(index, "matchType", e.target.value)}
                                className="bg-transparent border-0 font-medium text-foreground py-0 pl-0 cursor-pointer focus:ring-0 focus-visible:outline-none"
                              >
                                <option value="Exact Match">Exact Match</option>
                                <option value="Substring Match">Substring Match</option>
                                <option value="Float Deviation">Float Deviation</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Metadata Sidebar Panel Column */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              
              {/* Metadata Form Panel Card */}
              <Card className="shadow-none">
                <CardContent className="p-6 space-y-5">
                  
                  {/* Bloom's Cognitive Level Selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                      Cognitive Level (Bloom's)
                    </span>
                    <select
                      value={question.cognitiveLevel}
                      onChange={(e) => updateField("cognitiveLevel", e.target.value as CognitiveLevel)}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-zinc-800 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="Remembering">Remembering</option>
                      <option value="Understanding">Understanding</option>
                      <option value="Applying">Applying</option>
                      <option value="Analyzing">Analyzing</option>
                      <option value="Evaluating">Evaluating</option>
                      <option value="Creating">Creating</option>
                    </select>
                  </div>

                  {/* Evaluation Rules */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none block border-b border-zinc-100 pb-1.5 dark:border-zinc-800/60">
                      Evaluation Rules
                    </span>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Base Points */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                          Base Points
                        </span>
                        <Input
                          type="number"
                          value={question.basePoints}
                          onChange={(e) => updateField("basePoints", parseInt(e.target.value) || 0)}
                          className="text-sm dark:bg-zinc-900"
                        />
                      </div>

                      {/* Negative Marking */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                          Negative Marking (%)
                        </span>
                        <Input
                          type="number"
                          value={question.negativeMarking}
                          onChange={(e) => updateField("negativeMarking", parseInt(e.target.value) || 0)}
                          className="text-sm dark:bg-zinc-900"
                        />
                      </div>
                    </div>

                    {/* Partial Marking Toggle */}
                    <div className="flex items-center justify-between text-xs py-1 select-none">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Partial Marking</span>
                      <Switch
                        checked={question.partialMarking}
                        onCheckedChange={(checked) => updateField("partialMarking", checked)}
                      />
                    </div>
                  </div>

                  {/* Difficulty selector */}
                  <div className="space-y-2 select-none">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase block">
                      Difficulty Level
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {["Easy", "Medium", "Hard", "Expert"].map((diff) => {
                        const isSelected = question.difficulty === diff
                        return (
                          <button
                            key={diff}
                            onClick={() => updateField("difficulty", diff as QuestionDifficulty)}
                            className={cn(
                              "h-7 px-1 text-[10px] font-bold rounded-lg border transition-all text-center uppercase tracking-wide",
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : "border-border bg-white text-muted-foreground hover:bg-zinc-50 dark:bg-zinc-800"
                            )}
                          >
                            {diff === "Medium" ? "Med" : diff === "Expert" ? "Exp" : diff}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Topic tags list */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none block">
                      Topic Tags
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-1.5">
                      {question.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="px-2 py-0.5 text-xs font-semibold gap-1"
                        >
                          {tag}
                          <X
                            onClick={() => removeTopicTag(tag)}
                            className="h-3 w-3 text-zinc-400 hover:text-foreground cursor-pointer shrink-0"
                          />
                        </Badge>
                      ))}
                    </div>

                    {/* Add Tag row */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Input
                        value={newTopicTag}
                        onChange={(e) => setNewTopicTag(e.target.value)}
                        placeholder="Add topic..."
                        className="h-8 text-xs dark:bg-zinc-900"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTopicTag(); } }}
                      />
                      <Button
                        variant="outline"
                        onClick={addTopicTag}
                        className="h-8 text-xs px-2 shadow-none"
                      >
                        + Add
                      </Button>
                    </div>
                  </div>

                  {/* Skill tags list */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none block">
                      Skill Tags
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(question.skills || []).map(skill => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="px-2 py-0.5 text-xs font-semibold gap-1 bg-purple-50/5 text-purple-700 border-purple-200 dark:text-purple-400 dark:border-purple-800"
                        >
                          {skill}
                          <X
                            onClick={() => removeSkillTag(skill)}
                            className="h-3 w-3 text-zinc-400 hover:text-foreground cursor-pointer shrink-0"
                          />
                        </Badge>
                      ))}
                    </div>

                    {/* Add Skill row */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Input
                        value={newSkillTag}
                        onChange={(e) => setNewSkillTag(e.target.value)}
                        placeholder="Add skill..."
                        className="h-8 text-xs dark:bg-zinc-900"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkillTag(); } }}
                      />
                      <Button
                        variant="outline"
                        onClick={addSkillTag}
                        className="h-8 text-xs px-2 shadow-none"
                      >
                        + Add
                      </Button>
                    </div>
                  </div>

                  {/* Default Grading Mode */}
                  <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-4 dark:border-zinc-800/60">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                      Default Grading Mode
                    </span>
                    <select
                      value={question.defaultGradingMode}
                      onChange={(e) => updateField("defaultGradingMode", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-zinc-800 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="Exact String Match">Exact String Match</option>
                      <option value="Option Matching">Option Matching</option>
                      <option value="Token Matching">Token Matching</option>
                      <option value="Custom Validator Script">Custom Validator Script</option>
                    </select>
                  </div>

                </CardContent>
              </Card>

              {/* Sync status card */}
              <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 select-none">
                <RefreshCw className="h-5 w-5 text-emerald-600 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                <div className="flex flex-col text-xs font-semibold">
                  <span>Syncing to Exam Bank</span>
                  <span className="text-[10px] font-normal text-emerald-700/80 dark:text-emerald-400/80">
                    Next publish cycle: In {publishTimer} mins
                  </span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default function QuestionEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground">
        Loading Question Editor Context...
      </div>
    }>
      <EditorContent />
    </Suspense>
  )
}
