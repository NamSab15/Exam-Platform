'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RotateCcw, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

import { DEFAULT_QUESTIONS, getQuestions, duplicateQuestion, deleteQuestion, resetQuestions } from '@/lib/team2/mock/questionMock';
import { Question } from '@/types/team2/question';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from '@/components/shared/admin-sidebar';
import { AdminHeader } from '@/components/shared/admin-header';

import { useQuestionFilters } from '@/hooks/team2/useQuestionFilters';
import { StatsCards } from './StatsCards';
import { QuestionFilters } from './QuestionFilters';
import { QuestionTable } from './QuestionTable';
import { BulkImportDialog } from './BulkImportDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { cn } from '@/lib/utils';

export function QuestionBankClient() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);

  // UI Interactive States
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Load questions from localStorage on mount
  const loadData = () => {
    setQuestions(getQuestions());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const itemsPerPage = 5;
  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTopic,
    setSelectedTopic,
    selectedStatus,
    setSelectedStatus,
    selectedCreator,
    setSelectedCreator,
    selectedRowIds,
    currentPage,
    setCurrentPage,
    allTopics,
    allCreators,
    filteredQuestions,
    paginatedQuestions,
    totalPages,
    handleClearFilters,
    handleSelectRow,
    handleSelectAll,
  } = useQuestionFilters(questions, itemsPerPage);

  const handleDuplicate = (id: string) => {
    duplicateQuestion(id);
    loadData();
  };

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      deleteQuestion(questionToDelete.id);
      setIsDeleteDialogOpen(false);
      setQuestionToDelete(null);
      loadData();
    }
  };

  return (
    <div className="page-shell">
      <AdminSidebar />

      <div className="page-content-offset">
        <AdminHeader searchValue={searchQuery} onSearchChange={setSearchQuery} />

        <main className="page-main container-app">
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
                  resetQuestions();
                  loadData();
                }}
                className="gap-1.5 text-xs text-muted-foreground border-dashed"
                title="Reset local storage questions to default mock set"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Mock
              </Button>

              {/* Bulk Import */}
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

              {/* Create Question */}
              <Button
                onClick={() => router.push('/question-editor?new=true')}
                className="gap-1.5 bg-primary text-white hover:bg-primary/95 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                New Question
              </Button>
            </div>
          </div>

          {/* Filtering Control Panel */}
          <QuestionFilters
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedCreator={selectedCreator}
            setSelectedCreator={setSelectedCreator}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            allTopics={allTopics}
            allCreators={allCreators}
            handleClearFilters={handleClearFilters}
            setCurrentPage={setCurrentPage}
          />

          {/* Main Content Grid: Split Stats & List */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
            <StatsCards questions={questions} />

            <div className="flex flex-col gap-4 xl:col-span-9">
              <QuestionTable
                paginatedQuestions={paginatedQuestions}
                selectedRowIds={selectedRowIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                onDuplicate={handleDuplicate}
                onDeleteClick={handleDeleteClick}
              />

              {/* Table Footer / Pagination */}
              {filteredQuestions.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-4 border border-border rounded-xl bg-white p-4 sm:flex-row dark:bg-zinc-950 select-none">
                  <span className="text-xs text-muted-foreground font-medium">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredQuestions.length)} of{' '}
                    {filteredQuestions.length} questions
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-40 dark:bg-zinc-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Pagination Numbers */}
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
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
                          );
                        }
                        if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                          return (
                            <span key="dots-end" className="px-1 text-zinc-400 text-xs">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          aria-label={`Page ${pageNum}`}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                            isActive
                              ? 'bg-primary text-white'
                              : 'border border-transparent text-muted-foreground hover:border-border hover:bg-zinc-50'
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-40 dark:bg-zinc-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Dialog Confirmation */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        questionToDelete={questionToDelete}
        onConfirm={confirmDelete}
      />

      {/* Bulk Import CSV Dialog */}
      <BulkImportDialog isOpen={isBulkImportOpen} onOpenChange={setIsBulkImportOpen} />
    </div>
  );
}
export default QuestionBankClient;
