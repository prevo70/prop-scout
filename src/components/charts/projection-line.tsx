"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface ProjectionPoint {
  year: number;
  equity: number;
  cumulativeCashflow: number;
  propertyValue: number;
}

interface ProjectionLineProps {
  projections: ProjectionPoint[];
}

const chartConfig = {
  equity: { label: "Equity", color: "hsl(160 84% 39%)" },
  cumulativeCashflow: {
    label: "Cumulative Cashflow",
    color: "hsl(45 93% 47%)",
  },
} satisfies ChartConfig;

function formatDollar(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  if (value <= -1_000_000) return `-$${(Math.abs(value) / 1_000_000).toFixed(1)}M`;
  if (value <= -1_000) return `-$${(Math.abs(value) / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function ProjectionLine({ projections }: ProjectionLineProps) {
  const data = projections.map((p) => ({
    ...p,
    yearLabel: `Year ${p.year}`,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="yearLabel"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={formatDollar}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatDollar(value as number)}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="equity"
          stroke="var(--color-equity)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="cumulativeCashflow"
          stroke="var(--color-cumulativeCashflow)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
