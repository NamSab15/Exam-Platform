import React from 'react';
import { Bold, Italic, Table as TableIcon, Image as ImageIcon, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface ProblemStatementEditorProps {
  value: string;
  onChange: (val: string) => void;
  latexOn: boolean;
  onLatexToggle: (on: boolean) => void;
}

export function ProblemStatementEditor({
  value,
  onChange,
  latexOn,
  onLatexToggle,
}: ProblemStatementEditorProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 select-none">
          <span className="section-label">Problem Statement (Rich Text)</span>

          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
            <span className="hover:underline cursor-pointer">Formatting Guide</span>
            <div className="flex items-center gap-1.5 border-l border-zinc-200 pl-4 dark:border-zinc-800">
              <span>Latex Rendering: {latexOn ? 'ON' : 'OFF'}</span>
              <Switch checked={latexOn} onCheckedChange={onLatexToggle} />
            </div>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div
          className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-zinc-50 p-1.5 select-none dark:bg-zinc-900/60"
          role="toolbar"
          aria-label="Text formatting"
        >
          <button type="button" className="toolbar-btn" title="Bold" aria-label="Bold">
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" className="toolbar-btn" title="Italic" aria-label="Italic">
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="toolbar-btn ml-1 border-l border-zinc-200 pl-2 dark:border-zinc-800"
            title="Table"
            aria-label="Insert table"
          >
            <TableIcon className="h-4 w-4" />
          </button>
          <button type="button" className="toolbar-btn" title="Math Formula" aria-label="Insert math formula">
            <span className="font-serif text-[11px] font-bold italic">fx</span>
          </button>
          <button type="button" className="toolbar-btn" title="Insert Image" aria-label="Insert image">
            <ImageIcon className="h-4 w-4" />
          </button>
          <button type="button" className="toolbar-btn" title="Bullet List" aria-label="Bullet list">
            <List className="h-4 w-4" />
          </button>
        </div>

        <textarea
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Problem statement"
          className="form-textarea min-h-[160px]"
          placeholder="Enter your problem description, constraints, and formulas here..."
        />
      </CardContent>
    </Card>
  );
}
