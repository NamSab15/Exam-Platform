'use client'

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Database,
  Link2,
  Trash2,
  Copy,
  FileEdit,
  Eye,
  Clock,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Code2,
  CheckSquare,
  CircleDot,
  Upload,
  ArrowDownToLine,
  Filter
} from "lucide-react"

import { getQuestions, saveQuestion, duplicateQuestion, deleteQuestion, resetQuestions } from "@/lib/mockData"
import { Question, QuestionType, QuestionDifficulty, QuestionStatus } from "@/types/question"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { AdminHeader } from "@/components/shared/admin-header"

export default function QuestionBankPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("All Types")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("") // Empty string means "All"
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics")
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status")
  const [selectedCreator, setSelectedCreator] = useState<string>("All Creators")

  // UI Interactive States
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Load questions
  const loadData = () => {
    setQuestions(getQuestions())
  }

  useEffect(() => {
    loadData()
  }, [])

  // Derived Statistics
  const totalLibraryCount = questions.length
  const referencedCount = questions.reduce((acc, q) => acc + (q.refCount > 0 ? 1 : 0), 0)
  
  const publishedCount = questions.filter(q => q.status === "Published").length
  const draftCount = questions.filter(q => q.status === "Draft").length
  const retiredCount = questions.filter(q => q.status === "Retired").length

  const publishedPercentage = totalLibraryCount > 0 ? (publishedCount / totalLibraryCount) * 100 : 0
  const draftPercentage = totalLibraryCount > 0 ? (draftCount / totalLibraryCount) * 100 : 0
  const retiredPercentage = totalLibraryCount > 0 ? (retiredCount / totalLibraryCount) * 100 : 0

  // Filter Actions
  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedType("All Types")
    setSelectedDifficulty("")
    setSelectedTopic("All Topics")
    setSelectedStatus("All Status")
    setSelectedCreator("All Creators")
    setCurrentPage(1)
  }

  // Get all unique topics from questions for dropdown
  const allTopics = Array.from(new Set(questions.flatMap(q => q.tags)))
  // Get all unique creators
  const allCreators = Array.from(new Set(questions.map(q => q.creator)))

  // Filter matching
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.creator.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "All Types" || q.type === selectedType
    
    // Wireframe difficulty pill maps to 'Easy', 'Med' -> 'Medium', 'Hard', 'Exp' -> 'Expert'
    let targetDiff = selectedDifficulty
    if (selectedDifficulty === "Med") targetDiff = "Medium"
    if (selectedDifficulty === "Exp") targetDiff = "Expert"
    const matchesDifficulty = !selectedDifficulty || q.difficulty === targetDiff

    const matchesTopic = selectedTopic === "All Topics" || q.tags.includes(selectedTopic)
    const matchesStatus = selectedStatus === "All Status" || q.status === selectedStatus
    const matchesCreator = selectedCreator === "All Creators" || q.creator === selectedCreator

    return matchesSearch && matchesType && matchesDifficulty && matchesTopic && matchesStatus && matchesCreator
  })

  // Pagination Constants
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage) || 1
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Question row actions
  const handleDuplicate = (id: string) => {
    duplicateQuestion(id)
    loadData()
  }

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (questionToDelete) {
      deleteQuestion(questionToDelete.id)
      setIsDeleteDialogOpen(false)
      setQuestionToDelete(null)
      loadData()
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter(rowId => rowId !== id))
    } else {
      setSelectedRowIds([...selectedRowIds, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedRowIds.length === paginatedQuestions.length) {
      setSelectedRowIds([])
    } else {
      setSelectedRowIds(paginatedQuestions.map(q => q.id))
    }
  }

  // Helper to map QuestionType to visual badges/icons
  const renderTypeCell = (type: QuestionType, difficulty: QuestionDifficulty) => {
    const diffVariant = 
      difficulty === "Easy" ? "easy" : 
      difficulty === "Medium" ? "medium" : 
      difficulty === "Hard" ? "hard" : "expert"

    let TypeIcon = Code2
    let typeName = "PQ"

    if (type === "MCQ") {
      TypeIcon = CircleDot
      typeName = "MCQ"
    } else if (type === "MRQ") {
      TypeIcon = CheckSquare
      typeName = "MRQ"
    }

    return (
      <div className="flex flex-col items-start gap-1 select-none">
        <div className="flex items-center gap-1.5 font-heading text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <TypeIcon className="h-3.5 w-3.5 text-zinc-500" />
          <span>{typeName}</span>
        </div>
        <span className={cn(
          "text-[9px] font-extrabold uppercase tracking-wider",
          difficulty === "Easy" && "text-teal-600 dark:text-teal-400",
          difficulty === "Medium" && "text-amber-600 dark:text-amber-400",
          difficulty === "Hard" && "text-purple-600 dark:text-purple-400",
          difficulty === "Expert" && "text-rose-600 dark:text-rose-400"
        )}>
          {difficulty}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-foreground">
      {/* Sidebar Layout */}
      <AdminSidebar />

      {/* Main Content Layout Wrapper */}
      <div className="pl-72 flex flex-col min-h-screen">
        <AdminHeader searchValue={searchQuery} onSearchChange={setSearchQuery} />

        {/* Content area container */}
        <main className="flex-1 p-8 space-y-6 container-app">
          {/* Breadcrumb & Top Command Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span className="text-zinc-800 dark:text-zinc-200">Question Bank</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Reset database helper */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetQuestions()
                  loadData()
                }}
                className="gap-1.5 text-xs text-muted-foreground border-dashed"
                title="Reset local storage questions to default mock set"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Mock
              </Button>

              {/* Bulk Import */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkImportOpen(true)}
                  className="gap-1.5 text-xs"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Bulk Import
                  <span className="text-[10px] ml-0.5 opacity-60">▼</span>
                </Button>
              </div>

              {/* Create Question */}
              <Button
                onClick={() => router.push("/question-editor?new=true")}
                className="gap-1.5 bg-primary text-white hover:bg-primary/95 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                New Question
              </Button>
            </div>
          </div>

          {/* Filtering Control Panel */}
          <Card className="shadow-none">
            <CardContent className="p-5 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                    Type
                  </span>
                  <select
                    value={selectedType}
                    onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-zinc-800 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="All Types">All Types</option>
                    <option value="MCQ">MCQ (Single)</option>
                    <option value="MRQ">MRQ (Multiple)</option>
                    <option value="Programming">Programming</option>
                  </select>
                </div>

                {/* Topic / Skill Filter */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                    Topic / Skill
                  </span>
                  <select
                    value={selectedTopic}
                    onChange={(e) => { setSelectedTopic(e.target.value); setCurrentPage(1); }}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-zinc-800 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="All Topics">All Topics</option>
                    {allTopics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                    Status
                  </span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-zinc-800 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>

                {/* Creator Filter */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                    Creator
                  </span>
                  <select
                    value={selectedCreator}
                    onChange={(e) => { setSelectedCreator(e.target.value); setCurrentPage(1); }}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-zinc-800 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="All Creators">All Creators</option>
                    {allCreators.map(creator => (
                      <option key={creator} value={creator}>{creator}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty selector (Pills) + Clear Button Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800/60">
                {/* Difficulty Pills */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                    Difficulty
                  </span>
                  <div className="flex items-center gap-1.5">
                    {["Easy", "Med", "Hard", "Exp"].map((diff) => {
                      const isActive = selectedDifficulty === diff
                      return (
                        <button
                          key={diff}
                          onClick={() => {
                            setSelectedDifficulty(isActive ? "" : diff)
                            setCurrentPage(1)
                          }}
                          className={cn(
                            "h-7 px-3 text-xs font-semibold rounded-lg border transition-all select-none",
                            isActive
                              ? "bg-primary border-primary text-white"
                              : "border-border bg-white hover:bg-zinc-50 text-muted-foreground dark:bg-zinc-800"
                          )}
                        >
                          {diff}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Clear all filters */}
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline select-none sm:self-center"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear All Filters
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid: Split Stats & List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Stats card stack */}
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
              
              {/* Stat card 1: Total Library */}
              <Card className="shadow-none">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-primary dark:bg-purple-950/30">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-tight text-foreground leading-none">
                      {totalLibraryCount}
                    </span>
                    <span className="font-heading text-xs font-bold text-zinc-900 dark:text-zinc-150 mt-1 select-none">
                      Total Library
                    </span>
                    <span className="text-[10px] text-muted-foreground select-none">
                      Active & archived items
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Stat card 2: Referenced */}
              <Card className="shadow-none">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/20">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-tight text-foreground leading-none">
                      {referencedCount}
                    </span>
                    <span className="font-heading text-xs font-bold text-zinc-900 dark:text-zinc-150 mt-1 select-none">
                      Referenced
                    </span>
                    <span className="text-[10px] text-muted-foreground select-none">
                      Used in multiple exams
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Stat card 3: Status Breakdown */}
              <Card className="shadow-none">
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-sm font-bold text-zinc-900 select-none">
                    Status Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  {/* Published */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs select-none">
                      <span className="font-medium text-muted-foreground">Published</span>
                      <span className="font-semibold text-emerald-600">{publishedCount}</span>
                    </div>
                    <Progress value={publishedPercentage} indicatorClassName="bg-emerald-500" />
                  </div>
                  {/* Draft */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs select-none">
                      <span className="font-medium text-muted-foreground">Draft</span>
                      <span className="font-semibold text-amber-500">{draftCount}</span>
                    </div>
                    <Progress value={draftPercentage} indicatorClassName="bg-amber-500" />
                  </div>
                  {/* Retired */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs select-none">
                      <span className="font-medium text-muted-foreground">Retired</span>
                      <span className="font-semibold text-zinc-500">{retiredCount}</span>
                    </div>
                    <Progress value={retiredPercentage} indicatorClassName="bg-zinc-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right List Card */}
            <Card className="col-span-1 lg:col-span-9 shadow-none overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                  {/* Table Header */}
                  <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-border select-none">
                    <tr className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      <th className="w-12 py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedRowIds.length > 0 && selectedRowIds.length === paginatedQuestions.length}
                          onChange={handleSelectAll}
                          className="rounded border-zinc-300 text-primary focus:ring-primary h-4 w-4 shrink-0"
                        />
                      </th>
                      <th className="py-3 px-4 w-1/2">Question & Meta</th>
                      <th className="py-3 px-4 w-1/6">Type</th>
                      <th className="py-3 px-4 w-1/6">Status</th>
                      <th className="py-3 px-4 w-1/6 text-right">Actions</th>
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {paginatedQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No questions matching your search filters. Click "Reset Mock" or clear filters to start over.
                        </td>
                      </tr>
                    ) : (
                      paginatedQuestions.map((q) => {
                        const isSelected = selectedRowIds.includes(q.id)
                        const isRetired = q.status === "Retired"

                        return (
                          <tr
                            key={q.id}
                            className={cn(
                              "hover:bg-zinc-50/50 transition-colors group dark:hover:bg-zinc-900/20",
                              isSelected && "bg-secondary/20 dark:bg-zinc-800/30"
                            )}
                          >
                            {/* Checkbox */}
                            <td className="py-5 px-4 align-top">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectRow(q.id)}
                                className="rounded border-zinc-300 text-primary focus:ring-primary h-4 w-4 shrink-0 mt-0.5"
                              />
                            </td>

                            {/* Question & Meta */}
                            <td className="py-5 px-4 align-top space-y-2">
                              <div className="flex items-start gap-2 flex-wrap">
                                <Link
                                  href={`/question-editor?id=${q.id}`}
                                  className={cn(
                                    "font-heading font-semibold hover:underline text-sm md:text-base leading-snug",
                                    isRetired
                                      ? "text-zinc-400 line-through dark:text-zinc-500"
                                      : "text-primary dark:text-purple-400"
                                  )}
                                >
                                  {q.title}
                                </Link>
                                <span className="text-[10px] font-bold text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded leading-none">
                                  {q.version}
                                </span>
                              </div>

                              {/* Badges and tags */}
                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                {q.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="px-1.5 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                                {q.refCount > 0 && (
                                  <Link
                                    href="#"
                                    className="flex items-center gap-1 text-[10px] font-semibold text-[#510047] hover:underline dark:text-purple-300 ml-1"
                                  >
                                    <Link2 className="h-3 w-3" />
                                    Ref: {q.refCount}
                                  </Link>
                                )}
                              </div>
                            </td>

                            {/* Type & Difficulty */}
                            <td className="py-5 px-4 align-top">
                              {renderTypeCell(q.type, q.difficulty)}
                            </td>

                            {/* Status */}
                            <td className="py-5 px-4 align-top">
                              <Badge
                                variant={
                                  q.status === "Published"
                                    ? "published"
                                    : q.status === "Draft"
                                    ? "draft"
                                    : "retired"
                                }
                                showDot
                                className="py-0.5 px-2"
                              >
                                {q.status}
                              </Badge>
                            </td>

                            {/* Actions */}
                            <td className="py-5 px-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isRetired ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => router.push(`/candidate-preview?id=${q.id}`)}
                                      title="Preview question as candidate"
                                      className="text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      title="Version History"
                                      className="text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                      <Clock className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => router.push(`/question-editor?id=${q.id}`)}
                                      title="Edit question config"
                                      className="text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                      <FileEdit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => handleDuplicate(q.id)}
                                      title="Duplicate config"
                                      className="text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleDeleteClick(q)}
                                  title="Delete question permanently"
                                  className="text-zinc-400 hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              {filteredQuestions.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-white dark:bg-zinc-950 select-none">
                  <span className="text-xs text-muted-foreground font-medium">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredQuestions.length)} of{" "}
                    {filteredQuestions.length} questions
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none transition-colors dark:bg-zinc-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Pagination Numbers */}
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1
                      // Simple pager truncation rules if pages count is very large
                      if (
                        totalPages > 5 &&
                        pageNum !== 1 &&
                        pageNum !== totalPages &&
                        Math.abs(pageNum - currentPage) > 1
                      ) {
                        if (pageNum === 2 && currentPage > 3) {
                          return (
                            <span key="dots-start" className="px-1 text-zinc-400 text-xs">
                              ...
                            </span>
                          )
                        }
                        if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                          return (
                            <span key="dots-end" className="px-1 text-zinc-400 text-xs">
                              ...
                            </span>
                          )
                        }
                        return null
                      }

                      const isActive = currentPage === pageNum
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "h-8 w-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-colors",
                            isActive
                              ? "bg-primary text-white"
                              : "hover:bg-zinc-50 border border-transparent hover:border-border text-muted-foreground"
                          )}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    {/* Next Button */}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none transition-colors dark:bg-zinc-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Dialog Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-50">Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete "
              <span className="font-semibold text-foreground">{questionToDelete?.title}</span>"? 
              This action cannot be undone and will delete it from all associated mock exams.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import CSV Dialog */}
      <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
        <DialogContent onClose={() => setIsBulkImportOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-50">Bulk Import Questions</DialogTitle>
            <DialogDescription>
              Upload questions using CSV/Excel spreadsheet sheets containing tags, type parameters, and markdown contents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 transition-colors cursor-pointer select-none">
            <ArrowDownToLine className="h-8 w-8 text-zinc-400 mb-2" />
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Drag & Drop your spreadsheet here
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Supports .csv, .xlsx (Max 5MB)
            </span>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkImportOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsBulkImportOpen(false)
                alert("Bulk Import Successful! (Mocked response)")
              }}
              className="bg-primary text-white hover:bg-primary/95"
            >
              Upload & Parse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
