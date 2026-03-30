"use client";

import type { Property } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CostRow, M, fmt } from "./shared";

interface InvestmentTabProps {
  p: Property;
}

export function InvestmentTab({ p }: InvestmentTabProps) {
  const fiveYearValue = Math.round(
    p.price * Math.pow(1 + p.fiveYearCagr / 100, 5)
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Annual Cashflow */}
      <Card>
        <CardHeader>
          <CardTitle>Annual Cashflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CostRow
            label="Net Rental Income"
            amount={
              <span className="font-mono text-sm text-emerald-400">
                +{fmt(p.ltrAnnual)}
              </span>
            }
          />
          <CostRow
            label={`Interest (${p.interestRate}%)`}
            amount={
              <span className="font-mono text-sm text-red-400">
                -{fmt(p.annualInterest)}
              </span>
            }
          />
          <CostRow
            label="Holding Costs"
            amount={
              <span className="font-mono text-sm text-red-400">
                -{fmt(p.annualHolding)}
              </span>
            }
          />
          <Separator />
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold">Net Cashflow</span>
            <span
              className={`font-mono text-sm font-semibold ${
                p.annualCashflow >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {p.annualCashflow >= 0 ? "+" : ""}
              {fmt(p.annualCashflow)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Yield Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Yield Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <M label="Gross Yield" value={`${p.grossYield.toFixed(2)}%`} />
          <M label="Net Yield" value={`${p.netYield.toFixed(2)}%`} />
          <M label="Cap Rate" value={`${p.capRate.toFixed(2)}%`} />
          <M
            label="Cash-on-Cash"
            value={`${p.cashOnCash.toFixed(2)}%`}
            accent={p.cashOnCash < 0}
          />
        </CardContent>
      </Card>

      {/* 5-Year Projection */}
      <Card>
        <CardHeader>
          <CardTitle>5-Year Projection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <M label="CAGR" value={`${p.fiveYearCagr.toFixed(1)}%`} />
          <M label="Projected Value" value={fmt(fiveYearValue)} />
          <M label="Projected Equity" value={fmt(p.fiveYearEquity)} accent />
          <M
            label="Price to Median"
            value={`${p.priceToMedian.toFixed(2)}x`}
            sub={`Suburb median: ${fmt(p.suburbMedian)}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
