'use client'

import React, { useState } from "react"
import { Download, RefreshCw } from "lucide-react"
import { AdminHeader } from "@/components/shared/admin-header"
import { MOCK_CANDIDATES, MOCK_ALERTS, ActivityLogEntry } from "@/lib/proctorMockData"
import { MetricsCards } from "./components/MetricsCards"
import { StudentTable } from "./components/StudentTable"
import { BottomGrid } from "./components/BottomGrid"

export default function ProctorDashboardPage() {
  const [alerts, setAlerts] = useState<ActivityLogEntry[]>(MOCK_ALERTS)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Aggregate metrics
  const totalStudents = 124
  const activeSessions = MOCK_CANDIDATES.filter((c) => c.status !== "SUBMITTED").length
  const flaggedStudents = MOCK_CANDIDATES.filter((c) => c.status === "FLAGGED").length
  const suspendedStudents = MOCK_CANDIDATES.filter((c) => c.status === "SUSPENDED").length

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Teacher Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Real-time supervision overview for the Final Mathematics Examination
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-accent text-foreground transition-colors select-none">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all select-none"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>

        {/* Metrics Bento-lite Grid */}
        <MetricsCards
          totalStudents={totalStudents}
          activeSessions={activeSessions}
          flaggedStudents={flaggedStudents}
          suspendedStudents={suspendedStudents}
        />

        {/* Student Table */}
        <StudentTable candidates={MOCK_CANDIDATES} />

        {/* Bottom Details Grid */}
        <BottomGrid recentAlerts={alerts} onDismissAlert={handleDismissAlert} />
      </main>
    </div>
  )
}
