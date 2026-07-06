import React from 'react';
import { CircleDot, CheckSquare, Code2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { QuestionType } from '@/types/team2/question';

interface TypeSelectorProps {
  currentType: QuestionType;
  onTypeChange: (type: QuestionType) => void;
}

export function TypeSelector({ currentType, onTypeChange }: TypeSelectorProps) {
  const types = [
    {
      value: 'MCQ' as QuestionType,
      label: 'MCQ (Single)',
      Icon: CircleDot,
      marker: (isActive: boolean) => (
        <div className="absolute top-3 right-3 h-4 w-4 rounded-full border flex items-center justify-center">
          {isActive && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
        </div>
      ),
    },
    {
      value: 'MRQ' as QuestionType,
      label: 'MRQ (Multiple)',
      Icon: CheckSquare,
      marker: (isActive: boolean) => (
        <div className="absolute top-3 right-3 h-4 w-4 rounded border flex items-center justify-center">
          {isActive && <span className="h-2.5 w-2.5 bg-primary rounded-sm" />}
        </div>
      ),
    },
    {
      value: 'Programming' as QuestionType,
      label: 'Programming',
      Icon: Code2,
      marker: (isActive: boolean) => (
        <div className="absolute top-3 right-3 h-4 w-4 rounded-full border flex items-center justify-center">
          {isActive && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <span className="section-label mb-4 block">Question Type</span>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Question type">
          {types.map(({ value, label, Icon, marker }) => {
            const isActive = currentType === value;
            return (
              <div
                key={value}
                role="radio"
                tabIndex={0}
                aria-checked={isActive}
                onClick={() => onTypeChange(value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onTypeChange(value);
                  }
                }}
                className={cn(
                  'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-5 transition-all select-none hover:bg-zinc-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:hover:bg-zinc-900/10',
                  isActive
                    ? 'border-primary bg-purple-50/10'
                    : 'border-border bg-white dark:bg-zinc-800'
                )}
              >
                <Icon className={cn('h-6 w-6 mb-2', isActive ? 'text-primary' : 'text-zinc-400')} />
                <span className="font-semibold text-sm">{label}</span>
                {marker(isActive)}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
