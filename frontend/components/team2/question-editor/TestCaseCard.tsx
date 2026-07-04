import React from 'react';
import { Trash2, Clock, Cpu, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TestCase } from '@/types/team2/question';

interface TestCaseCardProps {
  testCase: TestCase;
  index: number;
  onUpdateField: <K extends keyof TestCase>(field: K, value: TestCase[K]) => void;
  onRemove: () => void;
}

export function TestCaseCard({
  testCase,
  index,
  onUpdateField,
  onRemove,
}: TestCaseCardProps) {
  return (
    <div className="space-y-4 rounded-lg border-2 border-emerald-500 bg-white p-6 dark:bg-zinc-800/20">
      <div className="flex items-center justify-between flex-wrap gap-2 select-none">
        <div className="flex items-center gap-2">
          {/* Toggle Public/Private */}
          <select
            value={testCase.isPublic ? 'public' : 'private'}
            onChange={(e) => onUpdateField('isPublic', e.target.value === 'public')}
            className={cn(
              'text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded leading-none border-0 font-sans cursor-pointer focus-visible:ring-1 focus-visible:ring-primary',
              testCase.isPublic
                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
            )}
          >
            <option value="public">PUBLIC</option>
            <option value="private">PRIVATE</option>
          </select>

          <span className="font-heading text-xs font-bold">
            Test Case {index + 1}: {testCase.isPublic ? 'Base Case' : 'Validation Case'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-zinc-400 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            title="Delete Test Case"
            aria-label={`Delete test case ${index + 1}`}
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
            value={testCase.input}
            onChange={(e) => onUpdateField('input', e.target.value)}
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
            value={testCase.expectedOutput}
            onChange={(e) => onUpdateField('expectedOutput', e.target.value)}
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
            value={testCase.timeLimit}
            onChange={(e) => onUpdateField('timeLimit', e.target.value)}
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
            value={testCase.memoryLimit}
            onChange={(e) => onUpdateField('memoryLimit', e.target.value)}
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
            value={testCase.matchType}
            onChange={(e) => onUpdateField('matchType', e.target.value)}
            className="bg-transparent border-0 font-medium text-foreground py-0 pl-0 cursor-pointer focus:ring-0 focus-visible:outline-none"
          >
            <option value="Exact Match">Exact Match</option>
            <option value="Substring Match">Substring Match</option>
            <option value="Float Deviation">Float Deviation</option>
          </select>
        </div>
      </div>
    </div>
  );
}
