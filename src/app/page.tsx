"use client";

import { useState } from "react";
import { properties, type Property } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
}
function fmtFull(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 }).format(n);
}
function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400";
  if (s >= 60) return "text-blue-400";
  if (s >= 40) return "text-amber-400";
  if (s >= 20) return "text-orange-400";
  return "text-red-400";
}
function scoreBg(s: number) {
  if (s >= 80) return "bg-emerald-400/10 border-emerald-400/30";
  if (s >= 60) return "bg-blue-400/10 border-blue-400/30";
  if (s >= 40) return "bg-amber-400/10 border-amber-400/30";
  return "bg-red-400/10 border-red-400/30";
}
function recVariant(r: string): "default" | "secondary" | "destructive" | "outline" {
  if (r.includes("STRONG BUY") || r === "BUY") return "default";
  if (r === "HOLD") return "secondary";
  return "destructive";
}

// ─── Metric Block ────────────────────────────────────────────────────────────

function M({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`font-mono text-lg font-semibold ${accent ? "text-amber-400" : ""}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function CostRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm">{fmtFull(amount)}</span>
    </div>
  );
}

function ScoreGauge({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const dim = size === "sm" ? "w-20 h-20" : "w-32 h-32";
  const textSize = size === "sm" ? "text-xl" : "text-3xl";
  return (
    <div className={`relative ${dim}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="8" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className={scoreColor(score)} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score / 100) * 327} 327`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono ${textSize} font-bold ${scoreColor(score)}`}>{score}</span>
        {size === "lg" && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>}
      </div>
    </div>
  );
}

// ─── Property Card (List View) ───────────────────────────────────────────────

