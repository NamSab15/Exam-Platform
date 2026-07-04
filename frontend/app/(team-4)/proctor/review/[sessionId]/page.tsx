'use client'

import React, { useState, useEffect, use } from "react"
import Link from "next/link"
import { ChevronLeft, ShieldCheck, AlertTriangle, User } from "lucide-react"
import { MOCK_CANDIDATES, MOCK_KEYSTROKES } from "@/lib/proctorMockData"
import { ReviewPlayer } from "@/components/team-4/proctor/review/ReviewPlayer"
import { KeystrokeLog } from "@/components/team-4/proctor/review/KeystrokeLog"

export default function ProctorReviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)

  const candidate = MOCK_CANDIDATES.find((c) => c.id === sessionId) || null
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const duration = 300 // 5 minutes total recording duration

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + 1 * playbackSpeed
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed])

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60)
    const s = time % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  if (!candidate) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading review session...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
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
                  Post-Exam Review
                </h1>
                <span className="bg-secondary text-primary px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono">
                  {candidate.name}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                Completed Session Review • Cohort Final Mathematics Exam
              </p>
            </div>
          </div>
        </div>

        {/* Candidate Stats Header Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-6 rounded-xl border border-border/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Candidate Profile
              </span>
              <span className="text-sm font-semibold text-foreground">{candidate.name}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              Incidents Flagged
            </span>
            <span className="text-sm font-semibold text-destructive">{candidate.warningsCount} Flags</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              Integrity Score
            </span>
            <span className={`text-sm font-semibold ${candidate.trustScore >= 70 ? "text-success" : "text-warning"}`}>
              {candidate.trustScore}% Trusted
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              Review Status
            </span>
            {candidate.status === "SUSPENDED" ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive mt-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Suspended/Low Trust
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-success mt-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Normal / Approved
              </span>
            )}
          </div>
        </div>

        {/* Split grid: player + keystroke logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ReviewPlayer
              candidateName={candidate.name}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying((prev) => !prev)}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              duration={duration}
              webcamUrl={candidate.webcamUrl}
              screenShareUrl={candidate.screenShareUrl}
              formatTime={formatTime}
            />
          </div>
          <div className="lg:col-span-4">
            <KeystrokeLog
              keystrokes={MOCK_KEYSTROKES}
              currentTime={currentTime}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
