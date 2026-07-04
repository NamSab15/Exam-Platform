import React from "react"
import { AlertCircle, EyeOff, Volume2, X, Network } from "lucide-react"
import { ActivityLogEntry } from "@/lib/proctorMockData"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface BottomGridProps {
  recentAlerts: ActivityLogEntry[];
  onDismissAlert?: (id: string) => void;
}

export function BottomGrid({ recentAlerts, onDismissAlert }: BottomGridProps) {
  const getAlertIcon = (eventCode: string) => {
    if (eventCode.startsWith("AI-DEV")) {
      return <AlertCircle className="h-5 w-5 text-destructive" />
    }
    if (eventCode.startsWith("AI-AUD")) {
      return <Volume2 className="h-5 w-5 text-warning" />
    }
    return <EyeOff className="h-5 w-5 text-secondary" />
  };

  const getAlertBorder = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "border-l-4 border-l-destructive"
      case "MEDIUM":
        return "border-l-4 border-l-warning"
      default:
        return "border-l-4 border-l-secondary"
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Violation Heatmap */}
      <Card className="border-border/30 bg-card flex flex-col">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10">
          <CardTitle className="font-heading text-lg font-semibold text-primary">
            Violation Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          {/* Visual grid simulating rooms */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-5 pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-foreground" />
            ))}
          </div>
          <Network className="h-10 w-10 text-primary mb-4 animate-pulse" />
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Real-time analysis suggests high gaze-deviation clusters in{" "}
            <span className="font-bold text-primary">Room 4-B</span> (Technical Lab).
          </p>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="border-border/30 bg-card flex flex-col">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg font-semibold text-primary">
            Recent Alerts
          </CardTitle>
          <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
            View History
          </button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 bg-muted/30 rounded-lg flex items-start gap-4 transition-all ${getAlertBorder(
                alert.severity
              )}`}
            >
              <div className="rounded-lg bg-card p-2 shadow-sm flex-shrink-0">
                {getAlertIcon(alert.eventCode)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground text-sm truncate">
                  {alert.eventDescription}
                </h4>
                <p className="text-muted-foreground text-xs mt-1">
                  Student:{" "}
                  <span className="text-primary font-semibold">
                    {alert.candidateName}
                  </span>{" "}
                  • {alert.timestamp}
                </p>
              </div>
              <button
                onClick={() => onDismissAlert?.(alert.id)}
                className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Dismiss alert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {recentAlerts.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No recent alerts to show.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
