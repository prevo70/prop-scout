"use client";

import { useState, useMemo } from "react";
import type { Property } from "@/lib/data";
import { calculateMortgage } from "@/lib/calculations";
import { DEFAULT_LOAN as DL } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fmt } from "./shared";

interface CalculatorTabProps {
  property: Property;
}

export function CalculatorTab({ property }: CalculatorTabProps) {
  const [purchasePrice, setPurchasePrice] = useState(property.price);
  const [deposit, setDeposit] = useState(
    Math.round(property.price * DL.depositPercent / 100)
  );
  const [rate, setRate] = useState<number>(DL.interestRate);
  const [term, setTerm] = useState<number>(DL.loanTermYears);

  const result = useMemo(
    () => calculateMortgage(purchasePrice, deposit, rate, term),
    [purchasePrice, deposit, rate, term]
  );

  const lvrColor =
    result.lvr <= 80
      ? "text-emerald-400"
      : result.lvr <= 90
        ? "text-amber-400"
        : "text-red-400";

  const lvrBadgeVariant: "default" | "secondary" | "destructive" =
    result.lvr <= 80
      ? "secondary"
      : result.lvr <= 90
        ? "secondary"
        : "destructive";

  const priceMin = Math.round(property.price * 0.5);
  const priceMax = Math.round(property.price * 1.5);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Input controls */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Purchase price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Purchase Price
              </Label>
              <span className="font-mono text-sm">{fmt(purchasePrice)}</span>
            </div>
            <Input
              type="number"
              step={10000}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="font-mono text-sm"
            />
            <Slider
              min={priceMin}
              max={priceMax}
              step={10000}
              value={[purchasePrice]}
              onValueChange={(val) => setPurchasePrice(Array.isArray(val) ? val[0] : val)}
            />
          </div>

          {/* Deposit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Deposit</Label>
              <span className="font-mono text-sm">{fmt(deposit)}</span>
            </div>
            <Input
              type="number"
              step={10000}
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="font-mono text-sm"
            />
            <Slider
              min={0}
              max={purchasePrice}
              step={10000}
              value={[deposit]}
              onValueChange={(val) => setDeposit(Array.isArray(val) ? val[0] : val)}
            />
          </div>

          {/* Interest rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Interest Rate
              </Label>
              <span className="font-mono text-sm">{rate.toFixed(2)}%</span>
            </div>
            <Input
              type="number"
              step={0.05}
              min={2}
              max={10}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="font-mono text-sm"
            />
            <Slider
              min={2}
              max={10}
              step={0.05}
              value={[rate]}
              onValueChange={(val) => setRate(Array.isArray(val) ? val[0] : val)}
            />
          </div>

          {/* Loan term */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Loan Term</Label>
            <Select
              value={String(term)}
              onValueChange={(val) => val && setTerm(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 years</SelectItem>
                <SelectItem value="20">20 years</SelectItem>
                <SelectItem value="25">25 years</SelectItem>
                <SelectItem value="30">30 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Output display */}
      <div className="space-y-4">
        {/* Monthly repayments */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Repayments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Principal & Interest
              </p>
              <p className="font-mono text-2xl font-bold">
                {fmt(result.monthlyPI)}
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Interest Only
              </p>
              <p className="font-mono text-2xl font-bold text-muted-foreground">
                {fmt(result.monthlyIO)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Loan details */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Loan Amount</span>
              <span className="font-mono text-sm font-medium">
                {fmt(result.loanAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">LVR</span>
              <span className="flex items-center gap-2">
                <span className={`font-mono text-sm font-medium ${lvrColor}`}>
                  {result.lvr.toFixed(1)}%
                </span>
                {result.lmiRequired && (
                  <Badge variant={lvrBadgeVariant}>LMI Required</Badge>
                )}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Interest (P&I)
              </span>
              <span className="font-mono text-sm">{fmt(result.totalInterestPI)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Interest (IO)
              </span>
              <span className="font-mono text-sm">{fmt(result.totalInterestIO)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
