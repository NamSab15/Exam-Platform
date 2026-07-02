import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const FLAGGED_STUDENTS = [
  {
    id: "SEC-84920-X",
    name: "Adrian Thorne",
    major: "Computer Science • Year 3",
    flags: ["Audio Detected", "+2 others"],
    risk: "Critical",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "SEC-11029-B",
    name: "Elena Rodriguez",
    major: "Biochemistry • Year 1",
    flags: ["Device Detected"],
    risk: "Critical",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "SEC-99231-P",
    name: "Marcus Vane",
    major: "Applied Physics • Year 4",
    flags: ["Off-screen Gaze"],
    risk: "Moderate",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
  },
]

export function FlaggedList() {
  return (
    <Card className="border-border/30 bg-card overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/30 flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-base font-semibold text-primary">
          Top Flagged Students
        </CardTitle>
        <Link
          href="/proctor/activity-logs"
          className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
        >
          View All Activity
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/30">
              <tr>
                <th className="px-6 py-3">Student Profile</th>
                <th className="px-6 py-3">Session ID</th>
                <th className="px-6 py-3">Major Flags</th>
                <th className="px-6 py-3">Risk Level</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {FLAGGED_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                  {/* Profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-border/30 shrink-0">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-primary block text-sm">
                          {student.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{student.major}</span>
                      </div>
                    </div>
                  </td>

                  {/* Session ID */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-muted-foreground">{student.id}</span>
                  </td>

                  {/* Major Flags */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.flags.map((flag, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            flag.includes("others")
                              ? "bg-muted text-muted-foreground"
                              : "bg-destructive/10 text-destructive border border-destructive/20"
                          }`}
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Risk Level */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        student.risk === "Critical" ? "bg-destructive animate-pulse" : "bg-warning"
                      }`} />
                      <span className={`text-xs font-bold ${
                        student.risk === "Critical" ? "text-destructive" : "text-warning"
                      }`}>
                        {student.risk}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button className="border border-border/80 px-3 py-1.5 rounded text-xs font-bold text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                      Review Footage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
