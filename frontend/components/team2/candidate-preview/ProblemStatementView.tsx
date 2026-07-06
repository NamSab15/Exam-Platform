import React from 'react';
import { Flag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/types/team2/question';
import { parseMarkdownToHtml } from '@/lib/team2/parser';
import { cn } from '@/lib/utils';

interface ProblemStatementViewProps {
  question: Question;
  activeNavIndex: number;
  questionStates: Record<number, { answered: boolean; flagged: boolean }>;
  onToggleFlag: () => void;
}

export function ProblemStatementView({
  question,
  activeNavIndex,
  questionStates,
  onToggleFlag,
}: ProblemStatementViewProps) {
  const parsedHtml = parseMarkdownToHtml(question.problemStatement);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto lg:max-w-[45%]">
      {/* Question Meta Title Header */}
      <Card className="shrink-0">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground select-none">
              Question {activeNavIndex} of 45
            </span>
            <span className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50 mt-1 select-none">
              {question.type === 'Programming' ? 'Coding Challenge' : 'Multiple Response'}: {question.title}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFlag}
            className={cn(
              'gap-1.5 text-xs shadow-none shrink-0',
              questionStates[activeNavIndex]?.flagged && 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/20'
            )}
          >
            <Flag className="h-3.5 w-3.5" />
            {questionStates[activeNavIndex]?.flagged ? 'Flagged' : 'Flag for Review'}
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
              dangerouslySetInnerHTML={{ __html: parsedHtml }}
            />
          </div>

          {/* Public Test cases console */}
          {question.testCases && question.testCases.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
              <h5 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-50 select-none">
                Public Test Cases
              </h5>

              {question.testCases
                .filter((tc) => tc.isPublic)
                .map((tc, idx) => (
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
  );
}
