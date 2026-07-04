import React from "react"
import { Calendar, Download } from "lucide-react"
import { MetricCards } from "@/components/team-4/proctor/analytics/MetricCards"
import { AnalyticsCharts } from "@/components/team-4/proctor/analytics/AnalyticsCharts"
import { FlaggedList } from "@/components/team-4/proctor/analytics/FlaggedList"

export default function ProctorAnalyticsPage() {
  const dateRange = "Last 7 Days"

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              System Analytics
            </h1>
            <p className="text-muted-foreground text-sm">
              Real-time overview of examination integrity and student performance.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-card px-4 py-2 rounded-lg border border-border flex items-center gap-2 text-xs font-semibold hover:bg-accent text-foreground transition-all select-none">
              <Calendar className="h-4 w-4" />
              <span>{dateRange}</span>
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold hover:bg-primary/95 transition-all select-none">
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Metrics Bento-lite Grid */}
        <MetricCards />

        {/* Interactive Recharts charts */}
        <AnalyticsCharts />

        {/* Top Flagged Students Table */}
        <FlaggedList />
      </main>
    </div>
  )
}
