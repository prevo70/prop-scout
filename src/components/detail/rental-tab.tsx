"use client";

import type { Property } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { M, fmt } from "./shared";

interface RentalTabProps {
  p: Property;
}

export function RentalTab({ p }: RentalTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* LTR */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Long-Term Rental</CardTitle>
          {p.recommendedStrategy === "Long-Term Rental" && (
            <Badge variant="default" className="bg-emerald-600 text-white">
              Recommended
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <M label="Weekly Rent" value={fmt(p.ltrWeekly)} />
          <M label="Annual Income" value={fmt(p.ltrAnnual)} />
          <M label="Gross Yield" value={`${p.ltrGrossYield.toFixed(2)}%`} />
          <M label="Net Yield" value={`${p.ltrNetYield.toFixed(2)}%`} />
        </CardContent>
      </Card>

      {/* STR */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Short-Term Rental</CardTitle>
          {p.recommendedStrategy !== "Long-Term Rental" && (
            <Badge variant="default" className="bg-emerald-600 text-white">
              Recommended
            </Badge>
          )}
          {p.recommendedStrategy === "Long-Term Rental" && (
            <Badge variant="secondary">Alternative</Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <M label="Nightly Rate" value={fmt(p.strNightly)} />
          <M label="Occupancy" value={`${p.strOccupancy}%`} />
          <M label="Gross Revenue" value={fmt(p.strAnnualRevenue)} />
          <M
            label="Net Revenue"
            value={fmt(
              Math.round(p.strAnnualRevenue * (1 - 0.035))
            )}
            sub="After 3.5% vacancy"
          />
          <M label="Gross Yield" value={`${p.strGrossYield.toFixed(2)}%`} />
          <M label="Net Yield" value={`${p.strNetYield.toFixed(2)}%`} />
        </CardContent>
      </Card>
    </div>
  );
}
