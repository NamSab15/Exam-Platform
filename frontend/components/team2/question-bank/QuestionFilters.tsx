import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuestionFiltersProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedCreator: string;
  setSelectedCreator: (creator: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  allTopics: string[];
  allCreators: string[];
  handleClearFilters: () => void;
  setCurrentPage: (page: number) => void;
}

export function QuestionFilters({
  selectedType,
  setSelectedType,
  selectedTopic,
  setSelectedTopic,
  selectedStatus,
  setSelectedStatus,
  selectedCreator,
  setSelectedCreator,
  selectedDifficulty,
  setSelectedDifficulty,
  allTopics,
  allCreators,
  handleClearFilters,
  setCurrentPage,
}: QuestionFiltersProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Type Filter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-type" className="section-label">Type</label>
            <select
              id="filter-type"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
            >
              <option value="All Types">All Types</option>
              <option value="MCQ">MCQ (Single)</option>
              <option value="MRQ">MRQ (Multiple)</option>
              <option value="Programming">Programming</option>
            </select>
          </div>

          {/* Topic / Skill Filter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-topic" className="section-label">Topic / Skill</label>
            <select
              id="filter-topic"
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
            >
              <option value="All Topics">All Topics</option>
              {allTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-status" className="section-label">Status</label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
            >
              <option value="All Status">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          {/* Creator Filter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-creator" className="section-label">Creator</label>
            <select
              id="filter-creator"
              value={selectedCreator}
              onChange={(e) => {
                setSelectedCreator(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
            >
              <option value="All Creators">All Creators</option>
              {allCreators.map((creator) => (
                <option key={creator} value={creator}>
                  {creator}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Difficulty selector (Pills) + Clear Button Row */}
        <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/60">
          <div className="flex flex-wrap items-center gap-3">
            <span className="section-label">Difficulty</span>
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by difficulty">
              {['Easy', 'Med', 'Hard', 'Exp'].map((diff) => {
                const isActive = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setSelectedDifficulty(isActive ? '' : diff);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      'h-8 min-w-[3rem] rounded-lg border px-3 text-xs font-semibold transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
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

          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none sm:self-center"
          >
            <X className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
