import React from 'react';
import { Question } from '@/types/team2/question';
import { QuestionRow } from './QuestionRow';
import { Card } from '@/components/ui/card';

interface QuestionTableProps {
  paginatedQuestions: Question[];
  selectedRowIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onDuplicate: (id: string) => void;
  onDeleteClick: (q: Question) => void;
}

export function QuestionTable({
  paginatedQuestions,
  selectedRowIds,
  onSelectRow,
  onSelectAll,
  onDuplicate,
  onDeleteClick,
}: QuestionTableProps) {
  const isAllSelected =
    paginatedQuestions.length > 0 &&
    selectedRowIds.length === paginatedQuestions.length;

  return (
    <Card className="overflow-hidden xl:col-span-9">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm" aria-label="Question library">
          {/* Table Header */}
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-border select-none">
            <tr className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all questions on this page"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 shrink-0 rounded border-zinc-300 text-primary focus-visible:ring-2 focus-visible:ring-primary/50"
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
                  No questions matching your search filters. Click Reset Mock or clear filters to start over.
                </td>
              </tr>
            ) : (
              paginatedQuestions.map((q) => {
                const isSelected = selectedRowIds.includes(q.id);
                return (
                  <QuestionRow
                    key={q.id}
                    question={q}
                    isSelected={isSelected}
                    onSelect={() => onSelectRow(q.id)}
                    onDuplicate={onDuplicate}
                    onDeleteClick={onDeleteClick}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
