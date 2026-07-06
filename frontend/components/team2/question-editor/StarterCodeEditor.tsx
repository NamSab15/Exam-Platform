import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StarterCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function StarterCodeEditor({ value, onChange }: StarterCodeEditorProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 select-none">
          <span className="section-label">Starter Code & Environment</span>
          <span className="text-[11px] text-muted-foreground italic">
            Read-only code block provided to candidates
          </span>
        </div>

        <div className="flex items-center gap-3 select-none">
          <select
            className="form-select w-auto min-w-[180px]"
            defaultValue="python"
            aria-label="Programming language"
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
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 bg-zinc-950 text-zinc-50 font-mono text-xs focus-visible:outline-none leading-relaxed border-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
