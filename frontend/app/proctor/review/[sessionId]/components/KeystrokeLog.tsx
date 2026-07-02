import React from "react"
import { Keyboard, ArrowUpRight, Zap, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KeystrokeEntry {
  timestamp: string;
  char: string;
  timeGapMs: number;
  wpm: number;
  isAnomaly: boolean;
}

interface KeystrokeLogProps {
  keystrokes: KeystrokeEntry[];
  currentTime: number;
}

export function KeystrokeLog({ keystrokes, currentTime }: KeystrokeLogProps) {
  // Mocking synchronized highlighting: only show keystrokes up to a certain point
  // For demonstration, map currentTime to indices
  const displayLimit = Math.min(keystrokes.length, Math.floor(currentTime / 2) + 2)
  const visibleKeystrokes = keystrokes.slice(0, displayLimit)

  // Typing statistics
  const avgWpm = 82
  const maxWpm = 240
  const anomalyDetected = keystrokes.some((k) => k.isAnomaly)

  return (
    <Card className="border-border/30 bg-card overflow-hidden flex flex-col shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-sm font-semibold text-primary flex items-center gap-2">
          <Keyboard className="h-4 w-4" />
          Keystroke & Behavior Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Typing metrics */}
        <div className="grid grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
              Avg speed
            </span>
            <span className="text-lg font-bold text-foreground font-mono">{avgWpm} WPM</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
              Max speed
            </span>
            <span className="text-lg font-bold text-foreground font-mono">{maxWpm} WPM</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
              Anomaly Status
            </span>
            {anomalyDetected ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive">
                <AlertTriangle className="h-3 w.3" /> Anomaly Flagged
              </span>
            ) : (
              <span className="text-xs font-bold text-success">Secure</span>
            )}
          </div>
        </div>

        {/* Keystrokes timeline log */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Real-Time Typing Telemetry
          </h4>
          <div className="border border-border/30 rounded-lg overflow-hidden max-h-[220px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-muted/40 font-bold text-muted-foreground border-b border-border/30">
                <tr>
                  <th className="px-4 py-2 font-mono text-[9px] uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2 font-mono text-[9px] uppercase tracking-wider">Char</th>
                  <th className="px-4 py-2 font-mono text-[9px] uppercase tracking-wider">Latency</th>
                  <th className="px-4 py-2 font-mono text-[9px] uppercase tracking-wider">Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-mono">
                {visibleKeystrokes.map((entry, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-muted/10 transition-colors ${
                      entry.isAnomaly ? "bg-destructive/5 text-destructive font-semibold" : ""
                    }`}
                  >
                    <td className="px-4 py-2 text-[10px] text-muted-foreground">
                      {entry.timestamp}
                    </td>
                    <td className="px-4 py-2 font-bold text-sm">
                      {entry.char === " " ? "␣" : entry.char}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{entry.timeGapMs}ms</td>
                    <td className="px-4 py-2 font-semibold">
                      {entry.wpm} WPM
                      {entry.isAnomaly && (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-[8px] bg-destructive/10 px-1 rounded font-bold uppercase tracking-wider">
                          <Zap className="h-2 w-2" /> Paste
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
