"use client";

import { useState } from "react";
import type { Property } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CostsTab } from "@/components/detail/costs-tab";
import { RentalTab } from "@/components/detail/rental-tab";
import { CompsTab } from "@/components/detail/comps-tab";
import { InvestmentTab } from "@/components/detail/investment-tab";
import { NegotiationTab } from "@/components/detail/negotiation-tab";
import { TaxTab } from "@/components/detail/tax-tab";
import { ProjectionTab } from "@/components/detail/projection-tab";
import { CalculatorTab } from "@/components/detail/calculator-tab";
import { ScenarioBar } from "@/components/scenario/scenario-bar";
import { ScenarioEditor } from "@/components/scenario/scenario-editor";
import { AcquisitionDonut } from "@/components/charts/acquisition-donut";
import { RentalBar } from "@/components/charts/rental-bar";
import { CashflowWaterfall } from "@/components/charts/cashflow-waterfall";
import { CompsScatter } from "@/components/charts/comps-scatter";
import { ProjectionLine } from "@/components/charts/projection-line";
import { MarketPosition } from "@/components/charts/market-position";
import { fmt, scoreColor, ScoreGauge } from "@/components/detail/shared";
import { useScenario } from "@/hooks/use-scenario";
import { projectFiveYears } from "@/lib/calculations";

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
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
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

