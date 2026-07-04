import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestCase } from '@/types/team2/question';
import { TestCaseCard } from './TestCaseCard';

interface TestCaseManagerProps {
  testCases: TestCase[];
  onUpdateTestCase: <K extends keyof TestCase>(
    index: number,
    field: K,
    value: TestCase[K]
  ) => void;
  onAddTestCase: () => void;
  onRemoveTestCase: (index: number) => void;
}

export function TestCaseManager({
  testCases,
  onUpdateTestCase,
  onAddTestCase,
  onRemoveTestCase,
}: TestCaseManagerProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="section-label">Test Case Management</span>
            <span className="text-xs text-muted-foreground select-none">
              Add Public (visible) and Private (grading) test cases.
            </span>
          </div>

          <Button
            onClick={onAddTestCase}
            className="gap-1 bg-primary text-white hover:bg-primary/95 text-xs h-8 px-3"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Test Case
          </Button>
        </div>

        {/* Test cases list */}
        <div className="space-y-4">
          {testCases.map((tc, index) => (
            <TestCaseCard
              key={tc.id}
              testCase={tc}
              index={index}
              onUpdateField={(field, value) => onUpdateTestCase(index, field, value)}
              onRemove={() => onRemoveTestCase(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
