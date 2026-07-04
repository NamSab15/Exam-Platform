import React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ActivityLogEntry } from "@/lib/proctorMockData"

interface LogsTableProps {
  logs: ActivityLogEntry[];
}

export function LogsTable({ logs }: LogsTableProps) {
  const getSeverityStyle = (severity: ActivityLogEntry["severity"]) => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="bg-card overflow-hidden border border-border/30 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/40 border-b border-border/30">
            <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Event Description</th>
              <th className="px-6 py-4">Event Code</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/10 transition-colors group">
                {/* Timestamp */}
                <td className="px-6 py-4 font-mono text-xs text-foreground whitespace-nowrap">
                  {log.timestamp}
                </td>

                {/* Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs">
                      {getInitials(log.candidateName)}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-sm block">
                        {log.candidateName}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {log.candidateId}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Description */}
                <td className="px-6 py-4 max-w-xs text-xs text-muted-foreground leading-relaxed">
                  {log.eventDescription}
                </td>

                {/* Event Code */}
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  {log.eventCode}
                </td>

                {/* Severity */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${getSeverityStyle(log.severity)}`}>
                    {log.severity}
                  </span>
                </td>

                {/* Action Link */}
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/proctor/review/${log.candidateId}`}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Review Clip
                  </Link>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  No activity logs recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between bg-muted/20 border-t border-border/30">
        <span className="text-xs text-muted-foreground">
          Showing 1-{logs.length} of {logs.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent text-muted-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-sm">
            1
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent text-xs font-semibold text-muted-foreground transition-colors">
            2
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent text-xs font-semibold text-muted-foreground transition-colors">
            3
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent text-muted-foreground transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
