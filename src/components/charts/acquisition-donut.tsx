"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";

interface AcquisitionDonutProps {
  stampDuty: number;
  conveyancing: number;
  legalFees: number;
  buildingInspection: number;
  pestInspection: number;
  strataReport: number;
  titleSearch: number;
  mortgageRegistration: number;
  transferRegistration: number;
  loanApplicationFee: number;
  depreciationSchedule: number;
}

const ITEMS = [
  { key: "stampDuty", label: "Stamp Duty", color: "hsl(0 84% 60%)" },
  { key: "conveyancing", label: "Conveyancing", color: "hsl(217 91% 60%)" },
  { key: "legal", label: "Legal Fees", color: "hsl(45 93% 47%)" },
  { key: "building", label: "Building Inspection", color: "hsl(160 84% 39%)" },
  { key: "pest", label: "Pest Inspection", color: "hsl(160 60% 55%)" },
  { key: "strata", label: "Strata Report", color: "hsl(280 60% 55%)" },
  { key: "title", label: "Title Search", color: "hsl(215 16% 57%)" },
  { key: "mortgageReg", label: "Mortgage Reg.", color: "hsl(340 65% 55%)" },
  { key: "transferReg", label: "Transfer Reg.", color: "hsl(340 45% 45%)" },
  { key: "loanApp", label: "Loan App Fee", color: "hsl(25 95% 53%)" },
  { key: "depreciation", label: "Depreciation", color: "hsl(190 70% 50%)" },
] as const;

const chartConfig = Object.fromEntries(
  ITEMS.map(i => [i.key, { label: i.label, color: i.color }])
) as ChartConfig;

function fmt(n: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
}

export function AcquisitionDonut(props: AcquisitionDonutProps) {
  const values: Record<string, number> = {
    stampDuty: props.stampDuty,
    conveyancing: props.conveyancing,
    legal: props.legalFees,
    building: props.buildingInspection,
    pest: props.pestInspection,
    strata: props.strataReport,
    title: props.titleSearch,
    mortgageReg: props.mortgageRegistration,
    transferReg: props.transferRegistration,
    loanApp: props.loanApplicationFee,
    depreciation: props.depreciationSchedule,
  };

  const total = Object.values(values).reduce((a, b) => a + b, 0);

  // Build chart data as horizontal bars sorted by value
  const data = ITEMS
    .map(item => ({
      name: item.label,
      key: item.key,
      value: values[item.key] || 0,
      pct: total > 0 ? ((values[item.key] || 0) / total * 100) : 0,
      color: item.color,
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-4">
      {/* Horizontal bar chart */}
      <ChartContainer config={chartConfig} className="h-[320px] w-full">
        <BarChart data={data} layout="vertical" barSize={16} margin={{ left: 120, right: 16, top: 4, bottom: 4 }}>
          <XAxis
            type="number"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickFormatter={v => `$${Math.round(v / 1000)}k`}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            width={115}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => fmt(value as number)}
              />
            }
          />
          <Bar dataKey="value" name="Cost" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* Legend table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {data.map(item => (
          <div key={item.key} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">{fmt(item.value)}</span>
              <span className="text-[10px] text-muted-foreground/60 w-8 text-right">{item.pct.toFixed(0)}%</span>
            </div>
          </div>
        ))}
        <div className="col-span-full flex items-center justify-between py-1.5 border-t border-border/50 mt-1">
          <span className="text-xs font-semibold">Total</span>
          <span className="font-mono text-xs font-semibold text-amber-400">{fmt(total)}</span>
        </div>
      </div>
    </div>
  );
}
