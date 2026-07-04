import React, { useState } from "react"
import { ShieldAlert } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ControlPanelProps {
  trustScore: number;
  warningsCount: number;
  status: string;
  details: {
    connectionStable: boolean;
    screenRecordingActive: boolean;
    audioLevelNormal: boolean;
  };
  onWarningSent: (text: string) => void;
  onSessionTerminated: (reason: string, notes: string) => void;
}

export function ControlPanel({
  trustScore,
  warningsCount,
  status,
  details,
  onWarningSent,
  onSessionTerminated,
}: ControlPanelProps) {
  const [warningOpen, setWarningOpen] = useState(false)
  const [warningText, setWarningText] = useState("")
  const [warningReason, setWarningReason] = useState("Gaze deviation detected")

  const [terminateOpen, setTerminateOpen] = useState(false)
  const [terminateReason, setTerminateReason] = useState("")
  const [terminateNotes, setTerminateNotes] = useState("")

  const handleSendWarning = () => {
    if (!warningText && !warningReason) return
    const text = warningText ? warningText : `Warning: ${warningReason}. Please focus on the screen.`
    onWarningSent(text)
    setWarningText("")
    setWarningOpen(false)
  }

  const handleConfirmTerminate = () => {
    if (!terminateReason) return
    onSessionTerminated(terminateReason, terminateNotes)
    setTerminateNotes("")
    setTerminateOpen(false)
  }

  // Ring circle parameters
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * trustScore) / 100

  const getScoreColor = () => {
    if (trustScore >= 70) return "text-success"
    if (trustScore >= 40) return "text-warning"
    return "text-destructive"
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Integrity score card */}
      <Card className="border-border/30 bg-card text-center">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10">
          <CardTitle className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Integrity Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-accent"
                cx="64"
                cy="64"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className={`${getScoreColor()} transition-all duration-1000`}
                cx="64"
                cy="64"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">
                {trustScore}%
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${getScoreColor()}`}>
                {trustScore >= 70 ? "Trusted" : trustScore >= 40 ? "Needs Review" : "Suspicious"}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
            {trustScore >= 70
              ? "AI verification confirms candidate focus and environment stability."
              : "Warning: Multiple flags generated. Candidate integrity compromised."}
          </p>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span>Warnings Issued:</span>
            <span className="font-semibold text-foreground">{warningsCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Control panel buttons */}
      <Card className="border-border/30 bg-card">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10">
          <CardTitle className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Session Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-3">
          {status !== "SUSPENDED" && status !== "SUBMITTED" ? (
            <>
              <Button
                variant="outline"
                className="w-full text-xs font-bold border-border/80 text-foreground hover:bg-accent"
                onClick={() => setWarningOpen(true)}
              >
                Send Warning Message
              </Button>
              <Button
                variant="destructive"
                className="w-full text-xs font-bold bg-destructive text-white hover:bg-destructive/90"
                onClick={() => setTerminateOpen(true)}
              >
                Terminate Session
              </Button>
            </>
          ) : (
            <div className="p-3 bg-destructive/10 rounded-lg text-destructive text-center flex items-center gap-2 justify-center">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">
                {status === "SUBMITTED" ? "Session Submitted" : "Session Suspended"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System checks list */}
      <Card className="border-border/30 bg-card">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10">
          <CardTitle className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground">
            System Checks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
            <span className="text-foreground text-xs font-medium">Stable Connection</span>
            <span className={`h-2.5 w-2.5 rounded-full ${details.connectionStable ? "bg-success" : "bg-destructive"}`} />
          </div>
          <div className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
            <span className="text-foreground text-xs font-medium">Screen Recording Active</span>
            <span className={`h-2.5 w-2.5 rounded-full ${details.screenRecordingActive ? "bg-success" : "bg-destructive"}`} />
          </div>
          <div className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
            <span className="text-foreground text-xs font-medium">Audio Level Normal</span>
            <span className={`h-2.5 w-2.5 rounded-full ${details.audioLevelNormal ? "bg-success" : "bg-destructive"}`} />
          </div>
        </CardContent>
      </Card>

      {/* Send Warning Dialog */}
      <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
        <DialogContent className="sm:max-w-[425px] border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-primary">
              Issue Warning
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send a real-time warning to the candidate. This will display on their screen.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Reason</label>
              <select
                value={warningReason}
                onChange={(e) => setWarningReason(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
              >
                <option value="Gaze deviation detected">Sustained Gaze Deviation</option>
                <option value="Talking / Background voice detected">Unpermitted Voice Activity</option>
                <option value="Tab switched / window focus lost">Tab Switch Detected</option>
                <option value="Unpermitted device seen in camera">Device Seen in Frame</option>
                <option value="Custom">Custom Message</option>
              </select>
            </div>
            {warningReason === "Custom" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Message</label>
                <textarea
                  value={warningText}
                  onChange={(e) => setWarningText(e.target.value)}
                  placeholder="Enter the custom warning text..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs focus:ring-1 focus:ring-primary min-h-[80px]"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-xs font-bold border-border/80 text-foreground hover:bg-accent"
              onClick={() => setWarningOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="text-xs font-bold bg-primary text-white hover:bg-primary/90"
              onClick={handleSendWarning}
            >
              Send Warning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Session Dialog */}
      <Dialog open={terminateOpen} onOpenChange={setTerminateOpen}>
        <DialogContent className="sm:max-w-[425px] border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-destructive">
              Terminate Session
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to terminate this candidate&apos;s session? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Reason *</label>
              <select
                value={terminateReason}
                onChange={(e) => setTerminateReason(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a reason...</option>
                <option value="Blatant cheating or copying">Blatant cheating/copying</option>
                <option value="Mobile phone use">Mobile phone use</option>
                <option value="Second person present in room">Second person present</option>
                <option value="Refusing proctor instructions">Refusing instructions</option>
                <option value="Other security violation">Other security violation</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Proctor Notes (Optional)</label>
              <textarea
                value={terminateNotes}
                onChange={(e) => setTerminateNotes(e.target.value)}
                placeholder="Provide details about the termination decision..."
                className="w-full rounded-lg border border-border bg-background p-3 text-xs focus:ring-1 focus:ring-primary min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-xs font-bold border-border/80 text-foreground hover:bg-accent"
              onClick={() => setTerminateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="text-xs font-bold bg-destructive text-white hover:bg-destructive/90"
              disabled={!terminateReason}
              onClick={handleConfirmTerminate}
            >
              Confirm Terminate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
