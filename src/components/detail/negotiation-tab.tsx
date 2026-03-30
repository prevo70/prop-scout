"use client";

import type { Property } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { M, fmt } from "./shared";

interface NegotiationTabProps {
  p: Property;
}

export function NegotiationTab({ p }: NegotiationTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Target Range */}
      <Card className="border-amber-400/40 bg-amber-400/5">
        <CardHeader>
          <CardTitle className="text-amber-400">Target Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <M label="Opening Offer" value={fmt(p.openingOffer)} accent />
          <M
            label="Target Range"
            value={`${fmt(p.targetLow)} – ${fmt(p.targetHigh)}`}
          />
          <M label="Walk Away" value={fmt(p.walkAway)} sub="Maximum price" />
        </CardContent>
      </Card>

      {/* Leverage Points */}
      <Card>
        <CardHeader>
          <CardTitle>Leverage Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {p.leveragePoints.map((lp, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-xs font-bold text-amber-400">
                  {i + 1}
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">{lp.title}</p>
                  <p className="text-sm text-muted-foreground">{lp.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
