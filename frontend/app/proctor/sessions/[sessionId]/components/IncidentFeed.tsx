import React, { useState } from "react"
import { ActivityLogEntry } from "@/lib/proctorMockData"
import { AlertCircle, Volume2, EyeOff, Check, ArrowUpDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface IncidentFeedProps {
  logs: ActivityLogEntry[];
  onOverrideIncident?: (id: string) => void;
}

export function IncidentFeed({ logs, onOverrideIncident }: IncidentFeedProps) {
  const [sortBy, setSortBy] = useState<"TIME" | "SEVERITY">("TIME")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")

  const getSeverityPriority = (severity: ActivityLogEntry["severity"]) => {
    switch (severity) {
      case "HIGH":
        return 3
      case "MEDIUM":
        return 2
      case "LOW":
        return 1
      default:
        return 0
    }
  }

  const sortedLogs = [...logs].sort((a, b) => {
    if (sortBy === "TIME") {
      return sortOrder === "DESC"
        ? b.timestamp.localeCompare(a.timestamp)
        : a.timestamp.localeCompare(b.timestamp)
    } else {
      const diff = getSeverityPriority(b.severity) - getSeverityPriority(a.severity)
      return sortOrder === "DESC" ? diff : -diff
    }
  })

  const toggleSort = (type: "TIME" | "SEVERITY") => {
    if (sortBy === type) {
      setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"))
    } else {
      setSortBy(type)
      setSortOrder("DESC")
    }
  }

  const getAlertIcon = (eventCode: string) => {
    if (eventCode.startsWith("AI-DEV")) return <AlertCircle className="h-4 w-4" />
    if (eventCode.startsWith("AI-AUD")) return <Volume2 className="h-4 w-4" />
    return <EyeOff className="h-4 w-4" />
  }

  const getSeverityBadge = (severity: ActivityLogEntry["severity"]) => {
    switch (severity) {
      case "HIGH":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "MEDIUM":
        return "bg-warning/10 text-warning border-warning/20"
      case "LOW":
        return "bg-secondary/15 text-primary border-primary/10"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <Card className="border-border/30 bg-card flex flex-col flex-1">
      <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-base font-semibold text-primary">
          Incident Feed
        </CardTitle>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort("TIME")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors ${
              sortBy === "TIME"
                ? "bg-primary text-white border-primary"
                : "border-border hover:bg-accent text-muted-foreground"
            }`}
          >
            Time {sortBy === "TIME" && <ArrowUpDown className="h-3 w-3" />}
          </button>
          <button
            onClick={() => toggleSort("SEVERITY")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors ${
              sortBy === "SEVERITY"
                ? "bg-primary text-white border-primary"
                : "border-border hover:bg-accent text-muted-foreground"
            }`}
          >
            Severity {sortBy === "SEVERITY" && <ArrowUpDown className="h-3 w-3" />}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {sortedLogs.map((log) => (
          <div
            key={log.id}
            className={`p-3 rounded-lg border border-border/30 flex items-start gap-3 transition-colors ${
              log.resolved ? "bg-muted/10 opacity-60" : "bg-card"
            }`}
          >
            <div className="rounded bg-accent p-1.5 text-primary shrink-0">
              {getAlertIcon(log.eventCode)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {log.timestamp} • {log.eventCode}
                </span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${getSeverityBadge(log.severity)}`}>
                  {log.severity}
                </span>
              </div>
              <p className="text-foreground text-xs leading-normal font-medium">
                {log.eventDescription}
              </p>
              {log.resolved && (
                <p className="text-[10px] text-success font-semibold mt-1">
                  ✓ Overridden by Proctor
                </p>
              )}
            </div>
            {!log.resolved && log.severity !== "INFO" && (
              <button
                onClick={() => onOverrideIncident?.(log.id)}
                className="p-1 hover:bg-success/10 text-muted-foreground hover:text-success rounded transition-colors"
                title="Override Flag"
              >
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {sortedLogs.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-8">
            No incidents logged for this session.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
