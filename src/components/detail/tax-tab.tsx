"use client";

import { useState, useMemo } from "react";
import type { DerivedValues } from "@/lib/calculations";
import { calculateFullTax, type TaxProfileInputs } from "@/lib/tax";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { fmt } from "./shared";

interface TaxTabProps {
  derived: DerivedValues;
}

const chartConfig = {
  before: { label: "Before Property", color: "hsl(215 16% 47%)" },
  after: { label: "After Property", color: "hsl(45 93% 47%)" },
  saving: { label: "Tax Saving", color: "hsl(160 84% 39%)" },
} satisfies ChartConfig;

const bracketChartConfig = {
  tax: { label: "Tax", color: "hsl(45 93% 47%)" },
} satisfies ChartConfig;

export function TaxTab({ derived }: TaxTabProps) {
  // Personal inputs
  const [grossSalary, setGrossSalary] = useState(120_000);
  const [otherIncome, setOtherIncome] = useState(0);
  const [deductions, setDeductions] = useState(3_000);
  const [hasHELP, setHasHELP] = useState(false);
  const [depreciationAmount, setDepreciationAmount] = useState(8_000);

  // Property rental figures from scenario
  const rentalIncome = derived.ltrAnnual;
  const rentalExpenses = derived.annualInterest + derived.annualHolding + depreciationAmount;

  const inputs: TaxProfileInputs = useMemo(() => ({
    grossSalary,
    otherIncome,
    deductions,
    hasHELP,
    rentalIncome,
    rentalExpenses,
    depreciationAmount,
  }), [grossSalary, otherIncome, deductions, hasHELP, rentalIncome, rentalExpenses, depreciationAmount]);

  const result = useMemo(() => calculateFullTax(inputs), [inputs]);

  // Chart data
  const comparisonData = [
    { name: "Tax", before: result.totalTaxBeforeProperty, after: result.totalTaxAfterProperty },
    { name: "Take Home", before: result.takeHomeBeforeProperty, after: result.takeHomeAfterProperty },
  ];

  const bracketData = result.brackets
    .filter(b => b.rate > 0)
    .map(b => ({
      name: b.label,
      tax: b.taxInBracket,
      rate: b.rate,
    }));

  const marginalBefore = Math.round(result.marginalRateBeforeProperty * 100);
  const marginalAfter = Math.round(result.marginalRateAfterProperty * 100);
  const bracketChanged = marginalBefore !== marginalAfter;

  return (
    <div className="space-y-6">
      {/* Input Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Your Income</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Gross Salary (annual)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input type="number" value={grossSalary} onChange={e => setGrossSalary(Number(e.target.value))} step={5000} className="pl-7 font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Other Income (dividends, interest)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input type="number" value={otherIncome} onChange={e => setOtherIncome(Number(e.target.value))} step={1000} className="pl-7 font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Work Deductions</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input type="number" value={deductions} onChange={e => setDeductions(Number(e.target.value))} step={500} className="pl-7 font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Depreciation (Div 43 + Div 40)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input type="number" value={depreciationAmount} onChange={e => setDepreciationAmount(Number(e.target.value))} step={1000} className="pl-7 font-mono text-sm" />
              </div>
            </div>
            <Separator className="opacity-30" />
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">HECS/HELP Debt</Label>
              <Switch checked={hasHELP} onCheckedChange={setHasHELP} />
            </div>
          </CardContent>
        </Card>

        {/* Property Rental Summary */}
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Property Rental Position</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Rental Income</p>
              <p className="font-mono text-lg font-semibold text-emerald-400">{fmt(rentalIncome)}/yr</p>
              <p className="text-xs text-muted-foreground">${derived.ltrWeekly}/wk × 52</p>
            </div>
            <Separator className="opacity-30" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest</span>
                <span className="font-mono text-red-400">-{fmt(derived.annualInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Holding Costs</span>
                <span className="font-mono text-red-400">-{fmt(derived.annualHolding)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Depreciation</span>
                <span className="font-mono text-red-400">-{fmt(depreciationAmount)}</span>
              </div>
            </div>
            <Separator className="opacity-30" />
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Expenses</p>
              <p className="font-mono text-lg font-semibold text-red-400">{fmt(rentalExpenses)}/yr</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Net Rental Position</p>
              <p className={`font-mono text-xl font-bold ${result.netRentalIncome >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {fmt(result.netRentalIncome)}/yr
              </p>
              <p className="text-xs text-muted-foreground">
                {result.netRentalIncome < 0 ? "Rental loss — reduces your taxable income" : "Positive — adds to taxable income"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tax Impact Summary */}
        <Card className={`border-border/50 ${result.taxSaving > 0 ? "border-emerald-400/30 bg-emerald-400/5" : ""}`}>
          <CardHeader><CardTitle className="text-base">Tax Impact</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Tax Saving</p>
              <p className="font-mono text-2xl font-bold text-emerald-400">{fmt(result.taxSaving)}/yr</p>
              <p className="text-xs text-muted-foreground">
                {fmt(result.netRentalIncome)} loss × {marginalBefore}% marginal rate
              </p>
            </div>
            <Separator className="opacity-30" />
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Effective Out-of-Pocket</p>
              <p className="font-mono text-lg font-semibold text-amber-400">
                {result.effectivePropertyCost > 0 ? `${fmt(result.effectivePropertyCost)}/yr` : "Cash positive"}
              </p>
              {result.effectivePropertyCost > 0 && (
                <p className="text-xs text-muted-foreground">${result.weeklyPropertyCost}/wk after tax benefit</p>
              )}
            </div>
            <Separator className="opacity-30" />
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Marginal Rate</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{marginalBefore}%</Badge>
                <span className="text-muted-foreground">→</span>
                <Badge variant={bracketChanged ? "default" : "outline"}>
                  {marginalAfter}%
                </Badge>
                {bracketChanged && (
                  <span className="text-xs text-emerald-400">Bracket dropped!</span>
                )}
              </div>
            </div>
            <Separator className="opacity-30" />
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Weekly Take-Home Impact</p>
              <p className={`font-mono text-lg font-semibold ${result.takeHomeDifference >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {result.takeHomeDifference >= 0 ? "+" : ""}{fmt(result.takeHomeDifference)}/wk
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Before vs After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Before vs After Property</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="text-right">Without Property</TableHead>
                  <TableHead className="text-right">With Property</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">Taxable Income</TableCell>
                  <TableCell className="text-right font-mono text-sm">{fmt(result.taxableIncomeBeforeProperty)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{fmt(result.taxableIncomeAfterProperty)}</TableCell>
                  <TableCell className={`text-right font-mono text-sm ${result.netRentalIncome < 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    {fmt(result.taxableIncomeAfterProperty - result.taxableIncomeBeforeProperty)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">Income Tax</TableCell>
                  <TableCell className="text-right font-mono text-sm">{fmt(result.taxBeforeProperty)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{fmt(result.taxAfterProperty)}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-emerald-400">
                    {fmt(result.taxAfterProperty - result.taxBeforeProperty)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">Medicare Levy</TableCell>
                  <TableCell className="text-right font-mono text-sm">{fmt(Math.round(result.taxableIncomeBeforeProperty * 0.02))}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{fmt(result.medicareLevy)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {fmt(result.medicareLevy - Math.round(result.taxableIncomeBeforeProperty * 0.02))}
                  </TableCell>
                </TableRow>
                {result.lito > 0 && (
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">LITO</TableCell>
                    <TableCell className="text-right font-mono text-sm">-{fmt(Math.round(calculateLITOSafe(result.taxableIncomeBeforeProperty)))}</TableCell>
                    <TableCell className="text-right font-mono text-sm">-{fmt(Math.round(result.lito))}</TableCell>
                    <TableCell className="text-right font-mono text-sm"></TableCell>
                  </TableRow>
                )}
                {hasHELP && (
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">HELP Repayment</TableCell>
                    <TableCell className="text-right font-mono text-sm">{fmt(result.helpRepayment)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{fmt(result.helpRepayment)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">—</TableCell>
                  </TableRow>
                )}
                <TableRow className="border-t-2">
                  <TableCell className="text-sm font-semibold">Total Tax</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{fmt(result.totalTaxBeforeProperty)}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{fmt(result.totalTaxAfterProperty)}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold text-emerald-400">
                    {fmt(result.totalTaxAfterProperty - result.totalTaxBeforeProperty)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm font-semibold">Take-Home Pay</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{fmt(result.takeHomeBeforeProperty)}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{fmt(result.takeHomeAfterProperty)}</TableCell>
                  <TableCell className={`text-right font-mono text-sm font-semibold ${result.takeHomeAfterProperty >= result.takeHomeBeforeProperty ? "text-emerald-400" : "text-red-400"}`}>
                    {fmt(result.takeHomeAfterProperty - result.takeHomeBeforeProperty)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Tax Comparison</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={comparisonData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={v => `$${Math.round(v / 1000)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="before" name="Without Property" fill="hsl(215 16% 47%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="With Property" fill="hsl(45 93% 47%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tax Bracket Visualization */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Tax Bracket Breakdown (2025-26)</CardTitle>
            <Badge variant="outline" className="font-mono text-xs">Stage 3 Rates</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer config={bracketChartConfig} className="h-[250px] w-full">
              <BarChart data={bracketData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={v => `$${Math.round(v / 1000)}k`} />
                <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={50} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tax" name="Tax in Bracket" radius={[0, 4, 4, 0]}>
                  {bracketData.map((entry, i) => (
                    <Cell key={i} fill={
                      entry.rate >= 0.45 ? "hsl(0 84% 60%)" :
                      entry.rate >= 0.37 ? "hsl(25 95% 53%)" :
                      entry.rate >= 0.30 ? "hsl(45 93% 47%)" :
                      "hsl(160 84% 39%)"
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bracket</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Income Range</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-sm">Tax Free</TableCell>
                    <TableCell className="text-right font-mono text-sm">0%</TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">$0–$18,200</TableCell>
                    <TableCell className="text-right font-mono text-sm">$0</TableCell>
                  </TableRow>
                  {result.brackets.filter(b => b.rate > 0).map(b => {
                    const isActive = result.taxableIncomeAfterProperty >= b.min;
                    const isCurrent = result.taxableIncomeAfterProperty >= b.min && result.taxableIncomeAfterProperty <= b.max;
                    return (
                      <TableRow key={b.label} className={isCurrent ? "bg-amber-400/10" : ""}>
                        <TableCell className={`text-sm ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                          {b.label}
                          {isCurrent && <span className="ml-2 text-[10px] text-amber-400">YOU</span>}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{b.label}</TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">
                          {fmt(b.min)}–{b.max === Infinity || b.max > 1_000_000 ? "∞" : fmt(b.max)}
                        </TableCell>
                        <TableCell className={`text-right font-mono text-sm ${isActive ? "" : "text-muted-foreground"}`}>
                          {isActive ? fmt(b.taxInBracket) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Negative Gearing Explanation */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-violet-500/20 flex items-center justify-center">
              <span className="text-violet-400 text-[10px] font-bold">NG</span>
            </div>
            <CardTitle className="text-base">How Negative Gearing Works</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              Your rental property generates {fmt(rentalIncome)} in annual rent but costs
              {" "}{fmt(rentalExpenses)} in deductible expenses (interest, holding costs, depreciation),
              creating a <strong className="text-foreground">net rental loss of {fmt(Math.abs(result.netRentalIncome))}</strong>.
            </p>
            <p>
              This loss reduces your taxable income from {fmt(result.taxableIncomeBeforeProperty)} to{" "}
              {fmt(result.taxableIncomeAfterProperty)}, saving you{" "}
              <strong className="text-emerald-400">{fmt(result.taxSaving)} in tax</strong> at
              your {marginalBefore}% marginal rate.
            </p>
            {result.effectivePropertyCost > 0 ? (
              <p>
                After the tax benefit, your actual out-of-pocket cost for holding this property is{" "}
                <strong className="text-amber-400">{fmt(result.effectivePropertyCost)}/yr</strong> ({" "}
                ${result.weeklyPropertyCost}/wk) — while building equity through capital growth
                and loan repayment.
              </p>
            ) : (
              <p>
                <strong className="text-emerald-400">This property is effectively self-funding</strong> after
                the negative gearing tax benefit is applied.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Safe LITO calculation for the "before" column
function calculateLITOSafe(taxableIncome: number): number {
  if (taxableIncome <= 37_500) return 700;
  if (taxableIncome <= 45_000) return 700 - 0.05 * (taxableIncome - 37_500);
  if (taxableIncome <= 66_667) return 325 - 0.015 * (taxableIncome - 45_000);
  return 0;
}
