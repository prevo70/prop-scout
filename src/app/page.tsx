import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Data ────────────────────────────────────────────────────────────────────

const property = {
  address: "3112 / 101 Bathurst Street",
  suburb: "Sydney NSW 2000",
  building: "Lumiere",
  architect: "Foster & Partners",
  price: 1_350_000,
  priceDisplay: "$1,350,000",
  type: "Apartment",
  beds: 1,
  baths: 1,
  cars: 1,
  internalSqm: 63,
  totalSqm: 82,
  floor: 31,
  daysOnMarket: 141,
  medianDays: 73,
  status: "active" as const,
  agent: "Emma Vadas",
  agency: "Ayre Real Estate",
  agentPhone: "0410 342 148",
  currentRentWeekly: 1_050,
  leaseEnd: "Sep 2026",
  strataQtr: 1_830,
  councilQtr: 335,
  waterQtr: 209,
  domainEstimateLow: 1_120_000,
  domainEstimateMid: 1_300_000,
  domainEstimateHigh: 1_480_000,
  heroImage: "/hero.webp",
  features: [
    "Air Conditioning",
    "Built-in Robes",
    "Dishwasher",
    "Gym",
    "Pool",
    "Concierge",
    "Secure Parking",
    "Study Nook",
    "50m Pool & Spa",
    "Theatrettes",
  ],
};

const acquisition = {
  stampDuty: 57_305,
  conveyancing: 2_000,
  legalFees: 2_500,
  buildingInspection: 700,
  pestInspection: 400,
  strataReport: 300,
  titleSearch: 350,
  mortgageReg: 154.2,
  transferReg: 154.2,
  loanAppFee: 600,
  depreciation: 750,
  totalAcquisition: 65_213,
  effectivePrice: 1_415_213,
  deposit: 270_000,
  loanAmount: 1_080_000,
  lvr: 80,
  totalCashRequired: 335_213,
};

const rental = {
  ltrWeekly: 1_050,
  ltrAnnual: 54_600,
  ltrVacancy: 3.5,
  ltrNetRental: 52_689,
  ltrGrossYield: 4.04,
  ltrNetYield: 2.71,
  strNightly: 280,
  strOccupancy: 65,
  strAnnualRevenue: 66_430,
  strNetRevenue: 43_000,
  strGrossYield: 4.92,
  strNetYield: 3.19,
  recommendedStrategy: "Long-Term Rental",
};

const investment = {
  score: 42,
  recommendation: "HOLD",
  riskRating: "MEDIUM",
  grossYield: 4.04,
  netYield: 2.71,
  capRate: 2.71,
  cashOnCash: -8.69,
  annualCashflow: -29_328,
  annualHolding: 15_937,
  annualInterest: 65_880,
  interestRate: 6.1,
  fiveYearCagr: 4.0,
  fiveYearEquity: 562_572,
  suburbMedian: 770_000,
  priceToMedian: 1.753,
};

const comparables = [
  {
    address: "3106/101 Bathurst St",
    price: 1_320_000,
    date: "2 Mar 2026",
    sqm: 75,
    priceSqm: 17_600,
    beds: 1,
    baths: 1,
    cars: 1,
    similarity: 92,
  },
  {
    address: "1709/117 Bathurst St",
    price: 1_020_000,
    date: "27 Mar 2026",
    sqm: 68,
    priceSqm: 15_000,
    beds: 1,
    baths: 1,
    cars: 0,
    similarity: 75,
  },
  {
    address: "3111/117 Bathurst St",
    price: 1_050_000,
    date: "20 Feb 2026",
    sqm: 68,
    priceSqm: 15_441,
    beds: 1,
    baths: 1,
    cars: 0,
    similarity: 72,
  },
  {
    address: "2804/1-5 Hosking Pl",
    price: 750_000,
    date: "15 Mar 2026",
    sqm: 0,
    priceSqm: 0,
    beds: 1,
    baths: 1,
    cars: 0,
    similarity: 45,
  },
];

