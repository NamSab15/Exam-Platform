import React from "react"
import { Play, Pause, Maximize, RotateCcw, Volume2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ReviewPlayerProps {
  candidateName: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  currentTime: number;
  onTimeChange: (time: number) => void;
  duration: number;
  webcamUrl?: string;
  screenShareUrl?: string;
  formatTime: (sec: number) => string;
}

export function ReviewPlayer({
  candidateName,
  isPlaying,
  onPlayToggle,
  playbackSpeed,
  onSpeedChange,
  currentTime,
  onTimeChange,
  duration,
  webcamUrl,
  screenShareUrl,
  formatTime,
}: ReviewPlayerProps) {
  return (
    <Card className="border-border/30 bg-card overflow-hidden flex flex-col shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-sm font-semibold text-primary">
          Synchronized Player Feed {screenShareUrl && ""}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Post-Exam Review
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Videos Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Webcam player */}
          <div className="relative aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-border/30">
            {webcamUrl && (
              <Image
                src={webcamUrl}
                alt={`${candidateName} webcam recording`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-75"
              />
            )}
            <div className="absolute top-3 left-3 bg-black/50 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
              Webcam Feed
            </div>
          </div>

          {/* Screen Share player */}
          <div className="relative aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-border/30">
            <div className="w-full h-full relative overflow-hidden bg-[#1e1e1e] font-mono text-[9px] text-zinc-300 p-4 select-none leading-normal opacity-85">
              <div className="flex items-center gap-1.5 text-zinc-500 border-b border-zinc-800 pb-2 mb-2">
                <span className="text-zinc-400">Knapsack01.ts</span>
              </div>
              <div>
                <span className="text-blue-400">function</span> <span className="text-yellow-400">solveKnapsack</span>(weights: any, values: any, capacity: any) &#123;
              </div>
              <div className="pl-4">
                <span className="text-blue-400">const</span> n = weights.length;
              </div>
              <div className="pl-4 text-zinc-500">
                {/* Keystroke playback starts here */}
              </div>
              {currentTime > 60 && (
                <div className="pl-4">
                  <span className="text-blue-400">const</span> dp = Array.from(&#123; length: n + 1 &#125;, () =&gt; Array(capacity + 1).fill(0));
                </div>
              )}
              {currentTime > 120 && (
                <div className="pl-4">
                  <span className="text-purple-400">for</span> (<span className="text-blue-400">let</span> i = 1; i &lt;= n; i++) &#123;
                </div>
              )}
              {currentTime > 180 && (
                <div className="pl-8">
                  <span className="text-purple-400">if</span> (weights[i - 1] &lt;= w) &#123;
                </div>
              )}
              {currentTime > 240 && (
                <div className="pl-12">
                  dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
                </div>
              )}
            </div>
            <div className="absolute top-3 left-3 bg-black/50 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
              Screen share
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="space-y-3 pt-2">
          {/* Timeline slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground w-10">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => onTimeChange(Number(e.target.value))}
              className="flex-1 h-1.5 bg-accent rounded-full appearance-none cursor-pointer accent-primary"
            />
            <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">
              {formatTime(duration)}
            </span>
          </div>

          {/* Lower controls bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onPlayToggle}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/95 transition-all shadow-sm active:scale-95"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
              </button>
              <button className="p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground rounded transition-colors">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button className="p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground rounded transition-colors">
                <Volume2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback speed selector */}
              {[1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`px-2.5 py-1 text-xs rounded border font-semibold transition-colors ${
                    playbackSpeed === speed
                      ? "bg-primary text-white border-primary"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  {speed}x
                </button>
              ))}
              <button className="p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground rounded transition-colors ml-2">
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
