'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, Clock } from "lucide-react"
import { AdminHeader } from "@/components/shared/admin-header"
import { MOCK_CANDIDATES, CandidateSession } from "@/lib/proctorMockData"
import { LiveFeeds } from "./components/LiveFeeds"
import { IncidentFeed } from "./components/IncidentFeed"
import { ControlPanel } from "./components/ControlPanel"

export default function ProctorSessionPage() {
  const params = useParams()
  const sessionId = params.sessionId as string

  // Fetch student session from mock data with deep copy in initializer to avoid useEffect lint warnings
  const [candidate, setCandidate] = useState<CandidateSession | null>(() => {
    const student = MOCK_CANDIDATES.find((c) => c.id === sessionId)
    return student ? JSON.parse(JSON.stringify(student)) : null
  })
  const [remainingTime, setRemainingTime] = useState(6125) // 01:42:05 in seconds

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (time: number) => {
    const h = Math.floor(time / 3600)
    const m = Math.floor((time % 3600) / 60)
    const s = time % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleWarningSent = (text: string) => {
    if (!candidate) return
    // Append to logs
    const newLog = {
      id: `l_w_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      candidateId: candidate.id,
      candidateName: candidate.name,
      eventDescription: `Proctor Warning Issued: "${text}"`,
      eventCode: "PRC-WARN-001",
      severity: "MEDIUM" as const,
    }
    setCandidate((prev) => {
      if (!prev) return null
      return {
        ...prev,
        warningsCount: prev.warningsCount + 1,
        trustScore: Math.max(0, prev.trustScore - 10),
        status: "FLAGGED" as const,
        logs: [newLog, ...prev.logs],
      }
    })
  }

  const handleSessionTerminated = (reason: string, notes: string) => {
    if (!candidate) return
    const newLog = {
      id: `l_t_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      candidateId: candidate.id,
      candidateName: candidate.name,
      eventDescription: `Session terminated by proctor. Reason: ${reason}. Notes: ${notes}`,
      eventCode: "PRC-TERM-001",
      severity: "HIGH" as const,
    }
    setCandidate((prev) => {
      if (!prev) return null
      return {
        ...prev,
        status: "SUSPENDED" as const,
        trustScore: 0,
        logs: [newLog, ...prev.logs],
      }
    })
  }

  const handleOverrideIncident = (id: string) => {
    if (!candidate) return
    setCandidate((prev) => {
      if (!prev) return null
      const updatedLogs = prev.logs.map((log) => {
        if (log.id === id) {
          return { ...log, resolved: true }
        }
        return log
      })
      // Restore trust score slightly upon override
      const scoreBoost = 10
      return {
        ...prev,
        trustScore: Math.min(100, prev.trustScore + scoreBoost),
        status: prev.trustScore + scoreBoost >= 70 ? ("SECURE" as const) : ("FLAGGED" as const),
        logs: updatedLogs,
      }
    })
  }

  if (!candidate) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading session details...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Navigation back and session details */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/30 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/proctor/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-2xl font-bold text-primary">
                  {candidate.name}
                </h1>
                <span className="bg-secondary text-primary px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono">
                  {candidate.id}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                Active Session • Advanced Algorithms Exam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Timer */}
            <div className="flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-1 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 select-none">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="font-mono text-sm font-bold tracking-tight">
                {formatTime(remainingTime)}
              </span>
            </div>

            <button
              onClick={() => handleSessionTerminated("Proctor Override", "Immediate manual termination")}
              disabled={candidate.status === "SUSPENDED"}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-primary/95 disabled:opacity-50 transition-all select-none"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Feeds & Incident logs */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <LiveFeeds
              candidateName={candidate.name}
              webcamUrl={candidate.webcamUrl}
              screenShareUrl={candidate.screenShareUrl}
              status={candidate.status}
            />
            <IncidentFeed
              logs={candidate.logs}
              onOverrideIncident={handleOverrideIncident}
            />
          </div>

          {/* Side control panels */}
          <div className="lg:col-span-4">
            <ControlPanel
              trustScore={candidate.trustScore}
              warningsCount={candidate.warningsCount}
              status={candidate.status}
              details={candidate.details}
              onWarningSent={handleWarningSent}
              onSessionTerminated={handleSessionTerminated}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
