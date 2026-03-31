"use client";

import { useState, useMemo } from "react";
import type { Property } from "@/lib/data";
import type { DerivedValues } from "@/lib/calculations";
import { projectBreakeven, type BreakevenInputs } from "@/lib/calculations";
import type { ScenarioAdjustments } from "@/lib/scenarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import { fmt } from "./shared";

interface BreakevenTabProps {
  property: Property;
  adjustments: ScenarioAdjustments;
  derived: DerivedValues;
}

const chartConfig = {
  netPosition: { label: "Net Position", color: "hsl(45 93% 47%)" },
  equity: { label: "Equity", color: "hsl(160 84% 39%)" },
  cashInvested: { label: "Cash Invested", color: "hsl(0 84% 60%)" },
  totalReturn: { label: "Total Return", color: "hsl(217 91% 60%)" },
} satisfies ChartConfig;

const YEAR_OPTIONS = [5, 10, 15, 20, 25] as const;

export function BreakevenTab({ property, adjustments, derived }: BreakevenTabProps) {
  const [years, setYears] = useState<number>(20);
  const [capitalGrowthRate, setCapitalGrowthRate] = useState(property.fiveYearCagr || 4.0);
  const [rentGrowthRate, setRentGrowthRate] = useState(3.0);
  const [expenseInflation, setExpenseInflation] = useState(3.0);
  const [isInterestOnly, setIsInterestOnly] = useState(false);

  const inputs: BreakevenInputs = useMemo(() => ({
    years,
    expenseInflation,
    capitalGrowthRate,
    rentGrowthRate,
    isInterestOnly,
  }), [years, expenseInflation, capitalGrowthRate, rentGrowthRate, isInterestOnly]);

  const projections = useMemo(
    () => projectBreakeven(property, adjustments, inputs),
    [property, adjustments, inputs]
  );

  // Find break-even year
  const breakevenYear = projections.find(p => p.cumulativeNetPosition >= 0);
  const cashflowPositiveYear = projections.find(p => p.netCashflow >= 0);

  // Chart data
  const chartData = projections.map(p => ({
    year: `Y${p.year}`,
    netPosition: p.cumulativeNetPosition,
    equity: p.equity,
    cashInvested: -p.cumulativeCashInvested,
    totalReturn: p.totalReturn,
  }));

  // Summary at final year
  const final = projections[projections.length - 1];
  const isCash = adjustments.isCashPurchase;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Break-Even Projection</CardTitle>
            <div className="flex items-center gap-1">
              {YEAR_OPTIONS.map(n => (
                <Button
                  key={n}
                  variant={years === n ? "secondary" : "ghost"}
                  size="sm"
                  className="font-mono text-xs px-2.5"
                  onClick={() => setYears(n)}
                >
                  {n}yr
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Capital Growth %/yr</Label>
              <Input type="number" step={0.5} value={capitalGrowthRate} onChange={e => setCapitalGrowthRate(Number(e.target.value))} className="font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Rent Growth %/yr</Label>
              <Input type="number" step={0.5} value={rentGrowthRate} onChange={e => setRentGrowthRate(Number(e.target.value))} className="font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Expense Inflation %/yr</Label>
              <Input type="number" step={0.5} value={expenseInflation} onChange={e => setExpenseInflation(Number(e.target.value))} className="font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Interest Rate</Label>
              <Input type="number" step={0.1} value={derived.interestRate} disabled className="font-mono text-sm opacity-60" />
            </div>
            {!isCash && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Interest Only</Label>
                <div className="pt-1">
                  <Switch checked={isInterestOnly} onCheckedChange={setIsInterestOnly} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className={`border-border/50 ${breakevenYear ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/5"}`}>
          <CardContent className="pt-6 space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Break-Even Point</p>
            {breakevenYear ? (
              <>
                <p className="font-mono text-2xl font-bold text-emerald-400">Year {breakevenYear.year}</p>
                <p className="text-xs text-muted-foreground">Equity exceeds total cash invested</p>
              </>
            ) : (
              <>
                <p className="font-mono text-2xl font-bold text-amber-400">&gt; {years} years</p>
                <p className="text-xs text-muted-foreground">Not reached within projection period</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6 space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {isCash ? "Cash Purchase" : "Cashflow Positive From"}
            </p>
            {isCash ? (
              <>
                <p className="font-mono text-2xl font-bold">Year 1</p>
                <p className="text-xs text-muted-foreground">No interest costs — immediate rental income</p>
              </>
            ) : cashflowPositiveYear ? (
              <>
                <p className="font-mono text-2xl font-bold text-emerald-400">Year {cashflowPositiveYear.year}</p>
                <p className="text-xs text-muted-foreground">Rent growth exceeds rising expenses</p>
              </>
            ) : (
              <>
                <p className="font-mono text-2xl font-bold text-amber-400">&gt; {years} years</p>
                <p className="text-xs text-muted-foreground">Still negatively geared at projection end</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6 space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Return at Year {years}</p>
            {final && (
              <>
                <p className={`font-mono text-2xl font-bold ${final.totalReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {fmt(final.totalReturn)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ROI: {final.roiPercent}% on {fmt(final.cumulativeCashInvested)} invested
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Net Position Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart data={chartData} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={v => `$${Math.round(v / 1000)}k`} />
              <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeDasharray="4 4" strokeOpacity={0.4} />
              <ChartTooltip content={<ChartTooltipContent formatter={v => fmt(v as number)} />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="equity" name="Equity" stroke="hsl(160 84% 39%)" fill="hsl(160 84% 39%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="cashInvested" name="Cash Invested" stroke="hsl(0 84% 60%)" fill="hsl(0 84% 60%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="netPosition" name="Net Position" stroke="hsl(45 93% 47%)" fill="hsl(45 93% 47%)" fillOpacity={0.15} strokeWidth={2.5} />
            </AreaChart>
          </ChartContainer>
          <p className="text-xs text-muted-foreground mt-2">
            Break-even = when the amber line (Net Position) crosses above zero. Net Position = Equity - Total Cash Invested.
          </p>
        </CardContent>
      </Card>

      {/* Detailed table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Year-by-Year Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto -mx-6 px-6">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card z-10 w-14">Year</TableHead>
                  <TableHead className="text-right">Property Value</TableHead>
                  {!isCash && <TableHead className="text-right">Loan Balance</TableHead>}
                  <TableHead className="text-right">Equity</TableHead>
                  <TableHead className="text-right">Annual Rent</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Cashflow</TableHead>
                  <TableHead className="text-right">Cash Invested</TableHead>
                  <TableHead className="text-right">Net Position</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projections.map(p => {
                  const isBreakeven = breakevenYear?.year === p.year;
                  return (
                    <TableRow key={p.year} className={isBreakeven ? "bg-emerald-400/10" : ""}>
                      <TableCell className="sticky left-0 bg-card z-10 font-mono text-sm font-medium">
                        {p.year}
                        {isBreakeven && <Badge variant="outline" className="ml-1.5 text-[9px] text-emerald-400 border-emerald-400/30 px-1">BE</Badge>}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{fmt(p.propertyValue)}</TableCell>
                      {!isCash && <TableCell className="text-right font-mono text-sm">{fmt(p.loanBalance)}</TableCell>}
                      <TableCell className="text-right font-mono text-sm">{fmt(p.equity)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{fmt(p.annualRent)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-red-400">{fmt(p.annualExpenses)}</TableCell>
                      <TableCell className={`text-right font-mono text-sm ${p.netCashflow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {fmt(p.netCashflow)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{fmt(p.cumulativeCashInvested)}</TableCell>
                      <TableCell className={`text-right font-mono text-sm font-semibold ${p.cumulativeNetPosition >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {fmt(p.cumulativeNetPosition)}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-sm ${p.roiPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {p.roiPercent}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
