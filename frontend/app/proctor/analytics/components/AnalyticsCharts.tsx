'use client'

import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const LINE_DATA = [
  { name: "Mon", score: 92, baseline: 90 },
  { name: "Tue", score: 94, baseline: 90 },
  { name: "Wed", score: 91, baseline: 90 },
  { name: "Thu", score: 95, baseline: 90 },
  { name: "Fri", score: 96, baseline: 90 },
  { name: "Sat", score: 94, baseline: 90 },
  { name: "Sun", score: 95, baseline: 90 },
]

const PIE_DATA = [
  { name: "Off-screen Gaze", value: 54, color: "oklch(0.43 0.18 330)" }, // primary
  { name: "Speech/Talking", value: 28, color: "oklch(0.94 0.01 320)" }, // secondary
  { name: "Multiple People", value: 18, color: "oklch(0.55 0.01 280)" }, // muted
]

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trust Score Trends (Line Chart) */}
      <Card className="lg:col-span-2 border-border/30 bg-card flex flex-col">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10">
          <CardTitle className="font-heading text-sm font-semibold text-primary">
            Trust Score Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={LINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.90 0.004 260)" />
              <XAxis dataKey="name" stroke="oklch(0.55 0.01 280)" fontSize={11} />
              <YAxis domain={[80, 100]} stroke="oklch(0.55 0.01 280)" fontSize={11} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="oklch(0.43 0.18 330)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="System Average"
              />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="oklch(0.90 0.004 260)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name="Baseline"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Violation Distribution (Pie Chart) */}
      <Card className="border-border/30 bg-card flex flex-col">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10">
          <CardTitle className="font-heading text-sm font-semibold text-primary">
            Violation Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col justify-between min-h-[300px]">
          <div className="relative flex-1 flex items-center justify-center min-h-[160px]">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-xl font-bold text-primary">1,240</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Total Events
              </span>
            </div>
          </div>

          {/* Custom Legends */}
          <div className="space-y-2 mt-4">
            {PIE_DATA.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{entry.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
