import React from 'react';
import { RefreshCw } from 'lucide-react';

interface SyncStatusBannerProps {
  timer: number;
}

export function SyncStatusBanner({ timer }: SyncStatusBannerProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 select-none dark:bg-emerald-950/20 dark:text-emerald-400"
      role="status"
    >
      <RefreshCw
        className="h-5 w-5 text-emerald-600 shrink-0 animate-spin"
        style={{ animationDuration: '6s' }}
      />
      <div className="flex flex-col text-xs font-semibold">
        <span>Syncing to Exam Bank</span>
        <span className="text-[10px] font-normal text-emerald-700/80 dark:text-emerald-400/80">
          Next publish cycle: In {timer} mins
        </span>
      </div>
    </div>
  );
}
