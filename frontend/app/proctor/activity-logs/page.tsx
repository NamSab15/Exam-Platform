'use client'

import React, { useState, useEffect } from "react"
import { Download, AlertTriangle, X } from "lucide-react"
import { AdminHeader } from "@/components/shared/admin-header"
import { MOCK_CANDIDATES, ActivityLogEntry } from "@/lib/proctorMockData"
import { FilterControls } from "./components/FilterControls"
import { LogsTable } from "./components/LogsTable"

export default function ProctorActivityLogsPage() {
  const [severityFilter, setSeverityFilter] = useState("ALL")
  const [examFilter, setExamFilter] = useState("ALL")
  const [liveSync, setLiveSync] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [allLogs, setAllLogs] = useState<ActivityLogEntry[]>([])
  const [showToast, setShowToast] = useState(true)

  useEffect(() => {
    // Flatten and aggregate logs from all candidates
    const logs = MOCK_CANDIDATES.flatMap((c) => c.logs)
    // Sort by timestamp descending
    logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    setAllLogs(logs)
  }, [])

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      log.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventCode.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter

    // In a real app we'd filter by examId, but for dummy logs we assume all match or matches mock
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Passing search callback to the shared AdminHeader */}
      <AdminHeader searchValue={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full relative">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Activity Logs
            </h1>
            <p className="text-muted-foreground text-sm">
              Real-time audit trail of all student behaviors and AI-detected events.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-accent text-foreground transition-colors select-none self-start sm:self-end">
            <Download className="h-4 w-4" />
            <span>Export Logs</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <FilterControls
          severity={severityFilter}
          onSeverityChange={setSeverityFilter}
          examId={examFilter}
          onExamIdChange={setExamFilter}
          liveSync={liveSync}
          onLiveSyncToggle={setLiveSync}
        />

        {/* Audit Table */}
        <LogsTable logs={filteredLogs} />

        {/* Float Notification Toast */}
        {showToast && (
          <div className="fixed bottom-6 right-6 max-w-sm w-full bg-card rounded-xl shadow-2xl border border-border/30 overflow-hidden flex items-start p-4 gap-4 animate-bounce-in z-50">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-destructive rounded-lg flex-shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-foreground text-sm">
                New High Severity Incident
              </h4>
              <p className="text-muted-foreground text-xs leading-normal mt-1">
                Alex Simmons: Multiple faces detected in primary camera feed.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
