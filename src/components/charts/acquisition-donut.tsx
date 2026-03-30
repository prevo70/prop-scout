"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

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

const COLORS = {
  stampDuty: "hsl(0 84% 60%)",
  conveyancing: "hsl(217 91% 60%)",
  legal: "hsl(45 93% 47%)",
  inspections: "hsl(160 84% 39%)",
  registration: "hsl(215 16% 47%)",
  other: "hsl(280 60% 55%)",
} as const;

const chartConfig = {
  stampDuty: { label: "Stamp Duty", color: COLORS.stampDuty },
  conveyancing: { label: "Conveyancing", color: COLORS.conveyancing },
  legal: { label: "Legal Fees", color: COLORS.legal },
  inspections: { label: "Inspections", color: COLORS.inspections },
  registration: { label: "Registration", color: COLORS.registration },
  other: { label: "Other", color: COLORS.other },
} satisfies ChartConfig;

function formatDollar(value: number) {
  return `$${value.toLocaleString()}`;
}

export function AcquisitionDonut(props: AcquisitionDonutProps) {
  const data = [
    { name: "stampDuty", value: props.stampDuty },
    { name: "conveyancing", value: props.conveyancing },
    { name: "legal", value: props.legalFees },
    {
      name: "inspections",
      value: props.buildingInspection + props.pestInspection,
    },
    {
      name: "registration",
      value: props.mortgageRegistration + props.transferRegistration,
    },
    {
      name: "other",
      value:
        props.titleSearch +
        props.strataReport +
        props.depreciationSchedule +
        props.loanApplicationFee,
    },
  ].filter((d) => d.value > 0);

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="name"
              formatter={(value) => formatDollar(value as number)}
            />
          }
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={chartConfig[entry.name as keyof typeof chartConfig]?.color}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
