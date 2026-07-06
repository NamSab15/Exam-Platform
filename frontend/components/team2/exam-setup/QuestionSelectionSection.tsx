'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/team2/question';
import { Search, ChevronLeft, ChevronRight, CheckSquare, Square, Inbox, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionSelectionSectionProps {
  questions: Question[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function QuestionSelectionSection({
  questions,
  selectedIds,
  onChange,
}: QuestionSelectionSectionProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Derive unique topics
  const allTopics = useMemo(() => {
    return Array.from(new Set(questions.flatMap((q) => q.tags || [])));
  }, [questions]);

  // Filtering logic
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All Types' || q.type === selectedType;

      const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

      const matchesTopic = selectedTopic === 'All Topics' || (q.tags && q.tags.includes(selectedTopic));

      return matchesSearch && matchesType && matchesDifficulty && matchesTopic;
    });
  }, [questions, searchQuery, selectedType, selectedDifficulty, selectedTopic]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage) || 1;
  const paginatedQuestions = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredQuestions, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All Types');
    setSelectedTopic('All Topics');
    setSelectedDifficulty('All');
    setCurrentPage(1);
  };

  const handleToggleQuestion = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  // Header checkbox: selects or deselects all currently visible paginated questions
  const isAllPaginatedSelected = paginatedQuestions.every((q) => selectedIds.includes(q.id));
  const handleToggleSelectAllPaginated = () => {
    const paginatedIds = paginatedQuestions.map((q) => q.id);
    if (isAllPaginatedSelected) {
      onChange(selectedIds.filter((id) => !paginatedIds.includes(id)));
    } else {
      const newSelected = Array.from(new Set([...selectedIds, ...paginatedIds]));
      onChange(newSelected);
    }
  };

  // Total marks calculation
  const calculatedMarks = useMemo(() => {
    return questions
      .filter((q) => selectedIds.includes(q.id))
      .reduce((sum, q) => sum + (q.basePoints || 0), 0);
  }, [questions, selectedIds]);

  return (
    <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
      <CardContent className="p-6 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-heading">
              7. Question Selection Bank
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select assessment questions. Marks are accumulated dynamically.
            </p>
          </div>
          {/* Real-time Counter Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center select-none">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-150 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-lg">
              {selectedIds.length} Selected
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-primary dark:bg-purple-950/20 dark:text-purple-400 px-2.5 py-1 rounded-lg">
              {calculatedMarks} Marks
            </span>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 select-none">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions by title or problem..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="form-select h-9 text-xs"
          >
            <option value="All Types">All Types</option>
            <option value="MCQ">MCQ (Single Choice)</option>
            <option value="MRQ">MRQ (Multiple Choice)</option>
            <option value="Programming">Programming</option>
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentPage(1);
            }}
            className="form-select h-9 text-xs"
          >
            <option value="All Topics">All Topics</option>
            {allTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced difficulty selector & clear all row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1 border-t border-zinc-50 dark:border-zinc-900 select-none text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-label">Difficulty:</span>
            <div className="flex items-center gap-1">
              {['All', 'Easy', 'Medium', 'Hard', 'Expert'].map((diff) => {
                const isActive = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      'px-2.5 py-1 rounded-md border text-[10px] font-bold transition-all cursor-pointer',
                      isActive
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-white text-muted-foreground hover:bg-zinc-50 dark:bg-zinc-800'
                    )}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          {(searchQuery || selectedType !== 'All Types' || selectedTopic !== 'All Topics' || selectedDifficulty !== 'All') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 self-end sm:self-center"
            >
              <X className="h-3 w-3" />
              Clear Selection Filters
            </button>
          )}
        </div>

        {/* Visibility Checklist/Table list */}
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center select-none">
            <Inbox className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-xs font-semibold text-zinc-500">No questions found matching criteria.</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Try searching or clearing active filters.</p>
          </div>
        ) : (
          <div className="border border-zinc-150 rounded-xl overflow-hidden bg-white dark:bg-zinc-950/20 dark:border-zinc-800 select-none">
            {/* Header row */}
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/60 px-4 py-3 border-b border-zinc-150 dark:border-zinc-800 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <button
                type="button"
                onClick={handleToggleSelectAllPaginated}
                className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                title="Select/Deselect visible page"
              >
                {isAllPaginatedSelected ? (
                  <CheckSquare className="h-4.5 w-4.5 text-primary" />
                ) : (
                  <Square className="h-4.5 w-4.5" />
                )}
              </button>
              <span className="flex-1">Question Description</span>
              <span className="w-24 text-center">Type</span>
              <span className="w-24 text-center">Difficulty</span>
              <span className="w-16 text-right">Points</span>
            </div>

            {/* List entries */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {paginatedQuestions.map((q) => {
                const isSelected = selectedIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 transition-colors cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10',
                      isSelected && 'bg-purple-50/15 dark:bg-purple-950/5'
                    )}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleQuestion(q.id);
                      }}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4.5 w-4.5 text-primary" />
                      ) : (
                        <Square className="h-4.5 w-4.5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        {q.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {q.tags &&
                          q.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="px-1.5 py-0.2 text-[9px] font-semibold bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="w-24 shrink-0 text-center">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded dark:bg-zinc-850">
                        {q.type}
                      </span>
                    </div>

                    <div className="w-24 shrink-0 flex justify-center">
                      <Badge variant={q.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard' | 'expert'}>
                        {q.difficulty}
                      </Badge>
                    </div>

                    <div className="w-16 shrink-0 text-right">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {q.basePoints} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredQuestions.length > itemsPerPage && (
          <div className="flex items-center justify-between border border-border rounded-xl bg-zinc-50 dark:bg-zinc-950 px-4 py-3 select-none text-xs font-medium">
            <span className="text-muted-foreground text-[10px]">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredQuestions.length)} of{' '}
              {filteredQuestions.length} visible questions
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1 rounded-lg border border-border bg-white text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none dark:bg-zinc-800 dark:text-zinc-350 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-bold text-zinc-700 dark:text-zinc-300 text-[11px]">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1 rounded-lg border border-border bg-white text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none dark:bg-zinc-800 dark:text-zinc-350 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
