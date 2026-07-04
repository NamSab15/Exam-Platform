import React from 'react';
import { Database, Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Question } from '@/types/team2/question';

interface StatsCardsProps {
  questions: Question[];
}

export function StatsCards({ questions }: StatsCardsProps) {
  const totalLibraryCount = questions.length;
  const referencedCount = questions.reduce((acc, q) => acc + (q.refCount > 0 ? 1 : 0), 0);

  const publishedCount = questions.filter((q) => q.status === 'Published').length;
  const draftCount = questions.filter((q) => q.status === 'Draft').length;
  const retiredCount = questions.filter((q) => q.status === 'Retired').length;

  const publishedPercentage = totalLibraryCount > 0 ? (publishedCount / totalLibraryCount) * 100 : 0;
  const draftPercentage = totalLibraryCount > 0 ? (draftCount / totalLibraryCount) * 100 : 0;
  const retiredPercentage = totalLibraryCount > 0 ? (retiredCount / totalLibraryCount) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 xl:col-span-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-primary dark:bg-purple-950/30">
            <Database className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-foreground leading-none">
              {totalLibraryCount}
            </span>
            <span className="font-heading text-xs font-bold text-zinc-900 dark:text-zinc-150 mt-1 select-none">
              Total Library
            </span>
            <span className="text-[10px] text-muted-foreground select-none">
              Active & archived items
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/20">
            <Link2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-foreground leading-none">
              {referencedCount}
            </span>
            <span className="font-heading text-xs font-bold text-zinc-900 dark:text-zinc-150 mt-1 select-none">
              Referenced
            </span>
            <span className="text-[10px] text-muted-foreground select-none">
              Used in multiple exams
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-sm font-bold select-none">
            Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs select-none">
              <span className="font-medium text-muted-foreground">Published</span>
              <span className="font-semibold text-emerald-600">{publishedCount}</span>
            </div>
            <Progress value={publishedPercentage} indicatorClassName="bg-emerald-500" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs select-none">
              <span className="font-medium text-muted-foreground">Draft</span>
              <span className="font-semibold text-amber-500">{draftCount}</span>
            </div>
            <Progress value={draftPercentage} indicatorClassName="bg-amber-500" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs select-none">
              <span className="font-medium text-muted-foreground">Retired</span>
              <span className="font-semibold text-zinc-500">{retiredCount}</span>
            </div>
            <Progress value={retiredPercentage} indicatorClassName="bg-zinc-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