const negotiation = {
  targetLow: 1_250_000,
  targetHigh: 1_300_000,
  openingOffer: 1_200_000,
  walkAway: 1_300_000,
  leveragePoints: [
    {
      title: "141 Days on Market",
      detail:
        "Nearly double the 73-day suburb median. Vendor holding costs mount at ~$6,500/month.",
    },
    {
      title: "Domain Estimate: $1.3m",
      detail:
        "Asking price is $50k above independent automated valuation. Range: $1.12m\u2013$1.48m.",
    },
    {
      title: "Comp 3106 Sold for Less",
      detail:
        "Same building, 1-bed, but 75sqm (12sqm larger) sold for $1,320,000. Our 63sqm is overpriced at $21,429/sqm vs $17,600/sqm.",
    },
    {
      title: "Negative Cashflow",
      detail:
        'At asking price: -$29,328/yr. Frame to agent: "The numbers don\'t work at this price for any investor."',
    },
    {
      title: "Agent Has Multiple Listings",
      detail:
        "Emma Vadas has 3+ Lumiere units active. A sold sticker helps move the rest.",
    },
    {
      title: "Lease Limits Buyer Pool",
      detail:
        "Lease until Sep 2026 restricts to investor buyers only \u2014 reduces competition and should be reflected in price.",
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtFull(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(n);
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-blue-400";
  if (score >= 40) return "text-amber-400";
  if (score >= 20) return "text-orange-400";
  return "text-red-400";
}

function recBadgeVariant(
  rec: string
): "default" | "secondary" | "destructive" | "outline" {
  if (rec === "STRONG BUY" || rec === "BUY") return "default";
  if (rec === "HOLD") return "secondary";
  return "destructive";
}

// ─── Components ──────────────────────────────────────────────────────────────

function MetricBlock({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`font-mono text-lg font-semibold ${accent ? "text-amber-400" : "text-foreground"}`}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs text-muted-foreground">{sub}</p>
      )}
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

function ScoreGauge({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            className="text-muted/30"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            className={scoreColor(score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 327} 327`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-3xl font-bold ${scoreColor(score)}`}>
            {score}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PropertyPage() {
  const subjectPriceSqm = Math.round(property.price / property.internalSqm);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-amber-400/20 flex items-center justify-center">
              <span className="text-amber-400 text-xs font-bold">PS</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">
              PropScout
            </span>
            <span className="text-muted-foreground text-xs hidden sm:inline">
              / Investment Analysis
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={recBadgeVariant(investment.recommendation)}>
              {investment.recommendation}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Score: {investment.score}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 relative rounded-xl overflow-hidden aspect-[16/9] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={property.heroImage}
              alt={`${property.address}, ${property.suburb}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">
                    {property.building} by {property.architect}
                  </p>
                  <h1 className="text-white text-2xl font-semibold">
                    {property.address}
                  </h1>
                  <p className="text-white/70 text-sm">{property.suburb}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono text-2xl font-bold">
                    {property.priceDisplay}
                  </p>
                  <p className="text-white/60 text-xs font-mono">
                    {fmt(subjectPriceSqm)}/sqm
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/50">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <ScoreGauge score={investment.score} />
                <Badge
                  variant={recBadgeVariant(investment.recommendation)}
                  className="text-base px-4 py-1"
                >
                  {investment.recommendation}
                </Badge>
                <p className="text-xs text-muted-foreground text-center">
                  Risk: {investment.riskRating}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6 grid grid-cols-2 gap-4">
                <MetricBlock
                  label="Beds / Bath / Car"
                  value={`${property.beds} / ${property.baths} / ${property.cars}`}
                />
                <MetricBlock
                  label="Internal"
                  value={`${property.internalSqm} sqm`}
                  sub={`${property.totalSqm} sqm total`}
                />
                <MetricBlock
                  label="Floor Level"
                  value={`Level ${property.floor}`}
                />
                <MetricBlock
                  label="Days on Market"
                  value={`${property.daysOnMarket}`}
                  sub={`Median: ${property.medianDays}`}
                  accent
                />
                <MetricBlock
                  label="Current Rent"
                  value={`$${property.currentRentWeekly}/wk`}
                  sub={`Until ${property.leaseEnd}`}
                />
                <MetricBlock
                  label="Gross Yield"
                  value={`${investment.grossYield}%`}
                  sub={`Net: ${investment.netYield}%`}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {property.features.map((f) => (
            <Badge key={f} variant="outline" className="text-xs font-normal">
              {f}
            </Badge>
          ))}
        </div>

        <Separator className="opacity-30" />

        {/* Tabs */}
        <Tabs defaultValue="costs" className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="costs">Acquisition Costs</TabsTrigger>
            <TabsTrigger value="rental">Rental Analysis</TabsTrigger>
            <TabsTrigger value="comps">Comparables</TabsTrigger>
            <TabsTrigger value="investment">Investment Model</TabsTrigger>
            <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
          </TabsList>

          {/* Costs Tab */}
          <TabsContent value="costs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Acquisition Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <CostRow label="Stamp Duty (NSW Investor)" amount={acquisition.stampDuty} />
                  <CostRow label="Conveyancing" amount={acquisition.conveyancing} />
                  <CostRow label="Legal Fees" amount={acquisition.legalFees} />
                  <CostRow label="Building Inspection" amount={acquisition.buildingInspection} />
                  <CostRow label="Pest Inspection" amount={acquisition.pestInspection} />
                  <CostRow label="Strata Report" amount={acquisition.strataReport} />
                  <CostRow label="Title Search" amount={acquisition.titleSearch} />
                  <CostRow label="Mortgage Registration" amount={acquisition.mortgageReg} />
                  <CostRow label="Transfer Registration" amount={acquisition.transferReg} />
                  <CostRow label="Loan Application Fee" amount={acquisition.loanAppFee} />
                  <CostRow label="Depreciation Schedule" amount={acquisition.depreciation} />
                  <Separator className="my-2 opacity-30" />
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-semibold">Total Acquisition Costs</span>
                    <span className="font-mono text-sm font-semibold text-amber-400">
                      {fmt(acquisition.totalAcquisition)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="border-border/50">
                  <CardHeader><CardTitle className="text-base">Loan Structure</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <MetricBlock label="Purchase Price" value={fmt(property.price)} />
                    <MetricBlock label="Deposit (20%)" value={fmt(acquisition.deposit)} />
                    <MetricBlock label="Loan Amount" value={fmt(acquisition.loanAmount)} />
                    <MetricBlock label="LVR" value={`${acquisition.lvr}%`} sub="No LMI required" />
                    <Separator className="opacity-30" />
                    <MetricBlock label="Total Cash Required" value={fmt(acquisition.totalCashRequired)} sub="Deposit + all acquisition costs" accent />
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardHeader><CardTitle className="text-base">Holding Costs (Annual)</CardTitle></CardHeader>
                  <CardContent>
                    <CostRow label="Strata" amount={property.strataQtr * 4} />
                    <CostRow label="Council Rates" amount={property.councilQtr * 4} />
                    <CostRow label="Water Rates" amount={property.waterQtr * 4} />
                    <CostRow label="Landlord Insurance" amount={1_800} />
                    <CostRow label="Property Management (8.5%)" amount={4_641} />
                    <Separator className="my-2 opacity-30" />
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="font-mono text-sm font-semibold text-amber-400">{fmt(investment.annualHolding)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Rental Tab */}
          <TabsContent value="rental">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Long-Term Rental</CardTitle>
                    <Badge>Recommended</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricBlock label="Weekly Rent" value={`$${rental.ltrWeekly}/wk`} sub="Actual lease in place" />
                    <MetricBlock label="Annual Rent" value={fmt(rental.ltrAnnual)} />
                    <MetricBlock label="Vacancy Rate" value={`${rental.ltrVacancy}%`} sub="Sydney CBD default" />
                    <MetricBlock label="Net Rental" value={fmt(rental.ltrNetRental)} />
                  </div>
                  <Separator className="opacity-30" />
                  <div className="grid grid-cols-2 gap-4">
                    <MetricBlock label="Gross Yield" value={`${rental.ltrGrossYield}%`} accent />
                    <MetricBlock label="Net Yield" value={`${rental.ltrNetYield}%`} accent />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      LTR is the recommended strategy. The $1,050/week lease (until Sep 2026)
                      is well above the suburb 1-bed median of ~$636/week. Net yield outperforms
                      STR once management and cleaning costs are factored in.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Short-Term Rental (Airbnb)</CardTitle>
                    <Badge variant="outline">Alternative</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricBlock label="Nightly Rate" value={`$${rental.strNightly}/night`} sub="Premium CBD estimate" />
                    <MetricBlock label="Occupancy" value={`${rental.strOccupancy}%`} sub="~237 nights/year" />
                    <MetricBlock label="Gross Revenue" value={fmt(rental.strAnnualRevenue)} />
                    <MetricBlock label="Net Revenue" value={fmt(rental.strNetRevenue)} sub="After fees + cleaning" />
                  </div>
                  <Separator className="opacity-30" />
                  <div className="grid grid-cols-2 gap-4">
                    <MetricBlock label="Gross Yield" value={`${rental.strGrossYield}%`} />
                    <MetricBlock label="Net Yield" value={`${rental.strNetYield}%`} />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      STR costs: 3% Airbnb fee + 18% management + ~$9,480 cleaning/yr. Sydney CBD
                      median occupancy is only 50% (AirROI 2026). Regulatory risk (NSW STR
                      registration) and hassle factor favour LTR.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparables Tab */}
          <TabsContent value="comps">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Comparable Sales &mdash; Sydney CBD 2000</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Sqm</TableHead>
                      <TableHead className="text-right">$/sqm</TableHead>
                      <TableHead className="text-center">Bed/Bath/Car</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                      <TableHead className="text-right">Similarity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-amber-400/5 border-amber-400/20">
                      <TableCell className="font-medium">
                        3112/101 Bathurst St
                        <span className="ml-2 text-xs text-amber-400">(Subject)</span>
                      </TableCell>
                      <TableCell className="text-right font-mono">{fmt(property.price)}</TableCell>
                      <TableCell className="text-right font-mono">{property.internalSqm}</TableCell>
                      <TableCell className="text-right font-mono text-amber-400">{fmt(subjectPriceSqm)}</TableCell>
                      <TableCell className="text-center">{property.beds}/{property.baths}/{property.cars}</TableCell>
                      <TableCell className="text-right text-muted-foreground">Listed</TableCell>
                      <TableCell className="text-right">&mdash;</TableCell>
                    </TableRow>
                    {comparables.map((c) => (
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
                            <span className="font-mono text-xs w-8 text-right">{c.similarity}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The subject property at <span className="font-mono text-amber-400">{fmt(subjectPriceSqm)}/sqm</span> trades
                    at a <strong>22% premium</strong> to the most comparable sale (3106, same building) at $17,600/sqm.
                    Fair value for a 1-bed with parking in Lumiere: <strong>$1,250,000&ndash;$1,300,000</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Model Tab */}
          <TabsContent value="investment">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base">Annual Cashflow</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-1.5">
                    <span className="text-sm text-emerald-400">+ Net Rental Income</span>
                    <span className="font-mono text-sm text-emerald-400">{fmt(rental.ltrNetRental)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-sm text-red-400">- Interest ({investment.interestRate}%)</span>
                    <span className="font-mono text-sm text-red-400">({fmt(investment.annualInterest)})</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-sm text-red-400">- Holding Costs</span>
                    <span className="font-mono text-sm text-red-400">({fmt(investment.annualHolding)})</span>
                  </div>
                  <Separator className="opacity-30" />
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Net Cashflow</span>
                    <span className="font-mono font-bold text-red-400">{fmt(investment.annualCashflow)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Negatively geared. Tax benefit at 37% marginal rate: ~{fmt(Math.abs(investment.annualCashflow) * 0.37)}/yr.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base">Yield Metrics</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <MetricBlock label="Gross Yield" value={`${investment.grossYield}%`} sub="Annual rent / price" />
                  <MetricBlock label="Net Yield" value={`${investment.netYield}%`} sub="After all holding costs" />
                  <MetricBlock label="Cap Rate" value={`${investment.capRate}%`} sub="NOI / price" />
                  <MetricBlock label="Cash-on-Cash Return" value={`${investment.cashOnCash}%`} sub="Net cashflow / cash invested" accent />
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base">5-Year Projection</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <MetricBlock label="Capital Growth (CAGR)" value={`${investment.fiveYearCagr}%`} sub="Sydney CBD historical" />
                  <MetricBlock label="Projected Value (5yr)" value={fmt(Math.round(property.price * Math.pow(1.04, 5)))} />
                  <MetricBlock label="Projected Equity" value={fmt(investment.fiveYearEquity)} sub={`Loan: ${fmt(acquisition.loanAmount)}`} accent />
                  <Separator className="opacity-30" />
                  <MetricBlock label="Price to Suburb Median" value={`${investment.priceToMedian}x`} sub={`Median 1-bed: ${fmt(investment.suburbMedian)}`} />
                </CardContent>
              </Card>
            </div>
            <Card className="border-border/50 mt-6">
              <CardHeader><CardTitle className="text-base">Score Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: "Net Yield vs Median", weight: 25, score: 50 },
                    { label: "Capital Growth", weight: 20, score: 60 },
                    { label: "Price vs Comparables", weight: 20, score: 35 },
                    { label: "Cashflow Position", weight: 15, score: 20 },
                    { label: "Days on Market", weight: 10, score: 30 },
                    { label: "STR Yield Premium", weight: 10, score: 45 },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{item.label} <span className="text-muted-foreground/50">({item.weight}%)</span></span>
                        <span className={`font-mono ${scoreColor(item.score)}`}>{item.score}</span>
                      </div>
                      <Progress value={item.score} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Negotiation Tab */}
          <TabsContent value="negotiation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 border-amber-400/30 bg-amber-400/5">
                <CardHeader><CardTitle className="text-base text-amber-400">Target Range</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <MetricBlock label="Opening Offer" value={fmt(negotiation.openingOffer)} sub="11% below asking" accent />
                  <MetricBlock label="Target Range" value={`${fmt(negotiation.targetLow)} \u2013 ${fmt(negotiation.targetHigh)}`} sub="7\u201311% below asking" />
                  <MetricBlock label="Walk-Away Price" value={fmt(negotiation.walkAway)} sub="Maximum. Do not exceed." />
                  <Separator className="opacity-30" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">At $1.3m</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Gross yield lifts to <span className="text-foreground font-mono">4.2%</span></p>
                      <p>Cashflow improves by <span className="text-emerald-400 font-mono">$3,250/yr</span></p>
                      <p>Price/sqm drops to <span className="text-foreground font-mono">$20,635</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2 border-border/50">
                <CardHeader><CardTitle className="text-base">Leverage Points</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {negotiation.leveragePoints.map((point, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-mono font-bold text-muted-foreground">{i + 1}</span>
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium">{point.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{point.detail}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card className="border-border/50 mt-6">
              <CardHeader><CardTitle className="text-base">Negotiation Playbook</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { phase: "1", title: "Opening", color: "blue", text: `Written offer at ${fmt(1_200_000)} with 48hr expiry. Attach Domain valuation + comparable sales evidence + cashflow spreadsheet showing negative gearing at asking price.` },
                    { phase: "2", title: "Counter", color: "amber", text: "If vendor counters above $1.3m: hold firm at $1.25m. If counter is $1.28\u2013$1.30m: move to $1.27m. Reference 3106 selling for $1.32m with 12sqm more space." },
                    { phase: "3", title: "Final Position", color: "emerald", text: `Maximum ${fmt(1_300_000)} with 60-day settlement. Preferred: $1.275m with 42-day. Include clauses: subject to B&P inspection, finance approval.` },
                  ].map((p) => (
                    <div key={p.phase} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded bg-${p.color}-500/20 flex items-center justify-center`}>
                          <span className={`text-${p.color}-400 text-xs font-bold`}>{p.phase}</span>
                        </div>
                        <h4 className="text-sm font-semibold">{p.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>
                3112/101 Bathurst Street is a 63sqm one-bedroom apartment on level 31 of
                Lumiere, a landmark Foster &amp; Partners tower in Sydney CBD. Listed at{" "}
                {property.priceDisplay}, it sits above Domain&apos;s mid-point estimate of $1.3m
                and carries a significant premium to the suburb&apos;s 1-bed median of $770k.
              </p>
              <p>
                The property is currently leased at $1,050/week until September 2026,
                delivering a 4.04% gross yield. Net of all holding costs, the net yield
                drops to 2.71%.
              </p>
              <p>
                At 80% LVR and a 6.10% interest rate, annual cashflow is negative by
                approximately $29,100 &mdash; making this a negative-gearing play reliant on
                capital growth. Sydney CBD units have delivered ~4% annual growth over 5
                years historically, building equity to ~$562k by year 5.
              </p>
              <p className="text-foreground font-medium">
                VERDICT: Hold. Quality building and strong tenant, but the entry price is
                stretched. Consider offering $1.25&ndash;1.30m to improve yield and align with
                Domain&apos;s value estimate.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-muted-foreground/50">
          <p>PropScout &mdash; Investment Property Assessment Platform</p>
          <p className="mt-1">Data sourced from Domain, REA, AirROI. Analysis as at 29 Mar 2026.</p>
          <p className="mt-1">PDConsults / Decidr</p>
        </footer>
      </main>
    </div>
  );
}
