"use client";

import type { Property } from "@/lib/data";
import type { ScenarioAdjustments } from "@/lib/scenarios";
import { projectFiveYears } from "@/lib/calculations";
import { DEFAULT_GROWTH_RATES as DG } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fmt } from "./shared";

interface ProjectionTabProps {
  property: Property;
  adjustments: ScenarioAdjustments;
  mode: "model" | "adjusted";
  updateField?: (field: keyof ScenarioAdjustments, value: number | boolean) => void;
}

function fmtCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(2)}m`;
  }
  if (Math.abs(n) >= 1_000) {
    return `$${(n / 1_000).toFixed(0)}k`;
  }
  return fmt(n);
}

export function ProjectionTab({
  property,
  adjustments,
  mode,
  updateField,
}: ProjectionTabProps) {
  const years = projectFiveYears(property, adjustments);
  const isAdjusted = mode === "adjusted";

  const growthFields: {
    key: keyof ScenarioAdjustments;
    label: string;
    placeholder: number;
  }[] = [
    { key: "capitalGrowth", label: "Capital Growth %", placeholder: property.fiveYearCagr ?? DG.capitalGrowth },
    { key: "rentGrowth", label: "Rent Growth %", placeholder: DG.rentGrowth },
    { key: "strataIncrease", label: "Strata Increase %", placeholder: DG.strataIncrease },
    { key: "councilIncrease", label: "Council Increase %", placeholder: DG.councilIncrease },
  ];

  return (
    <div className="space-y-4">
      {/* Growth rate inputs (adjusted mode only) */}
      {isAdjusted && updateField && (
        <Card>
          <CardHeader>
            <CardTitle>Growth Assumptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {growthFields.map((f) => (
                <div key={f.key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {f.label}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step={0.5}
                      placeholder={String(f.placeholder)}
                      value={(adjustments[f.key] as number | undefined) ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "") return;
                        updateField(f.key, Number(v));
                      }}
                      className="font-mono text-sm pr-6"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart slot */}
      <div
        id="projection-chart-slot"
        className="h-[300px] rounded-lg border border-dashed border-muted-foreground/20 flex items-center justify-center"
      >
        <span className="text-sm text-muted-foreground">Chart placeholder</span>
      </div>

      {/* Year-by-year table */}
      <Card>
        <CardHeader>
          <CardTitle>5-Year Projection</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-2 font-medium text-muted-foreground">Year</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-right">Property Value</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-right">Equity</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-right">Annual Rent</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-right">Holding Costs</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-right">Interest</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-right">Net Cashflow</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-right">Cumul. Cashflow</th>
                </tr>
              </thead>
              <tbody>
                {years.map((yr) => (
                  <tr key={yr.year} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-2 font-mono font-medium">{yr.year}</td>
                    <td className="px-4 py-2 font-mono text-right">{fmtCompact(yr.propertyValue)}</td>
                    <td className="px-4 py-2 font-mono text-right">{fmtCompact(yr.equity)}</td>
                    <td className="px-4 py-2 font-mono text-right">{fmt(yr.annualRent)}</td>
                    <td className="px-4 py-2 font-mono text-right text-muted-foreground">{fmt(yr.holdingCosts)}</td>
                    <td className="px-4 py-2 font-mono text-right text-muted-foreground">{fmt(yr.interestCost)}</td>
                    <td
                      className={`px-4 py-2 font-mono text-right font-medium ${
                        yr.netCashflow >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {fmt(yr.netCashflow)}
                    </td>
                    <td
                      className={`px-4 py-2 font-mono text-right ${
                        yr.cumulativeCashflow >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {fmt(yr.cumulativeCashflow)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
