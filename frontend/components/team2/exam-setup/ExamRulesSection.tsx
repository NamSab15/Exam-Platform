'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Shuffle,
  Eye,
  BookOpen,
  ArrowLeftRight,
  Maximize2,
  Camera,
  CopyX,
  Grid,
} from 'lucide-react';

export interface RulesData {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
  allowReview: boolean;
  allowBackNavigation: boolean;
  fullscreen: boolean;
  webcamProctoring: boolean;
  disableCopyPaste: boolean;
}

interface ExamRulesSectionProps {
  data: RulesData;
  onChange: (field: keyof RulesData, value: boolean) => void;
}

export function ExamRulesSection({ data, onChange }: ExamRulesSectionProps) {
  const rulesList = [
    {
      key: 'shuffleQuestions' as keyof RulesData,
      label: 'Shuffle Questions',
      description: 'Randomize the order of questions for each student.',
      icon: Shuffle,
    },
    {
      key: 'shuffleOptions' as keyof RulesData,
      label: 'Shuffle Options',
      description: 'Randomize options order for MCQ/MRQ type questions.',
      icon: Grid,
    },
    {
      key: 'showResults' as keyof RulesData,
      label: 'Show Results',
      description: 'Disclose grades immediately after test submission.',
      icon: Eye,
    },
    {
      key: 'allowReview' as keyof RulesData,
      label: 'Allow Review',
      description: 'Let candidates review answers after finishing the exam.',
      icon: BookOpen,
    },
    {
      key: 'allowBackNavigation' as keyof RulesData,
      label: 'Allow Back Navigation',
      description: 'Allow returning to previous questions during the test.',
      icon: ArrowLeftRight,
    },
    {
      key: 'fullscreen' as keyof RulesData,
      label: 'Fullscreen Enforcement',
      description: 'Lock candidates in fullscreen; warn/exit on tab switches.',
      icon: Maximize2,
    },
    {
      key: 'webcamProctoring' as keyof RulesData,
      label: 'Webcam Proctoring',
      description: 'Capture student feed and trigger alerts on anomaly detection.',
      icon: Camera,
    },
    {
      key: 'disableCopyPaste' as keyof RulesData,
      label: 'Disable Copy & Paste',
      description: 'Prevent keyboard shortcuts and context menus in editor.',
      icon: CopyX,
    },
  ];

  return (
    <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
      <CardContent className="p-6 space-y-6">
        <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-heading">
            6. Exam Rules & Proctoring Controls
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure examination lock restrictions, randomizations, and supervision details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rulesList.map((rule) => {
            const IconComponent = rule.icon;
            const checked = !!data[rule.key];
            return (
              <div
                key={rule.key}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-zinc-50/20 hover:bg-zinc-50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/40 transition-colors select-none"
              >
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <IconComponent className="h-4.5 w-4.5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {rule.label}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>

                <Switch
                  id={`rule-${rule.key}`}
                  checked={checked}
                  onCheckedChange={(checked) => onChange(rule.key, checked)}
                  className="mt-0.5 shrink-0"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
