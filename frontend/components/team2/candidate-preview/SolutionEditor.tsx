import React from 'react';
import { RotateCw, Settings, Play, Save, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/types/team2/question';

interface SolutionEditorProps {
  question: Question;
  codeValue: string;
  onChangeCode: (val: string) => void;
  onResetCode: () => void;
  consoleOutput: string | null;
  onClearConsole: () => void;
  isRunningTests: boolean;
  onRunTests: () => void;
  lastSavedString: string;
  onSaveProgress: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SolutionEditor({
  question,
  codeValue,
  onChangeCode,
  onResetCode,
  consoleOutput,
  onClearConsole,
  isRunningTests,
  onRunTests,
  lastSavedString,
  onSaveProgress,
  onNext,
  onPrev,
}: SolutionEditorProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-4 lg:max-w-[55%]">
      <Card className="flex min-h-[400px] flex-1 flex-col overflow-hidden lg:min-h-[500px]">
        <div className="bg-zinc-100 border-b border-border px-5 py-3 flex items-center justify-between text-sm select-none dark:bg-zinc-900">
          <span className="font-heading font-bold text-zinc-800 dark:text-zinc-200">
            Solution Editor {question.type === 'Programming' ? '(JavaScript)' : '(Selection)'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetCode}
              className="toolbar-btn"
              title="Reset to starter template"
              aria-label="Reset to starter template"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              title="Editor configuration"
              aria-label="Editor configuration"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dark Code Input panel */}
        <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-50 font-mono text-xs overflow-hidden relative">
          <textarea
            value={codeValue}
            onChange={(e) => onChangeCode(e.target.value)}
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
                  onClick={onClearConsole}
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
            onClick={onRunTests}
            disabled={isRunningTests || question.type !== 'Programming'}
            className="h-8 text-xs font-bold border-primary text-primary hover:bg-primary/5 gap-1.5 shadow-none"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {isRunningTests ? 'Running...' : 'Run Tests'}
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
          onClick={onPrev}
          className="h-10 border-border bg-white text-xs font-bold text-zinc-700 shadow-none hover:bg-zinc-50"
        >
          <ChevronLeft className="mr-1 h-4 w-4 shrink-0" />
          Previous
        </Button>

        <Button
          onClick={onSaveProgress}
          className="h-10 bg-[#7f4d79] text-xs font-bold text-white hover:bg-[#653660]"
        >
          <Save className="mr-1 h-4 w-4 shrink-0" />
          Save Progress
        </Button>

        <Button
          onClick={onNext}
          className="h-10 bg-[#FF6200] text-xs font-bold text-white hover:bg-[#e05600]"
        >
          Save & Next
          <ChevronRight className="ml-1 h-4 w-4 shrink-0" />
        </Button>
      </div>
    </section>
  );
}
