import React from "react"
import { ShieldCheck, AlertTriangle, Play, Flame, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Average Trust Score */}
      <Card className="border-border/30 bg-card">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-accent p-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-0.5 text-success font-bold text-xs bg-success/15 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" />
              2.4%
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Average Trust Score
            </span>
            <div className="font-heading text-4xl font-extrabold text-primary leading-tight mt-1">
              94%
            </div>
            <div className="mt-4 h-1.5 w-full bg-accent rounded-full overflow-hidden">
              <div className="h-full bg-success w-[94%]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Warnings */}
      <Card className="border-border/30 bg-card">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-accent p-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-0.5 text-destructive font-bold text-xs bg-destructive/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" />
              12%
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Total Warnings
            </span>
            <div className="font-heading text-4xl font-extrabold text-primary leading-tight mt-1">
              1,240
            </div>
            <div className="mt-4 flex items-end gap-1.5 h-6 text-xs text-muted-foreground">
              <span>Weekly trend:</span>
              <span className="text-warning font-semibold">Elevated</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Examinations */}
      <Card className="border-border/30 bg-card">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-accent p-2 text-primary">
              <Play className="h-5 w-5 fill-primary" />
            </div>
            <div className="text-xs font-bold text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
              Stable
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Live Examinations
            </span>
            <div className="font-heading text-4xl font-extrabold text-primary leading-tight mt-1">
              842
            </div>
            <div className="mt-4 flex -space-x-1.5 overflow-hidden">
              <div className="w-5 h-5 rounded-full border-2 border-card bg-primary" />
              <div className="w-5 h-5 rounded-full border-2 border-card bg-secondary" />
              <div className="w-5 h-5 rounded-full border-2 border-card bg-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High-Risk Ratio */}
      <Card className="border-border/30 bg-card">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/20 p-2 text-destructive">
              <Flame className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
              High
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              High-Risk Ratio
            </span>
            <div className="font-heading text-4xl font-extrabold text-primary leading-tight mt-1">
              4.2%
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 bg-accent h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-destructive w-[42%]" />
              </div>
              <span className="text-[9px] font-bold text-muted-foreground">vs 3.1% avg</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
