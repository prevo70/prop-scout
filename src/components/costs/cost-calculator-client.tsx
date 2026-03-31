"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { fmt } from "@/components/detail/shared";

interface CostResult {
  purchasePrice: number;
  buyerType: string;
  depositPercent: number;
  isCashPurchase: boolean;
  lineItems: Record<string, number>;
  totalAcquisitionCosts: number;
  effectivePurchasePrice: number;
  depositAmount: number;
  loanAmount: number;
  totalCashRequired: number;
}

const labelMap: Record<string, string> = {
  stampDuty: "Stamp Duty",
  stampDutySurcharge: "Foreign Surcharge",
  conveyancing: "Conveyancing",
  legalFees: "Legal Fees",
  buildingInspection: "Building Inspection",
  pestInspection: "Pest Inspection",
  strataReport: "Strata Report",
  titleSearch: "Title Search",
  mortgageRegistration: "Mortgage Registration",
  transferRegistration: "Transfer Registration",
  loanApplicationFee: "Loan Application Fee",
  depreciationSchedule: "Depreciation Schedule",
  buyersAgentFee: "Buyer's Agent",
  financialPlannerFee: "Financial Planner",
};

export function CostCalculatorClient() {
  const [purchasePrice, setPurchasePrice] = useState(1_250_000);
  const [buyerType, setBuyerType] = useState("investor");
  const [propertyType, setPropertyType] = useState("apartment");
  const [depositPercent, setDepositPercent] = useState(20);
  const [isCashPurchase, setIsCashPurchase] = useState(false);
  const [includeBuyersAgent, setIncludeBuyersAgent] = useState(false);
  const [includeFinancialPlanner, setIncludeFinancialPlanner] = useState(false);
  const [result, setResult] = useState<CostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleCalculate() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/costs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purchasePrice,
          buyerType,
          propertyType,
          depositPercent,
          isCashPurchase,
          includeBuyersAgent,
          includeFinancialPlanner,
        }),
      });

      const payload = await response.json() as { result?: CostResult; error?: string };
      if (!response.ok || !payload.result) {
        throw new Error(payload.error ?? "Calculation failed");
      }

      setResult(payload.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Acquisition Cost Calculator</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Foundation production UI for sprint 1. This calculates NSW acquisition costs without requiring listing ingestion.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="purchase-price">Purchase Price</Label>
              <Input
                id="purchase-price"
                type="number"
                step={10000}
                value={purchasePrice}
                onChange={(event) => setPurchasePrice(Number(event.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Buyer Type</Label>
              <Select value={buyerType} onValueChange={(value) => {
                if (value) setBuyerType(value);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="owner_occupier">Owner Occupier</SelectItem>
                  <SelectItem value="foreign">Foreign Buyer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select value={propertyType} onValueChange={(value) => {
                if (value) setPropertyType(value);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit-percent">Deposit Percent</Label>
              <Input
                id="deposit-percent"
                type="number"
                step={1}
                value={depositPercent}
                onChange={(event) => setDepositPercent(Number(event.target.value))}
                disabled={isCashPurchase}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                <Label htmlFor="cash-purchase">Cash Purchase</Label>
                <Switch id="cash-purchase" checked={isCashPurchase} onCheckedChange={setIsCashPurchase} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                <Label htmlFor="buyers-agent">Include Buyer&apos;s Agent</Label>
                <Switch id="buyers-agent" checked={includeBuyersAgent} onCheckedChange={setIncludeBuyersAgent} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                <Label htmlFor="financial-planner">Include Financial Planner</Label>
                <Switch id="financial-planner" checked={includeFinancialPlanner} onCheckedChange={setIncludeFinancialPlanner} />
              </div>
            </div>

            <div className="md:col-span-2">
              <Button onClick={handleCalculate} disabled={pending} className="w-full sm:w-auto">
                {pending ? "Calculating..." : "Calculate Costs"}
              </Button>
            </div>

            {error && (
              <p className="md:col-span-2 text-sm text-red-400">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result && (
              <p className="text-sm text-muted-foreground">Run the calculator to see the cost stack.</p>
            )}

            {result && (
              <>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Acquisition Costs</p>
                  <p className="font-mono text-2xl font-semibold text-amber-400">{fmt(result.totalAcquisitionCosts)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Cash Required</p>
                  <p className="font-mono text-xl font-semibold">{fmt(result.totalCashRequired)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Loan Amount</p>
                  <p className="font-mono text-lg font-semibold">{fmt(result.loanAmount)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Effective Purchase Price</p>
                  <p className="font-mono text-lg font-semibold">{fmt(result.effectivePurchasePrice)}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(result.lineItems)
              .filter(([, value]) => value > 0)
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <span className="text-sm text-muted-foreground">{labelMap[key] ?? key}</span>
                  <span className="font-mono text-sm">{fmt(value)}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