function ComparisonView({ properties }: { properties: Property[] }) {
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
    { label: "Target Price", fn: p => `${fmt(p.targetLow)} – ${fmt(p.targetHigh)}` },
    { label: "Strategy", fn: p => p.recommendedStrategy },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-base">Side-by-Side Comparison</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto -mx-6 px-6">
        <div className="min-w-[700px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40 sticky left-0 bg-card z-10">Metric</TableHead>
                {properties.map((property) => (
                  <TableHead key={property.slug} className="text-center min-w-[160px]">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{property.building}</p>
                      <p className="font-medium text-sm">{property.address.split("/")[0].trim()}</p>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow key={metric.label}>
                  <TableCell className="text-sm text-muted-foreground font-medium sticky left-0 bg-card z-10">{metric.label}</TableCell>
                  {properties.map((property) => (
                    <TableCell key={property.slug} className={`text-center font-mono text-sm ${metric.highlight?.(property) ? "text-emerald-400 font-semibold" : ""}`}>
                      {metric.fn(property)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailView({ p, onBack }: { p: Property; onBack: () => void }) {
  const scenario = useScenario(p);
  const { mode, effective, derived, adjustments } = scenario;
  const priceSqm = effective.internalSqm > 0 ? Math.round(effective.price / effective.internalSqm) : 0;
  const projections = projectFiveYears(p, adjustments);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="text-muted-foreground">&larr; Back to all properties</Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 relative rounded-xl overflow-hidden aspect-[16/9] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.heroImage} alt={p.address} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <div className="min-w-0">
                <p className="text-white/60 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-0.5">{p.building} by {p.architect}</p>
                <h1 className="text-white text-lg sm:text-2xl font-semibold leading-tight">{p.address}</h1>
                <p className="text-white/70 text-xs sm:text-sm">{p.suburb}</p>
              </div>
              <div className="sm:text-right flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0 flex-shrink-0">
                <p className="text-white font-mono text-lg sm:text-2xl font-bold">{effective.priceDisplay}</p>
                <p className="text-white/60 text-[10px] sm:text-xs font-mono">{priceSqm > 0 ? `${fmt(priceSqm)}/sqm` : "—"}</p>
                {!p.priceVerified && (
                  <p className="text-amber-400 text-[10px] sm:text-xs mt-0.5 bg-amber-400/20 px-1.5 py-0.5 rounded">
                    Unverified — comp estimate
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
              {mode === "adjusted" && (
                <Badge variant="outline" className="text-amber-400 border-amber-400/30">Scenario Mode</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Beds / Bath / Car</p>
                <p className="font-mono text-lg font-semibold">{p.beds} / {p.baths} / {p.cars}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Internal</p>
                <p className="font-mono text-lg font-semibold">{p.internalSqm} sqm</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Floor Level</p>
                <p className="font-mono text-lg font-semibold">Level {p.floor}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Gross Yield</p>
                <p className={`font-mono text-lg font-semibold ${effective.grossYield >= 6 ? "text-amber-400" : ""}`}>{effective.grossYield}%</p>
                <p className="text-xs text-muted-foreground">Net: {effective.netYield}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Current Rent</p>
                <p className="font-mono text-lg font-semibold">${effective.ltrWeekly}/wk</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Cashflow</p>
                <p className={`font-mono text-lg font-semibold ${effective.annualCashflow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {fmt(effective.annualCashflow)}/yr
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {p.features.map((feature) => <Badge key={feature} variant="outline" className="text-xs font-normal">{feature}</Badge>)}
      </div>

      <ScenarioBar
        mode={scenario.mode}
        setMode={scenario.setMode}
        adjustments={scenario.adjustments}
        updateField={scenario.updateField}
        savedScenarios={scenario.savedScenarios}
        saveCurrentScenario={scenario.saveCurrentScenario}
        loadScenario={scenario.loadScenario}
        deleteScenario={scenario.deleteScenario}
        resetToDefaults={scenario.resetToDefaults}
      />

      {mode === "adjusted" && (
        <ScenarioEditor
          adjustments={adjustments}
          updateField={scenario.updateField}
          baseProperty={p}
        />
      )}

      <Separator className="opacity-30" />

      <Tabs defaultValue="costs" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="bg-card border border-border/50 w-max sm:w-auto">
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="rental">Rental</TabsTrigger>
            <TabsTrigger value="comps">Comps</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="projection">5yr Projection</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="tax">Tax Impact</TabsTrigger>
            <TabsTrigger value="negotiation">Negotiate</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="costs">
          <CostsTab p={effective} derived={mode === "adjusted" ? derived : undefined} />
          <div className="mt-6">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Cost Breakdown</CardTitle></CardHeader>
              <CardContent>
                <AcquisitionDonut
                  stampDuty={effective.stampDuty}
                  conveyancing={derived.conveyancing}
                  legalFees={derived.legalFees}
                  buildingInspection={derived.buildingInspection}
                  pestInspection={derived.pestInspection}
                  strataReport={derived.strataReport}
                  titleSearch={derived.titleSearch}
                  mortgageRegistration={derived.mortgageRegistration}
                  transferRegistration={derived.transferRegistration}
                  loanApplicationFee={derived.loanApplicationFee}
                  depreciationSchedule={derived.depreciationSchedule}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rental">
          <RentalTab p={effective} />
          <div className="mt-6">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Yield Comparison</CardTitle></CardHeader>
              <CardContent>
                <RentalBar
                  ltrGrossYield={effective.ltrGrossYield}
                  ltrNetYield={effective.ltrNetYield}
                  strGrossYield={effective.strGrossYield}
                  strNetYield={effective.strNetYield}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comps">
          <CompsTab p={effective} />
          {p.comparables.filter((comp) => comp.sqm > 0).length >= 2 && (
            <div className="mt-6">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base">Price vs Size</CardTitle></CardHeader>
                <CardContent>
                  <CompsScatter
                    subject={{ sqm: p.internalSqm, price: p.price, label: p.address.replace(" / ", "/") }}
                    comps={p.comparables.filter((comp) => comp.sqm > 0).map((comp) => ({
                      sqm: comp.sqm,
                      price: comp.price,
                      label: comp.address,
                      similarity: comp.similarity,
                    }))}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="investment">
          <InvestmentTab p={effective} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Cashflow Breakdown</CardTitle></CardHeader>
              <CardContent>
                <CashflowWaterfall
                  netRental={effective.ltrAnnual * 0.965}
                  annualInterest={effective.annualInterest}
                  annualHolding={effective.annualHolding}
                  annualCashflow={effective.annualCashflow}
                />
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Market Position</CardTitle></CardHeader>
              <CardContent>
                <MarketPosition
                  suburbMedian={p.suburbMedian}
                  propertyPrice={p.price}
                  propertyLabel={p.building}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projection">
          <ProjectionTab property={p} adjustments={adjustments} mode={mode} />
          <div className="mt-6">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Equity & Cashflow Projection</CardTitle></CardHeader>
              <CardContent>
                <ProjectionLine
                  projections={projections.map((year) => ({
                    year: year.year,
                    equity: year.equity,
                    cumulativeCashflow: year.cumulativeCashflow,
                    propertyValue: year.propertyValue,
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <CalculatorTab property={effective} />
        </TabsContent>

        <TabsContent value="tax">
          <TaxTab property={effective} derived={derived} />
        </TabsContent>

        <TabsContent value="negotiation">
          <NegotiationTab p={p} />
        </TabsContent>
      </Tabs>

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

interface PropscoutDashboardClientProps {
  properties: Property[];
}

export function PropscoutDashboardClient({ properties }: PropscoutDashboardClientProps) {
  const [view, setView] = useState<"list" | "detail" | "compare">("list");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedProperty = properties.find((property) => property.slug === selectedSlug);

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
              {properties.map((property) => (
                <PropertyCard key={property.slug} p={property} onClick={() => { setSelectedSlug(property.slug); setView("detail"); }} />
              ))}
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Quick Comparison</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setView("compare")}>Full comparison &rarr;</Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto -mx-6 px-6">
                <div className="min-w-[640px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-card z-10">Property</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Yield</TableHead>
                        <TableHead className="text-right">Cashflow</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">Cash Req.</TableHead>
                        <TableHead className="text-center">Rec</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.slug} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedSlug(property.slug); setView("detail"); }}>
                          <TableCell className="sticky left-0 bg-card z-10">
                            <div>
                              <p className="font-medium text-sm">{property.address.split("/")[0].trim()}/{property.address.split("/")[1]?.split(",")[0]?.trim()}</p>
                              <p className="text-xs text-muted-foreground">{property.building} &middot; {property.beds}b{property.baths}b{property.cars}c</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">{property.priceDisplay}</TableCell>
                          <TableCell className="text-right"><span className={`font-mono font-semibold ${scoreColor(property.score)}`}>{property.score}</span></TableCell>
                          <TableCell className="text-right font-mono text-sm">{property.grossYield}%</TableCell>
                          <TableCell className={`text-right font-mono text-sm ${property.annualCashflow >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(property.annualCashflow)}</TableCell>
                          <TableCell className="text-right font-mono text-sm hidden sm:table-cell">{fmt(property.totalCashRequired)}</TableCell>
                          <TableCell className="text-center"><Badge variant={recVariant(property.recommendation)} className="text-xs">{property.recommendation}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {view === "detail" && selectedProperty && (
          <DetailView key={selectedProperty.slug} p={selectedProperty} onBack={() => { setView("list"); setSelectedSlug(null); }} />
        )}

        {view === "compare" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Property Comparison</h2>
              <Button variant="ghost" size="sm" onClick={() => setView("list")}>&larr; Back to list</Button>
            </div>
            <ComparisonView properties={properties} />
          </div>
        )}

        <footer className="text-center py-8 text-xs text-muted-foreground/50 mt-8">
          <p>PropScout &mdash; Investment Property Assessment Platform</p>
          <p className="mt-1">Data source: Supabase + Domain API. Seed fallback remains active while ingestion is being wired.</p>
        </footer>
      </main>
    </div>
  );
}
