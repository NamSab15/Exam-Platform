import React from "react"
import { Users, Radio, AlertTriangle, ShieldAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricsCardsProps {
  totalStudents: number;
  activeSessions: number;
  flaggedStudents: number;
  suspendedStudents: number;
}

export function MetricsCards({
  totalStudents,
  activeSessions,
  flaggedStudents,
  suspendedStudents,
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Students */}
      <Card className="border-border/30 bg-card">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-accent p-2 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">
              +12%
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Total Students
            </span>
            <div className="font-heading text-4xl font-extrabold text-foreground leading-tight mt-1">
              {totalStudents}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-border/30 bg-card">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-accent p-2 text-primary">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <span className="flex h-2 w-2 rounded-full bg-success mt-2" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Active Sessions
            </span>
            <div className="font-heading text-4xl font-extrabold text-foreground leading-tight mt-1">
              {activeSessions}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flagged Students */}
      <Card className="border-border/30 bg-card">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-accent p-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-bold text-warning">
              Action Needed
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Flagged Students
            </span>
            <div className="font-heading text-4xl font-extrabold text-warning leading-tight mt-1">
              {flaggedStudents}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suspended Students */}
      <Card className="border-border/30 bg-card">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/20 p-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Suspended
            </span>
            <div className="font-heading text-4xl font-extrabold text-destructive leading-tight mt-1">
              {suspendedStudents}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
