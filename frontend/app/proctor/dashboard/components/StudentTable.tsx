import React, { useState } from "react"
import Link from "next/link"
import { Search, Filter, ArrowUpRight, ChevronLeft, ChevronRight, History } from "lucide-react"
import { CandidateSession } from "@/lib/proctorMockData"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StudentTableProps {
  candidates: CandidateSession[];
}

export function StudentTable({ candidates }: StudentTableProps) {
  const [filter, setFilter] = useState<"ALL" | "FLAGGED" | "SECURE">("ALL")
  const [search, setSearch] = useState("")

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    if (filter === "ALL") return matchesSearch
    if (filter === "FLAGGED") return matchesSearch && c.status === "FLAGGED"
    if (filter === "SECURE") return matchesSearch && c.status === "SECURE"
    return matchesSearch
  })

  const getStatusStyle = (status: CandidateSession["status"]) => {
    switch (status) {
      case "SECURE":
        return "bg-success/10 text-success"
      case "FLAGGED":
        return "bg-warning/10 text-warning"
      case "SUSPENDED":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getProgressColor = (status: CandidateSession["status"]) => {
    switch (status) {
      case "SECURE":
        return "bg-success"
      case "FLAGGED":
        return "bg-warning"
      case "SUSPENDED":
        return "bg-destructive"
      default:
        return "bg-muted-foreground"
    }
  }

  return (
    <Card className="border-border/30 bg-card overflow-hidden">
      <CardHeader className="bg-muted/30 px-6 py-4 flex flex-row items-center justify-between border-b border-border/50">
        <CardTitle className="font-heading text-lg font-semibold text-primary">
          Student Monitoring
        </CardTitle>
        <div className="flex items-center gap-3">
          {/* Search input inside table header */}
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-xs transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "ALL" | "FLAGGED" | "SECURE")}
              className="h-9 rounded-lg border border-border bg-background pl-3 pr-8 py-1 text-xs focus-visible:border-primary focus-visible:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Students</option>
              <option value="FLAGGED">Flagged Only</option>
              <option value="SECURE">Secure Only</option>
            </select>
            <Filter className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Trust Score</th>
                <th className="px-6 py-4">Warning Count</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-muted/10 transition-colors group">
                  {/* Name & Initials */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-xs font-bold text-primary">
                        {c.avatarInitials}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block text-sm">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {c.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Trust Score Progress */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 bg-accent rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(c.status)}`}
                          style={{ width: `${c.trustScore}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${c.status === "SECURE" ? "text-success" : c.status === "FLAGGED" ? "text-warning" : "text-destructive"}`}>
                        {c.trustScore}%
                      </span>
                    </div>
                  </td>

                  {/* Warning Count */}
                  <td className="px-6 py-4">
                    <span className={`text-sm ${c.warningsCount > 0 ? "font-bold text-destructive" : "text-muted-foreground"}`}>
                      {c.warningsCount}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(c.status)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getProgressColor(c.status)}`} />
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    {c.status === "SUSPENDED" ? (
                      <Link
                        href={`/proctor/review/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        Review Incidents <History className="h-3 w-3" />
                      </Link>
                    ) : (
                      <Link
                        href={`/proctor/sessions/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        View Live <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                    No candidates found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex items-center justify-between border-t border-border/30 px-6 py-4 bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Showing {filteredCandidates.length} of {candidates.length} students
          </span>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent hover:text-foreground text-muted-foreground transition-colors">
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
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent hover:text-foreground text-muted-foreground transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
