'use client'

import React, { useState, useEffect, Suspense } from "react"
import { Download } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { MOCK_CANDIDATES } from "@/lib/proctorMockData"
import { FilterControls } from "@/components/team-4/proctor/activity-logs/FilterControls"
import { LogsTable } from "@/components/team-4/proctor/activity-logs/LogsTable"
import { toast } from "sonner"

function ActivityLogsContent() {
  const [severityFilter, setSeverityFilter] = useState("ALL")
  const [examFilter, setExamFilter] = useState("ALL")
  const [liveSync, setLiveSync] = useState(true)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  // Keep logs in React state to support dynamic updates during live sync
  const [logs, setLogs] = useState(() => {
    const initialLogs = MOCK_CANDIDATES.flatMap((c) => c.logs)
    initialLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    return initialLogs
  })

  // Simulated live sync interval that periodically adds dynamic logs and triggers a sonner toast
  useEffect(() => {
    if (!liveSync) return

    const interval = setInterval(() => {
      const candidates = MOCK_CANDIDATES
      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)]
      
      const incidentTypes = [
        {
          eventDescription: "Potential background talking detected.",
          eventCode: "AI-AUD-001",
          severity: "MEDIUM" as const,
        },
        {
          eventDescription: "Browser focus lost. Tab switched.",
          eventCode: "SYS-FOC-002",
          severity: "LOW" as const,
        },
        {
          eventDescription: "Extended gaze deviation detected (away from screen).",
          eventCode: "AI-GAZ-009",
          severity: "MEDIUM" as const,
        },
        {
          eventDescription: "Mobile device detected in camera frame.",
          eventCode: "AI-DEV-004",
          severity: "HIGH" as const,
        },
        {
          eventDescription: "Unusual keyboard activity or copy-paste detected.",
          eventCode: "SYS-KBD-004",
          severity: "HIGH" as const,
        }
      ]
      const selectedIncident = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
      
      const newLog = {
        id: `log-sim-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        candidateId: randomCandidate.id,
        candidateName: randomCandidate.name,
        eventDescription: selectedIncident.eventDescription,
        eventCode: selectedIncident.eventCode,
        severity: selectedIncident.severity,
      }
      
      setLogs((prev) => [newLog, ...prev])
      
      // Trigger shadcn sonner toast according to severity
      const title = newLog.severity === "HIGH" ? "New High Severity Incident" : "New Proctor Incident"
      const description = `${newLog.candidateName}: ${newLog.eventDescription}`
      
      if (newLog.severity === "HIGH") {
        toast.error(title, { description, duration: 5000 })
      } else if (newLog.severity === "MEDIUM") {
        toast.warning(title, { description, duration: 5000 })
      } else {
        toast(title, { description, duration: 5000 })
      }
    }, 12000)

    return () => clearInterval(interval)
  }, [liveSync])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventCode.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter

    return matchesSearch && matchesSeverity
  })

  return (
    <div className="flex-1 flex flex-col min-h-screen">
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
      </main>
    </div>
  )
}

export default function ProctorActivityLogsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading activity logs...</p>
      </div>
    }>
      <ActivityLogsContent />
    </Suspense>
  )
}
