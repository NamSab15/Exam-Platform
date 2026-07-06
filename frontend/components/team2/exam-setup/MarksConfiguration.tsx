'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';

export interface MarksData {
  totalMarks: number;
  passingMarks: number;
  negativeMarking: number; // percentage
  partialMarking: boolean;
}

interface MarksConfigurationProps {
  data: MarksData;
  onChange: (field: keyof MarksData, value: string | number | boolean) => void;
  calculatedQuestionsPoints: number;
}

export function MarksConfiguration({
  data,
  onChange,
  calculatedQuestionsPoints,
}: MarksConfigurationProps) {
  const isMismatch = data.totalMarks !== calculatedQuestionsPoints && calculatedQuestionsPoints > 0;

  return (
    <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
      <CardContent className="p-6 space-y-6">
        <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-heading">
            3. Marks Configuration
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define point distributions, grade thresholds, and penalty rules.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Total Marks */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-total-marks" className="section-label">
                Total Marks <span className="text-destructive">*</span>
              </label>
              <Input
                id="exam-total-marks"
                type="number"
                min={0}
                placeholder="e.g. 100"
                value={data.totalMarks || ''}
                onChange={(e) => onChange('totalMarks', parseInt(e.target.value) || 0)}
                className="text-sm dark:bg-zinc-900"
                required
              />
            </div>

            {/* Passing Marks */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-passing-marks" className="section-label">
                Passing Marks <span className="text-destructive">*</span>
              </label>
              <Input
                id="exam-passing-marks"
                type="number"
                min={0}
                placeholder="e.g. 40"
                value={data.passingMarks || ''}
                onChange={(e) => onChange('passingMarks', parseInt(e.target.value) || 0)}
                className="text-sm dark:bg-zinc-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
            {/* Negative Marking */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-negative-marking" className="section-label">
                Negative Marking Penalty (%)
              </label>
              <Input
                id="exam-negative-marking"
                type="number"
                min={0}
                max={100}
                placeholder="e.g. 25"
                value={data.negativeMarking || ''}
                onChange={(e) => onChange('negativeMarking', parseInt(e.target.value) || 0)}
                className="text-sm dark:bg-zinc-900"
              />
            </div>

            {/* Partial Marking Toggle */}
            <div className="flex items-center justify-between text-xs py-2 px-3 border border-border rounded-lg bg-zinc-50 dark:bg-zinc-900/50 mt-1 select-none">
              <div className="flex flex-col">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Partial Marking</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Award partial credit for incomplete solutions.</span>
              </div>
              <Switch
                id="exam-partial-marking"
                checked={data.partialMarking}
                onCheckedChange={(checked) => onChange('partialMarking', checked)}
              />
            </div>
          </div>

          {/* Sync status/Warnings helper */}
          {calculatedQuestionsPoints > 0 && (
            <div className="text-xs p-3.5 rounded-lg border flex items-start gap-2 select-none bg-zinc-50 border-border dark:bg-zinc-900/30 text-muted-foreground">
              <AlertCircle className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
              <div className="space-y-1">
                <p>
                  Calculated sum of selected questions: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{calculatedQuestionsPoints} Marks</span>.
                </p>
                {isMismatch && (
                  <p className="text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ Note: Set target Total Marks ({data.totalMarks}) differs from selected questions sum ({calculatedQuestionsPoints}).
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