function PropertyCard({ p, onClick }: { p: Property; onClick: () => void }) {
  return (
    <Card className={`border cursor-pointer hover:border-foreground/20 transition-colors ${scoreBg(p.score)}`} onClick={onClick}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.heroImage} alt={p.address} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <Badge variant={recVariant(p.recommendation)} className="text-xs">{p.recommendation}</Badge>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-mono text-xl font-bold">
            {p.priceDisplay}
            {!p.priceVerified && <span className="ml-2 text-xs font-normal text-amber-400 bg-amber-400/20 px-1.5 py-0.5 rounded">UNVERIFIED</span>}
          </p>
        </div>
      </div>
      <CardContent className="pt-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{p.building}</p>
          <h3 className="font-semibold text-sm">{p.address}</h3>
          <p className="text-xs text-muted-foreground">{p.suburb}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{p.beds} Bed</span>
          <span>{p.baths} Bath</span>
          <span>{p.cars} Car</span>
          <span>{p.internalSqm} sqm</span>
          <span>L{p.floor}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ScoreGauge score={p.score} size="sm" />
            <div>
              <p className="font-mono text-sm font-semibold">{p.grossYield}%</p>
              <p className="text-[10px] text-muted-foreground">Gross Yield</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-mono text-sm font-semibold ${p.annualCashflow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {fmt(p.annualCashflow)}/yr
            </p>
            <p className="text-[10px] text-muted-foreground">Cashflow</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Comparison View ─────────────────────────────────────────────────────────

function ComparisonView() {
  const metrics: { label: string; fn: (p: Property) => string; highlight?: (p: Property) => boolean }[] = [
    { label: "Price", fn: p => `${p.priceDisplay}${!p.priceVerified ? " *" : ""}` },
    { label: "Beds / Bath / Car", fn: p => `${p.beds} / ${p.baths} / ${p.cars}` },
    { label: "Internal Area", fn: p => `${p.internalSqm} sqm` },
    { label: "Floor Level", fn: p => `Level ${p.floor}` },
    { label: "Building", fn: p => p.building },
    { label: "Investment Score", fn: p => `${p.score}/100`, highlight: p => p.score >= 80 },
    { label: "Recommendation", fn: p => p.recommendation, highlight: p => p.recommendation.includes("BUY") },
    { label: "Gross Yield", fn: p => `${p.grossYield}%`, highlight: p => p.grossYield >= 6 },
    { label: "Net Yield", fn: p => `${p.netYield}%`, highlight: p => p.netYield >= 5 },
    { label: "Annual Cashflow", fn: p => fmt(p.annualCashflow), highlight: p => p.annualCashflow > 0 },
    { label: "Current Rent", fn: p => `$${p.currentRentWeekly}/wk` },
    { label: "Stamp Duty", fn: p => fmt(p.stampDuty) },
    { label: "Total Cash Required", fn: p => fmt(p.totalCashRequired) },
    { label: "Cap Rate", fn: p => `${p.capRate}%` },
    { label: "Days on Market", fn: p => `${p.daysOnMarket}`, highlight: p => p.daysOnMarket <= 7 },
    { label: "Strata (Annual)", fn: p => fmt(p.strataAnnual) },
    { label: "5yr Growth Est.", fn: p => `${p.fiveYearCagr}%` },
    { label: "5yr Equity", fn: p => fmt(p.fiveYearEquity) },
    { label: "Price to Median", fn: p => `${p.priceToMedian}x`, highlight: p => p.priceToMedian < 1 },
    { label: "Target Price", fn: p => `${fmt(p.targetLow)} \u2013 ${fmt(p.targetHigh)}` },
    { label: "Strategy", fn: p => p.recommendedStrategy },
  ];

  return (
    <Card className="border-border/50 overflow-x-auto">
      <CardHeader><CardTitle className="text-base">Side-by-Side Comparison</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">Metric</TableHead>
              {properties.map(p => (
                <TableHead key={p.slug} className="text-center min-w-[180px]">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{p.building}</p>
                    <p className="font-medium text-sm">{p.address.split("/")[0].trim()}</p>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map(m => (
              <TableRow key={m.label}>
                <TableCell className="text-sm text-muted-foreground font-medium">{m.label}</TableCell>
                {properties.map(p => (
                  <TableCell key={p.slug} className={`text-center font-mono text-sm ${m.highlight?.(p) ? "text-emerald-400 font-semibold" : ""}`}>
                    {m.fn(p)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Detail View ─────────────────────────────────────────────────────────────

function DetailView({ p, onBack }: { p: Property; onBack: () => void }) {
  const priceSqm = Math.round(p.price / p.internalSqm);
  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={onBack} className="text-muted-foreground">&larr; Back to all properties</Button>

      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 relative rounded-xl overflow-hidden aspect-[16/9] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.heroImage} alt={p.address} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">{p.building} by {p.architect}</p>
                <h1 className="text-white text-2xl font-semibold">{p.address}</h1>
                <p className="text-white/70 text-sm">{p.suburb}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-mono text-2xl font-bold">{p.priceDisplay}</p>
                <p className="text-white/60 text-xs font-mono">{fmt(priceSqm)}/sqm</p>
                {!p.priceVerified && (
                  <p className="text-amber-400 text-xs mt-1 bg-amber-400/20 px-2 py-0.5 rounded inline-block">
                    Price unverified — comp-based estimate
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50">
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <ScoreGauge score={p.score} />
              <Badge variant={recVariant(p.recommendation)} className="text-base px-4 py-1">{p.recommendation}</Badge>
              <p className="text-xs text-muted-foreground">Risk: {p.riskRating}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 grid grid-cols-2 gap-4">
              <M label="Beds / Bath / Car" value={`${p.beds} / ${p.baths} / ${p.cars}`} />
              <M label="Internal" value={`${p.internalSqm} sqm`} sub={p.totalSqm !== p.internalSqm ? `${p.totalSqm} sqm total` : undefined} />
              <M label="Floor Level" value={`Level ${p.floor}`} />
              <M label="Days on Market" value={`${p.daysOnMarket}`} sub={`Median: ${p.medianDays}`} accent={p.daysOnMarket > p.medianDays * 1.5} />
              <M label="Current Rent" value={`$${p.currentRentWeekly}/wk`} sub={p.leaseEnd !== "N/A" ? `Until ${p.leaseEnd}` : "Estimated"} />
              <M label="Gross Yield" value={`${p.grossYield}%`} sub={`Net: ${p.netYield}%`} accent={p.grossYield >= 6} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {p.features.map(f => <Badge key={f} variant="outline" className="text-xs font-normal">{f}</Badge>)}
      </div>
      <Separator className="opacity-30" />

      {/* Tabs */}
      <Tabs defaultValue="costs" className="space-y-6">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="rental">Rental</TabsTrigger>
          <TabsTrigger value="comps">Comparables</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
        </TabsList>

        {/* Costs */}
        <TabsContent value="costs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader><CardTitle className="text-base">Acquisition Cost Breakdown</CardTitle></CardHeader>
              <CardContent>
                <CostRow label="Stamp Duty (NSW Investor)" amount={p.stampDuty} />
                <CostRow label="Conveyancing" amount={2000} />
                <CostRow label="Legal Fees" amount={2500} />
                <CostRow label="Building Inspection" amount={700} />
                <CostRow label="Pest Inspection" amount={400} />
                <CostRow label="Strata Report" amount={300} />
                <CostRow label="Title Search" amount={350} />
                <CostRow label="Mortgage Registration" amount={154.20} />
                <CostRow label="Transfer Registration" amount={154.20} />
                <CostRow label="Loan Application Fee" amount={600} />
                <CostRow label="Depreciation Schedule" amount={750} />
                <Separator className="my-2 opacity-30" />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-semibold">Total Acquisition Costs</span>
                  <span className="font-mono text-sm font-semibold text-amber-400">{fmt(p.totalAcquisition)}</span>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base">Loan Structure</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <M label="Purchase Price" value={fmt(p.price)} />
                  <M label="Deposit (20%)" value={fmt(p.deposit)} />
                  <M label="Loan Amount" value={fmt(p.loanAmount)} />
                  <Separator className="opacity-30" />
                  <M label="Total Cash Required" value={fmt(p.totalCashRequired)} accent />
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base">Holding Costs (Annual)</CardTitle></CardHeader>
                <CardContent>
                  <CostRow label="Strata" amount={p.strataAnnual} />
                  <CostRow label="Council Rates" amount={p.councilAnnual} />
                  <CostRow label="Water Rates" amount={p.waterAnnual} />
                  <CostRow label="Insurance" amount={1800} />
                  <CostRow label="PM (8.5%)" amount={Math.round(p.ltrAnnual * 0.085)} />
                  <Separator className="my-2 opacity-30" />
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="font-mono text-sm font-semibold text-amber-400">{fmt(p.annualHolding)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Rental */}
        <TabsContent value="rental">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-base">Long-Term Rental</CardTitle><Badge>Recommended</Badge></div></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <M label="Weekly Rent" value={`$${p.ltrWeekly}/wk`} />
                  <M label="Annual Rent" value={fmt(p.ltrAnnual)} />
                  <M label="Gross Yield" value={`${p.ltrGrossYield}%`} accent={p.ltrGrossYield >= 6} />
                  <M label="Net Yield" value={`${p.ltrNetYield}%`} accent={p.ltrNetYield >= 5} />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-base">Short-Term Rental</CardTitle><Badge variant="outline">Alternative</Badge></div></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <M label="Nightly Rate" value={`$${p.strNightly}/night`} />
                  <M label="Occupancy" value={`${p.strOccupancy}%`} />
                  <M label="Gross Yield" value={`${p.strGrossYield}%`} />
                  <M label="Net Yield" value={`${p.strNetYield}%`} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comps */}
        <TabsContent value="comps">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Comparable Sales</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Sqm</TableHead>
                    <TableHead className="text-right">$/sqm</TableHead>
                    <TableHead className="text-center">Config</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Similarity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-amber-400/5">
                    <TableCell className="font-medium">{p.address.replace(" / ", "/")} <span className="text-xs text-amber-400">(Subject)</span></TableCell>
                    <TableCell className="text-right font-mono">{fmt(p.price)}</TableCell>
                    <TableCell className="text-right font-mono">{p.internalSqm}</TableCell>
                    <TableCell className="text-right font-mono text-amber-400">{fmt(priceSqm)}</TableCell>
                    <TableCell className="text-center">{p.beds}/{p.baths}/{p.cars}</TableCell>
                    <TableCell className="text-right text-muted-foreground">Listed</TableCell>
                    <TableCell className="text-right">&mdash;</TableCell>
                  </TableRow>
                  {p.comparables.map(c => (
                    <TableRow key={c.address}>
                      <TableCell className="font-medium">{c.address}</TableCell>
                      <TableCell className="text-right font-mono">{fmt(c.price)}</TableCell>
                      <TableCell className="text-right font-mono">{c.sqm || "\u2014"}</TableCell>
                      <TableCell className="text-right font-mono">{c.priceSqm ? fmt(c.priceSqm) : "\u2014"}</TableCell>
                      <TableCell className="text-center">{c.beds}/{c.baths}/{c.cars}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{c.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={c.similarity} className="w-12 h-1.5" />
                          <span className="font-mono text-xs">{c.similarity}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment */}
        <TabsContent value="investment">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Annual Cashflow</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-1.5">
                  <span className="text-sm text-emerald-400">+ Net Rental</span>
                  <span className="font-mono text-sm text-emerald-400">{fmt(Math.round(p.ltrAnnual * 0.965))}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-sm text-red-400">- Interest ({p.interestRate}%)</span>
                  <span className="font-mono text-sm text-red-400">({fmt(p.annualInterest)})</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-sm text-red-400">- Holding Costs</span>
                  <span className="font-mono text-sm text-red-400">({fmt(p.annualHolding)})</span>
                </div>
                <Separator className="opacity-30" />
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Net Cashflow</span>
                  <span className={`font-mono font-bold ${p.annualCashflow >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(p.annualCashflow)}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Yields</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <M label="Gross Yield" value={`${p.grossYield}%`} />
                <M label="Net Yield" value={`${p.netYield}%`} />
                <M label="Cap Rate" value={`${p.capRate}%`} />
                <M label="Cash-on-Cash" value={`${p.cashOnCash}%`} accent />
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">5-Year Projection</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <M label="CAGR" value={`${p.fiveYearCagr}%`} />
                <M label="Projected Value" value={fmt(Math.round(p.price * Math.pow(1 + p.fiveYearCagr / 100, 5)))} />
                <M label="Projected Equity" value={fmt(p.fiveYearEquity)} accent />
                <M label="Price to Median" value={`${p.priceToMedian}x`} sub={`Median: ${fmt(p.suburbMedian)}`} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Negotiation */}
        <TabsContent value="negotiation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 border-amber-400/30 bg-amber-400/5">
              <CardHeader><CardTitle className="text-base text-amber-400">Target Range</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <M label="Opening Offer" value={fmt(p.openingOffer)} accent />
                <M label="Target" value={`${fmt(p.targetLow)} \u2013 ${fmt(p.targetHigh)}`} />
                <M label="Walk-Away" value={fmt(p.walkAway)} sub="Maximum. Do not exceed." />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader><CardTitle className="text-base">Leverage Points</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {p.leveragePoints.map((pt, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-muted-foreground">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pt.title}</p>
                      <p className="text-xs text-muted-foreground">{pt.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-violet-500/20 flex items-center justify-center">
              <span className="text-violet-400 text-[10px] font-bold">AI</span>
            </div>
            <CardTitle className="text-base">Investment Brief</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.aiSummary}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Page() {
  const [view, setView] = useState<"list" | "detail" | "compare">("list");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedProperty = properties.find(p => p.slug === selectedSlug);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView("list"); setSelectedSlug(null); }}>
            <div className="w-6 h-6 rounded bg-amber-400/20 flex items-center justify-center">
              <span className="text-amber-400 text-xs font-bold">PS</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">PropScout</span>
            <span className="text-muted-foreground text-xs hidden sm:inline">/ Sydney CBD</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" onClick={() => { setView("list"); setSelectedSlug(null); }}>
              Properties
            </Button>
            <Button variant={view === "compare" ? "secondary" : "ghost"} size="sm" onClick={() => { setView("compare"); setSelectedSlug(null); }}>
              Compare
            </Button>
            <Badge variant="outline" className="font-mono text-xs hidden sm:inline-flex">{properties.length} properties</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "list" && !selectedSlug && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Investment Properties</h2>
              <p className="text-xs text-muted-foreground">Sydney CBD &middot; {properties.length} assessed</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => (
                <PropertyCard key={p.slug} p={p} onClick={() => { setSelectedSlug(p.slug); setView("detail"); }} />
              ))}
            </div>

            {/* Quick comparison strip */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Quick Comparison</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setView("compare")}>Full comparison &rarr;</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Yield</TableHead>
                      <TableHead className="text-right">Cashflow</TableHead>
                      <TableHead className="text-right">Cash Required</TableHead>
                      <TableHead className="text-center">Rec</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map(p => (
                      <TableRow key={p.slug} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedSlug(p.slug); setView("detail"); }}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{p.address.split("/")[0].trim()}/{p.address.split("/")[1]?.split(",")[0]?.trim()}</p>
                            <p className="text-xs text-muted-foreground">{p.building} &middot; {p.beds}b{p.baths}b{p.cars}c</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{p.priceDisplay}</TableCell>
                        <TableCell className="text-right"><span className={`font-mono font-semibold ${scoreColor(p.score)}`}>{p.score}</span></TableCell>
                        <TableCell className="text-right font-mono">{p.grossYield}%</TableCell>
                        <TableCell className={`text-right font-mono ${p.annualCashflow >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(p.annualCashflow)}</TableCell>
                        <TableCell className="text-right font-mono">{fmt(p.totalCashRequired)}</TableCell>
                        <TableCell className="text-center"><Badge variant={recVariant(p.recommendation)} className="text-xs">{p.recommendation}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {view === "detail" && selectedProperty && (
          <DetailView p={selectedProperty} onBack={() => { setView("list"); setSelectedSlug(null); }} />
        )}

        {view === "compare" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Property Comparison</h2>
              <Button variant="ghost" size="sm" onClick={() => setView("list")}>&larr; Back to list</Button>
            </div>
            <ComparisonView />
          </div>
        )}

        <footer className="text-center py-8 text-xs text-muted-foreground/50 mt-8">
          <p>PropScout &mdash; Investment Property Assessment Platform</p>
          <p className="mt-1">Data: Domain, REA, AirROI. Analysis as at 29 Mar 2026. PDConsults / Decidr</p>
        </footer>
      </main>
    </div>
  );
}
