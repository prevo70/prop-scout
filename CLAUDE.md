@AGENTS.md

# PropScout — Investment Property Assessment Platform

## Project Overview
Sydney CBD property investment analysis tool. Scrapes listings, calculates NSW acquisition costs + stamp duty, models rental yield (LTR + STR), produces scored investment recommendations with negotiation strategies, tax impact analysis, and break-even projections.

## Stack
- **Next.js 16** (App Router, Turbopack)
- **React 19** + TypeScript
- **shadcn/ui** (base-ui variant) + Tailwind CSS 4
- **recharts** for charts (via shadcn chart wrapper)
- **Dark mode** only (class="dark" on html)
- **Vercel** deployment (`pdconsults-projects/frontend`)
- **GitHub**: `prevo70/prop-scout`

## Key Architecture

### Data Flow
```
Static properties (src/lib/data.ts)
    + Scraped properties (via /api/properties/scrape)
    → useState in page.tsx (allProperties)
    → useScenario hook (per-property, in DetailView)
    → DerivedValues from calculations.ts
    → All tab components receive `effective` property
```

### Scenario Engine
- `useScenario(property)` hook manages Model/Adjusted toggle
- `ScenarioAdjustments` type: 25+ overridable fields including purchasePrice
- `recalculate()` cascades changes through stamp duty → acquisition → loan → cashflow → yields
- Scenarios saved to localStorage per property slug

### Property Intake Pipeline
```
User pastes URL → /api/properties/scrape
    → Firecrawl scrapes to markdown
    → Claude Haiku extracts structured data
    → NSW stamp duty + costs calculated
    → Basic investment score computed
    → Property added to client state
```

## File Structure
```
src/
  app/
    page.tsx                    # Main page — list, detail, compare views (client component)
    api/
      properties/scrape/        # POST: URL → Firecrawl → Claude → Property JSON
      costs/                    # POST: standalone cost calculator
    costs/page.tsx              # Standalone cost calculator page
  lib/
    data.ts                     # Property type (82 fields) + 3 static property records
    calculations.ts             # Recalculation engine, 5yr projection, break-even, mortgage
    scenarios.ts                # ScenarioAdjustments type + localStorage CRUD
    constants.ts                # Default values (acquisition, holding, loan, growth)
    tax.ts                      # ATO 2025-26 tax brackets, Medicare, LITO, HELP, negative gearing
    calculators/                # Standalone stamp-duty.ts + acquisition-costs.ts
  hooks/
    use-scenario.ts             # Mode toggle, adjustments, derived values, save/load
  components/
    property-intake.tsx          # URL input → scrape → review → add
    detail/
      shared.tsx                # M, CostRow, ScoreGauge, fmt, fmtFull, scoreColor
      costs-tab.tsx             # Acquisition + holding costs
      rental-tab.tsx            # LTR vs STR comparison
      comps-tab.tsx             # Comparable sales table
      investment-tab.tsx        # Cashflow, yields, 5yr projection
      projection-tab.tsx        # 5yr year-by-year table
      breakeven-tab.tsx         # Break-even / payback model (5-25yr)
      calculator-tab.tsx        # Mortgage calculator with sliders
      tax-tab.tsx               # Australian tax impact + negative gearing
      negotiation-tab.tsx       # Target range + leverage points
    scenario/
      scenario-bar.tsx          # Model/Adjusted toggle + Cash Purchase + save/load
      scenario-editor.tsx       # 25 editable fields in sections
    charts/
      acquisition-donut.tsx     # Horizontal bar chart (was donut, renamed)
      rental-bar.tsx            # LTR vs STR yield bars
      cashflow-waterfall.tsx    # Income/expenses/net waterfall
      comps-scatter.tsx         # Price vs sqm scatter
      projection-line.tsx       # 5yr equity + cashflow lines
      market-position.tsx       # Property vs suburb median
```

## Conventions
- **Currency**: All Airtable values in cents (integer). Frontend displays in dollars.
- **Formatting**: `fmt(n)` for currency no decimals, `fmtFull(n)` for 2 decimals
- **Score colors**: >=80 emerald, >=60 blue, >=40 amber, >=20 orange, <20 red
- **Price verification**: `priceVerified: boolean` + `priceSource: string` on every property
- **Mobile**: overflow-x-auto on tables with min-width, sticky first columns
- **Tabs**: scrollable on mobile via overflow-x-auto wrapper
- **Hero images**: local in public/ (external URLs get hotlink-blocked)
- **Missing images**: gradient placeholder with bed/bath/car config text

## NSW Stamp Duty (2025-26, investor)
Hardcoded in calculations.ts `calculateNswStampDuty()` and api/properties/scrape:
```
$0–$17k: $1.25/100
$17k–$35k: $213 + $1.50/100 over $17k
$35k–$93k: $483 + $1.75/100 over $35k
$93k–$351k: $1,498 + $3.50/100 over $93k
$351k–$1,168k: $10,530 + $4.50/100 over $351k
$1,168k+: $47,295 + $5.50/100 over $1,168k
```

## Tax Calculator (2025-26)
Stage 3 rates in tax.ts: 0% to $18,200 / 16% to $45k / 30% to $135k / 37% to $190k / 45% above.
Medicare levy 2%. LITO up to $700. HELP marginal system from $67k.

## Environment Variables
```
FIRECRAWL_API_KEY    # Firecrawl web scraping (set in Vercel)
ANTHROPIC_API_KEY    # Claude Haiku for extraction (set in Vercel)
```

## AI Orchestration — Manager/Worker Setup

**Claude (Senior Architect)** — complex problem-solving, architectural decisions, cross-file debugging, error log diagnosis, state management bugs, multi-file refactoring. Token-limited (Max plan).

**Gemma 4 E4B (Junior Developer)** — runs locally on M1 Max via Ollama/Continue VSCode. Unlimited tokens, zero cost. Handles: component scaffolding, CSS/SCSS, basic Liquid loops, single-file generation, code comments, framework translations.

**Rules:**
- If asked to do boilerplate/scaffolding/formatting, push back and suggest Gemma
- Assume files created by Gemma may have logic errors (4B param model, limited reasoning)
- Claude handles: multi-file refactoring, complex state, API debugging, architectural decisions
- Gemma handles: repetitive iteration, styling, single components, translations

## Build & Deploy
```bash
npm run build
git add -A && git commit -m "..." && git push origin main
npx vercel --prod --yes
```

## Airtable (data persistence layer — not yet connected to frontend)
- Base: `appDhJHn5m40za57w`
- 7 tables prefixed `PS:` — Properties, Acquisition Costs, Rental Analysis, Comparable Sales, Investment Analysis, Property Professionals, Market Snapshots
- Table IDs in `scripts/table_ids.json`
- PropScout skill at `.claude/skills/prop-scout` handles full research + Airtable writes

## Data Validation Rules
- "Contact Agent" = no price → use comp-based estimate, `priceVerified: false`
- Gross yield >8% in Sydney CBD = likely pricing error
- Positive cashflow in CBD = verify independently
- Every comp needs: address, sold price, sold date, source URL, within 6 months
