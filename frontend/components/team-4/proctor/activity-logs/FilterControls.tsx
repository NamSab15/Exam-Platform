import React from "react"
import { Switch } from "@/components/ui/switch"
import { SlidersHorizontal } from "lucide-react"

interface FilterControlsProps {
  severity: string;
  onSeverityChange: (val: string) => void;
  examId: string;
  onExamIdChange: (val: string) => void;
  liveSync: boolean;
  onLiveSyncToggle: (val: boolean) => void;
}

export function FilterControls({
  severity,
  onSeverityChange,
  examId,
  onExamIdChange,
  liveSync,
  onLiveSyncToggle,
}: FilterControlsProps) {
  return (
    <div className="bg-card p-4 rounded-xl border border-border/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Severity Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            Severity Level
          </label>
          <div className="relative min-w-[160px]">
            <select
              value={severity}
              onChange={(e) => onSeverityChange(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs focus-visible:border-primary focus-visible:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Levels</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <SlidersHorizontal className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Examination ID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            Examination ID
          </label>
          <div className="relative min-w-[200px]">
            <select
              value={examId}
              onChange={(e) => onExamIdChange(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs focus-visible:border-primary focus-visible:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Examinations</option>
              <option value="CS101">Mid-Term CS101</option>
              <option value="MATH202">Finals - Math 202</option>
              <option value="BIOL105">Weekly Quiz - Biol</option>
            </select>
            <SlidersHorizontal className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Live Sync */}
      <div className="flex items-center gap-3 self-end md:self-center pr-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Live Sync
        </span>
        <Switch checked={liveSync} onCheckedChange={onLiveSyncToggle} />
      </div>
    </div>
  )
}
