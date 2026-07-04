import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionNavState {
  answered: boolean;
  flagged: boolean;
}

interface QuestionNavigatorProps {
  activeNavIndex: number;
  questionStates: Record<number, QuestionNavState>;
  isNavOpen: boolean;
  setIsNavOpen: (open: boolean) => void;
  onSelectQuestion: (index: number) => void;
}

export function QuestionNavigator({
  activeNavIndex,
  questionStates,
  isNavOpen,
  setIsNavOpen,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  return (
    <aside className="w-full shrink-0 lg:w-64 xl:w-72">
      <div className="flex flex-col rounded-xl border border-border bg-white dark:bg-zinc-950">
        <button
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
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
            'flex flex-col justify-between border-t border-zinc-100 px-4 pb-4 dark:border-zinc-800',
            'max-lg:overflow-hidden max-lg:transition-all max-lg:duration-200',
            isNavOpen
              ? 'max-lg:max-h-[480px] max-lg:opacity-100'
              : 'max-lg:max-h-0 max-lg:border-t-0 max-lg:opacity-0 max-lg:pb-0',
            'lg:max-h-none lg:opacity-100 lg:pb-5 lg:pt-2'
          )}
        >
          <div
            className="grid grid-cols-5 gap-2 py-4 select-none sm:grid-cols-9 lg:grid-cols-5"
            role="list"
            aria-label="Question list"
          >
            {Array.from({ length: 45 }).map((_, idx) => {
              const num = idx + 1;
              const state = questionStates[num] || { answered: false, flagged: false };
              const isActive = num === activeNavIndex;

              return (
                <button
                  key={num}
                  type="button"
                  role="listitem"
                  aria-label={`Question ${num}${isActive ? ', current' : ''}${
                    state.flagged ? ', flagged' : ''
                  }${state.answered ? ', answered' : ''}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => {
                    onSelectQuestion(num);
                    if (window.innerWidth < 1024) setIsNavOpen(false);
                  }}
                  className={cn(
                    'flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                    isActive
                      ? 'scale-105 border-primary bg-primary text-white'
                      : state.answered
                      ? 'border-purple-200 bg-purple-100/50 text-primary dark:bg-purple-950/20 dark:text-purple-300'
                      : state.flagged
                      ? 'border-amber-300 bg-amber-100/50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300'
                      : 'border-border bg-white text-muted-foreground hover:bg-zinc-50 dark:bg-zinc-900'
                  )}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 border-t border-zinc-100 pt-4 text-xs font-semibold text-muted-foreground select-none dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full bg-purple-200 dark:bg-purple-800"
                aria-hidden="true"
              />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-300" aria-hidden="true" />
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700"
                aria-hidden="true"
              />
              <span>Unvisited</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
