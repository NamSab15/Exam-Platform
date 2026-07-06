'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Layers, Award, Clock, Save, Eye, Send } from 'lucide-react';

interface SummaryCardsProps {
  selectedQuestionsCount: number;
  sectionsCount: number;
  totalMarks: number;
  duration: number;
  onSaveDraft: () => void;
  onPreview: () => void;
  onPublish: () => void;
  isValid: boolean;
}

export function SummaryCards({
  selectedQuestionsCount,
  sectionsCount,
  totalMarks,
  duration,
  onSaveDraft,
  onPreview,
  onPublish,
  isValid,
}: SummaryCardsProps) {
  const formatDuration = (mins: number) => {
    if (!mins) return '0 min';
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hrs > 0) {
      return `${hrs}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`;
    }
    return `${mins} mins`;
  };

  const summaries = [
    {
      label: 'Questions Selected',
      value: `${selectedQuestionsCount} Qs`,
      icon: HelpCircle,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400',
    },
    {
      label: 'Exam Sections',
      value: `${sectionsCount} Sections`,
      icon: Layers,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400',
    },
    {
      label: 'Target Marks',
      value: `${totalMarks} Marks`,
      icon: Award,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400',
    },
    {
      label: 'Total Duration',
      value: formatDuration(duration),
      icon: Clock,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
    },
  ];

  return (
    <div className="space-y-4 lg:sticky lg:top-24 select-none">
      {/* Aggregated Analytics Card */}
      <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Exam Configuration Summary
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {summaries.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.label} className="p-3 border border-border rounded-xl bg-zinc-50/20 flex flex-col justify-between h-20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium truncate">{item.label}</span>
                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <span className="text-sm font-black text-zinc-800 dark:text-zinc-100 font-heading">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Control Actions Card */}
      <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-5 flex flex-col gap-3">
          {/* Publish Action */}
          <Button
            type="button"
            onClick={onPublish}
            disabled={!isValid}
            className="w-full gap-2 bg-[#510047] text-white hover:bg-[#6c1d5f] font-bold text-xs shadow-none cursor-pointer h-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            Publish Exam
          </Button>

          {/* Inline grid actions */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Preview Action */}
            <Button
              type="button"
              variant="outline"
              onClick={onPreview}
              className="gap-1.5 text-xs shadow-none border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 cursor-pointer h-9.5"
            >
              <Eye className="h-3.5 w-3.5 text-zinc-500" />
              Preview Exam
            </Button>

            {/* Save Draft Action */}
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              className="gap-1.5 text-xs shadow-none border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 cursor-pointer h-9.5"
            >
              <Save className="h-3.5 w-3.5 text-zinc-500" />
              Save Draft
            </Button>
          </div>

          {!isValid && (
            <p className="text-[10px] text-center text-rose-500 dark:text-rose-400 mt-1 select-none leading-relaxed">
              ⚠️ Complete required fields (Exam Name, Duration, Passing Marks, at least 1 Section) to enable Publish.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
