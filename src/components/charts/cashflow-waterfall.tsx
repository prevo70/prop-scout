"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

interface CashflowWaterfallProps {
  netRental: number;
  annualInterest: number;
  annualHolding: number;
  annualCashflow: number;
}

const EMERALD = "hsl(160 84% 39%)";
const RED = "hsl(0 84% 60%)";
const AMBER = "hsl(45 93% 47%)";

const chartConfig = {
  value: { label: "Amount", color: EMERALD },
} satisfies ChartConfig;

function formatDollar(value: number) {
  const prefix = value < 0 ? "-$" : "$";
  return `${prefix}${Math.abs(value).toLocaleString()}`;
}

export function CashflowWaterfall(props: CashflowWaterfallProps) {
  // Waterfall: stacked bar with invisible base + visible segment
  const cashflowValue = props.annualCashflow;

  // Recalculate waterfall positions properly
  let runningTotal = 0;
  const waterfallData = [
    {
      name: "Rental Income",
      base: 0,
      value: props.netRental,
      actual: props.netRental,
      fill: EMERALD,
    },
  ];
  runningTotal = props.netRental;

  const interestAbs = Math.abs(props.annualInterest);
  waterfallData.push({
    name: "Interest",
    base: runningTotal - interestAbs,
    value: interestAbs,
    actual: -interestAbs,
    fill: RED,
  });
  runningTotal -= interestAbs;

  const holdingAbs = Math.abs(props.annualHolding);
  waterfallData.push({
    name: "Holding Costs",
    base: runningTotal - holdingAbs,
    value: holdingAbs,
    actual: -holdingAbs,
    fill: RED,
  });
  runningTotal -= holdingAbs;

  waterfallData.push({
    name: "Net Cashflow",
    base: cashflowValue < 0 ? cashflowValue : 0,
    value: Math.abs(cashflowValue),
    actual: cashflowValue,
    fill: cashflowValue >= 0 ? AMBER : RED,
  });

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={waterfallData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatDollar(v)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(_, __, item) =>
                formatDollar(item.payload?.actual as number)
              }
              hideLabel={false}
            />
          }
        />
        {/* Invisible base bar */}
        <Bar dataKey="base" stackId="waterfall" fill="transparent" />
        {/* Visible value bar */}
        <Bar dataKey="value" stackId="waterfall" radius={[4, 4, 0, 0]}>
          {waterfallData.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
