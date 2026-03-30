"use client";

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

interface SubjectPoint {
  sqm: number;
  price: number;
  label: string;
}

interface CompPoint {
  sqm: number;
  price: number;
  label: string;
  similarity: number;
}

interface CompsScatterProps {
  subject: SubjectPoint;
  comps: CompPoint[];
}

const AMBER = "hsl(45 93% 47%)";
const BLUE = "hsl(217 91% 60%)";

const chartConfig = {
  subject: { label: "Subject Property", color: AMBER },
  comps: { label: "Comparable Sales", color: BLUE },
} satisfies ChartConfig;

function formatDollar(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

interface TooltipPayloadItem {
  payload: {
    label?: string;
    price?: number;
    sqm?: number;
  };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">{data.label}</p>
      <p className="text-muted-foreground">
        {formatDollar(data.price ?? 0)} &middot; {data.sqm}m&sup2;
      </p>
    </div>
  );
}

export function CompsScatter({ subject, comps }: CompsScatterProps) {
  const subjectData = [{ ...subject, isSubject: true }];
  const compsData = comps.map((c) => ({ ...c, isSubject: false }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="sqm"
          type="number"
          name="sqm"
          tickLine={false}
          axisLine={false}
          label={{ value: "m²", position: "insideBottomRight", offset: -5 }}
        />
        <YAxis
          dataKey="price"
          type="number"
          name="price"
          tickLine={false}
          axisLine={false}
          tickFormatter={formatDollar}
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Scatter name="comps" data={compsData}>
          {compsData.map((entry, index) => (
            <Cell
              key={index}
              fill={BLUE}
              r={4 + entry.similarity * 6}
              fillOpacity={0.7}
            />
          ))}
        </Scatter>
        <Scatter name="subject" data={subjectData}>
          {subjectData.map((_, index) => (
            <Cell key={index} fill={AMBER} r={10} fillOpacity={1} />
          ))}
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  );
}
