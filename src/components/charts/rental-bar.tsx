"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface RentalBarProps {
  ltrGrossYield: number;
  ltrNetYield: number;
  strGrossYield: number;
  strNetYield: number;
}

const chartConfig = {
  ltr: { label: "LTR", color: "hsl(160 84% 39%)" },
  str: { label: "STR", color: "hsl(217 91% 60%)" },
} satisfies ChartConfig;

export function RentalBar(props: RentalBarProps) {
  const data = [
    {
      category: "Gross Yield",
      ltr: props.ltrGrossYield,
      str: props.strGrossYield,
    },
    {
      category: "Net Yield",
      ltr: props.ltrNetYield,
      str: props.strNetYield,
    },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="category" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `${(value as number).toFixed(2)}%`}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="ltr" fill="var(--color-ltr)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="str" fill="var(--color-str)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
