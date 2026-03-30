"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

interface MarketPositionProps {
  suburbMedian: number;
  propertyPrice: number;
  propertyLabel: string;
}

const AMBER = "hsl(45 93% 47%)";
const SLATE = "hsl(215 16% 47%)";

const chartConfig = {
  price: { label: "Price", color: AMBER },
} satisfies ChartConfig;

function formatDollar(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function MarketPosition({
  suburbMedian,
  propertyPrice,
  propertyLabel,
}: MarketPositionProps) {
  const data = [
    { name: "Suburb Median", price: suburbMedian, fill: SLATE },
    { name: propertyLabel, price: propertyPrice, fill: AMBER },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[150px] w-full">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickFormatter={formatDollar}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatDollar(value as number)}
            />
          }
        />
        <Bar dataKey="price" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
