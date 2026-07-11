"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Maximize2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * FullscreenGuard
 * ---------------
 * Wraps exam content and:
 *  1. Requests fullscreen on mount (once the user is already inside the exam route).
 *  2. Shows a blocking overlay if the user exits fullscreen, prompting them to return.
 *
 * The pre-check wizard also requests fullscreen on "Start Exam", so in practice
 * the browser will already be fullscreen when this component mounts.
 */
export default function FullscreenGuard({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [violationCount, setViolationCount] = useState(0);

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Silently fail — some browsers block programmatic fullscreen without a user gesture.
    }
  }, []);

  useEffect(() => {
    // Attempt fullscreen on mount
    enterFullscreen();

    const handleChange = () => {
      const full = !!document.fullscreenElement;
      setIsFullscreen(full);
      if (!full) {
        setViolationCount((n) => n + 1);
      }
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [enterFullscreen]);

  return (
    <>
      {children}

      {/* Blocking overlay when fullscreen is exited */}
      {!isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: "rgba(33,25,30,0.97)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Red warning header */}
            <div className="bg-red-500 px-6 py-5 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-white shrink-0" />
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Fullscreen Required</h2>
                <p className="text-red-100 text-sm">Proctoring violation detected</p>
              </div>
            </div>

            <div className="px-6 py-6 space-y-4">
              <p className="text-[#21191e] text-sm leading-relaxed">
                You have exited fullscreen mode. This has been recorded as a proctoring event and
                may affect your <strong>Trust Score</strong>.
              </p>

              {violationCount >= 3 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Warning:</strong> Multiple fullscreen exits have been detected. Further
                    violations may trigger automatic exam termination.
                  </span>
                </div>
              )}

              <div className="bg-[#f7f8fc] rounded-lg p-3 text-xs text-[#51434c] space-y-1">
                <p className="font-semibold text-[#21191e]">Violation summary:</p>
                <p>• Fullscreen exits this session: <strong>{violationCount}</strong></p>
                <p>• Each exit is logged and reviewed by proctors.</p>
              </div>

              <Button
                id="return-to-fullscreen"
                onClick={enterFullscreen}
                className="w-full bg-[#6c1d5f] hover:bg-[#4a1e47] text-white font-semibold py-5 gap-2"
              >
                <Maximize2 className="w-5 h-5" />
                Return to Fullscreen
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
