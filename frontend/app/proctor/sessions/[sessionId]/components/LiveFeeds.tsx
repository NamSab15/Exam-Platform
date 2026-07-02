import React from "react"
import { VideoOff, ScreenShare, ShieldAlert } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface LiveFeedsProps {
  candidateName: string;
  webcamUrl?: string;
  screenShareUrl?: string;
  status: string;
}

export function LiveFeeds({
  candidateName,
  webcamUrl,
  screenShareUrl,
  status,
}: LiveFeedsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Webcam Feed */}
      <Card className="border-border/30 bg-card overflow-hidden flex flex-col">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-sm font-semibold text-primary flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
            Webcam Feed
          </CardTitle>
          <span className="text-[10px] font-bold text-muted-foreground uppercase bg-accent px-2 py-0.5 rounded">
            Live - 720p
          </span>
        </CardHeader>
        <CardContent className="p-0 relative aspect-video bg-zinc-950 flex items-center justify-center">
          {webcamUrl ? (
            <>
              <img
                src={webcamUrl}
                alt={`${candidateName} webcam`}
                className="w-full h-full object-cover opacity-80"
              />
              {/* Simulated Face Mesh overlay */}
              <div className="absolute inset-0 border-2 border-emerald-500/20 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full text-emerald-400/30 opacity-70">
                  <path d="M120,80 Q160,50 200,80 T280,80 Q200,160 120,80" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="160" cy="90" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="240" cy="90" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
                  <line x1="200" y1="100" x2="200" y2="130" stroke="currentColor" strokeWidth="1" />
                  <path d="M170,150 Q200,180 230,150" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className="absolute top-4 right-4 bg-emerald-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  <span>Face Locked</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <VideoOff className="h-8 w-8" />
              <span className="text-xs">No webcam feed available</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Screen Share Feed */}
      <Card className="border-border/30 bg-card overflow-hidden flex flex-col">
        <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-sm font-semibold text-primary flex items-center gap-2">
            <ScreenShare className="h-4 w-4" />
            Screen Share {screenShareUrl && ""}
          </CardTitle>
          <span className="text-[10px] font-bold text-muted-foreground uppercase bg-accent px-2 py-0.5 rounded">
            Active
          </span>
        </CardHeader>
        <CardContent className="p-0 relative aspect-video bg-zinc-950 flex items-center justify-center">
          {/* Using unsplash mockup of coding editor */}
          <div className="w-full h-full relative overflow-hidden bg-[#1e1e1e] font-mono text-[10px] text-zinc-300 p-4 select-none leading-normal">
            <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-800 pb-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="ml-2 text-zinc-400">Knapsack01.ts</span>
            </div>
            <div>
              <span className="text-blue-400">function</span> <span className="text-yellow-400">solveKnapsack</span>(weights: <span className="text-green-400">number[]</span>, values: <span className="text-green-400">number[]</span>, capacity: <span className="text-green-400">number</span>) &#123;
            </div>
            <div className="pl-4">
              <span className="text-blue-400">const</span> n = weights.length;
            </div>
            <div className="pl-4">
              <span className="text-blue-400">const</span> dp = Array.from(&#123; length: n + 1 &#125;, () =&gt; Array(capacity + 1).fill(0));
            </div>
            <div className="pl-4 text-zinc-500 mt-1">
              {"// Loop through all items and weights"}
            </div>
            <div className="pl-4">
              <span className="text-purple-400">for</span> (<span className="text-blue-400">let</span> i = 1; i &lt;= n; i++) &#123;
            </div>
            <div className="pl-8">
              <span className="text-purple-400">for</span> (<span className="text-blue-400">let</span> w = 1; w &lt;= capacity; w++) &#123;
            </div>
            <div className="pl-12">
              <span className="text-purple-400">if</span> (weights[i - 1] &lt;= w) &#123;
            </div>
            <div className="pl-16">
              dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            </div>
            <div className="pl-12">&#125; <span className="text-purple-400">else</span> &#123;
            </div>
            <div className="pl-16">
              dp[i][w] = dp[i - 1][w];
            </div>
            <div className="pl-12">&#125;
            </div>
            <div className="pl-8">&#125;
            </div>
            <div className="pl-4">&#125;
            </div>
            <div className="pl-4">
              <span className="text-purple-400">return</span> dp[n][capacity];
            </div>
            <div>&#125;</div>

            {status === "SUSPENDED" && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                <ShieldAlert className="h-10 w-10 text-destructive mb-2" />
                <h4 className="font-bold text-white text-base">Session Suspended</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  This candidate&apos;s exam screen is locked. Awaiting proctor resolution.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
