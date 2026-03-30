"use client";

import * as React from "react";

/** Format number as currency, no decimals. */
export function fmt(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/** Format number as currency, 2 decimals. */
export function fmtFull(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Return a Tailwind text colour class based on score thresholds. */
export function scoreColor(s: number): string {
  if (s >= 80) return "text-emerald-400";
  if (s >= 60) return "text-blue-400";
  if (s >= 40) return "text-amber-400";
  if (s >= 20) return "text-orange-400";
  return "text-red-400";
}

/** Return a raw hex colour for SVG strokes based on score thresholds. */
function scoreHex(s: number): string {
  if (s >= 80) return "#34d399";
  if (s >= 60) return "#60a5fa";
  if (s >= 40) return "#fbbf24";
  if (s >= 20) return "#fb923c";
  return "#f87171";
}

// ─── M (Metric) ─────────────────────────────────────────────────────────────

interface MProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export function M({ label, value, sub, accent }: MProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`font-mono text-lg font-semibold ${
          accent ? "text-amber-400" : ""
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}

// ─── CostRow ────────────────────────────────────────────────────────────────

interface CostRowProps {
  label: string;
  amount: React.ReactNode;
}

export function CostRow({ label, amount }: CostRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      {typeof amount === "string" || typeof amount === "number" ? (
        <span className="font-mono text-sm">{amount}</span>
      ) : (
        amount
      )}
    </div>
  );
}

// ─── ScoreGauge ─────────────────────────────────────────────────────────────

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "lg";
}

export function ScoreGauge({ score, size = "sm" }: ScoreGaugeProps) {
  const dim = size === "lg" ? 120 : 64;
  const stroke = size === "lg" ? 8 : 5;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const offset = circumference - (progress / 100) * circumference;
  const color = scoreHex(score);
  const fontSize = size === "lg" ? "text-xl" : "text-xs";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/30"
        />
        {/* Score arc */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span
        className={`absolute font-mono font-bold ${fontSize}`}
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
