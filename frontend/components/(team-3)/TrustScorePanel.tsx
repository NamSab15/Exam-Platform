"use client";

import React, { useEffect, useRef, useState } from "react";

interface TrustScorePanelProps {
  /** Trust score from 0 to 100 */
  score: number;
  /** Display size variant */
  size?: "sm" | "md" | "lg";
  /** Animate the score counter on mount */
  animated?: boolean;
  /** Show label below the gauge */
  showLabel?: boolean;
}

function getColor(score: number): { stroke: string; bg: string; text: string; label: string } {
  if (score >= 80) return { stroke: "#22c55e", bg: "#f0fdf4", text: "#16a34a", label: "Excellent" };
  if (score >= 50) return { stroke: "#f59e0b", bg: "#fffbeb", text: "#d97706", label: "Moderate" };
  return { stroke: "#ef4444", bg: "#fef2f2", text: "#dc2626", label: "Low" };
}

const SIZE_MAP = {
  sm: { svgSize: 100, strokeWidth: 8, fontSize: "text-xl", labelSize: "text-xs" },
  md: { svgSize: 140, strokeWidth: 10, fontSize: "text-3xl", labelSize: "text-sm" },
  lg: { svgSize: 180, strokeWidth: 12, fontSize: "text-4xl", labelSize: "text-base" },
};

export function TrustScorePanel({
  score,
  size = "md",
  animated = true,
  showLabel = true,
}: TrustScorePanelProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const from = displayScore;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(from + (score - from) * eased));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const { svgSize, strokeWidth, fontSize, labelSize } = SIZE_MAP[size];
  const { stroke, bg, text, label } = getColor(displayScore);

  const radius = (svgSize - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // We use 270° arc (three-quarter circle). The gap is at the bottom.
  const arcLength = circumference * 0.75;
  const dashOffset = arcLength - (arcLength * Math.min(displayScore, 100)) / 100;

  // Rotate so the arc starts at bottom-left (225°) and ends at bottom-right
  const rotateAngle = 135;

  return (
    <div
      className="flex flex-col items-center gap-1"
      aria-label={`Trust Score: ${displayScore} out of 100`}
      role="img"
    >
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: svgSize,
          height: svgSize,
          background: bg,
          boxShadow: `0 0 0 2px ${stroke}22`,
        }}
      >
        <svg
          width={svgSize}
          height={svgSize}
          className="absolute inset-0"
          style={{ transform: `rotate(${rotateAngle}deg)` }}
        >
          {/* Track */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.1s ease-out, stroke 0.4s ease" }}
          />
        </svg>

        {/* Score number */}
        <div className="relative z-10 flex flex-col items-center">
          <span
            className={`font-black leading-none tabular-nums ${fontSize}`}
            style={{ color: text }}
          >
            {displayScore}
          </span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col items-center gap-0.5">
          <span className={`font-bold ${labelSize}`} style={{ color: text }}>
            {label}
          </span>
          <span className={`text-gray-500 ${labelSize} opacity-80`}>Trust Score</span>
        </div>
      )}
    </div>
  );
}
