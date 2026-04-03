# Gemma Task 001 — Negotiation Email Generator

## Overview
Build a component that takes the negotiation data for a property and formats it as a professional email draft that the user can copy and send to the real estate agent. The email should present the offer with supporting data points (comparables, days on market, valuation evidence) in a persuasive but respectful tone.

## File to Create
`src/components/detail/negotiation-email.tsx`

## Component Spec

```tsx
"use client";

interface NegotiationEmailProps {
  // Property details
  address: string;
  building: string;
  priceDisplay: string;
  price: number;
  beds: number;
  baths: number;
  cars: number;
  internalSqm: number;
  agent: string;
  agency: string;
  daysOnMarket: number;
  
  // Negotiation data
  openingOffer: number;
  targetLow: number;
  targetHigh: number;
  leveragePoints: { title: string; detail: string }[];
  
  // Supporting data
  comparables: { address: string; price: number; date: string; sqm: number }[];
  grossYield: number;
  annualCashflow: number;
}

export function NegotiationEmail(props: NegotiationEmailProps) { ... }
```

## What It Should Render

### Layout
1. **Email preview card** — a Card component showing the formatted email with:
   - To: field (pre-filled with agent name, agency)
   - Subject: field (e.g. "Offer — 3112/101 Bathurst Street, Sydney")
   - Body: the formatted email text
   
2. **Copy button** — copies the email body text to clipboard
3. **Tone selector** — 3 buttons to toggle between email tones:
   - "Professional" (default) — formal, data-driven
   - "Friendly" — warmer, relationship-focused
   - "Direct" — concise, numbers-only

### Email Body Template (Professional tone)

```
Dear [agent],

Thank you for showing us [address]. We've completed our due diligence 
and would like to present a formal offer.

OFFER: [openingOffer formatted as currency]

This offer reflects our analysis of current market conditions:

• The property has been listed for [daysOnMarket] days, compared to 
  a suburb median of 73 days
• Recent comparable sales in the area:
  - [comp.address]: [comp.price] ([comp.date])
  - [comp.address]: [comp.price] ([comp.date])
  - [comp.address]: [comp.price] ([comp.date])
• At the current asking price, the gross yield is [grossYield]% with 
  annual cashflow of [annualCashflow]

We are pre-approved and ready to proceed with a [42/60]-day settlement.
This offer is subject to satisfactory building and pest inspection 
and finance approval.

We look forward to your response.

Kind regards,
[leave blank for user to fill]
```

### Email Body Template (Friendly tone)

```
Hi [agent],

Thanks for your time showing us [address] — we really liked the 
[building] and can see ourselves there.

We've done our homework and would love to put forward an offer of 
[openingOffer]. We know the asking is [priceDisplay], but based on 
what similar places have sold for recently ([comp1 price], [comp2 price]), 
we feel this is a fair starting point.

Happy to chat through the details — we're flexible on settlement 
timing and ready to move quickly.

Cheers,
[leave blank]
```

### Email Body Template (Direct tone)

```
[agent],

Offer for [address]: [openingOffer]

Supporting data:
- [daysOnMarket] days on market (median: 73)
- Comp 1: [address] — [price] ([date])
- Comp 2: [address] — [price] ([date])  
- Gross yield at asking: [grossYield]%
- Cashflow: [annualCashflow]/yr

Settlement: 42 days. Subject to B&P + finance.

Regards,
[leave blank]
```

## Imports to Use

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
```

## Formatting Helper
Currency formatting — use this inline:
```tsx
function fmt(n: number): string {
  return new Intl.NumberFormat("en-AU", { 
    style: "currency", currency: "AUD", maximumFractionDigits: 0 
  }).format(n);
}
```

## Styling Requirements
- Use existing dark mode classes (bg-card, text-foreground, text-muted-foreground, border-border/50)
- Email preview should look like an email — white/light background with dark text would work here since it's a "preview" of what gets sent. Use `bg-white text-gray-900 rounded-lg p-6` for the email body area.
- Tone selector buttons: use `variant="secondary"` for active, `variant="ghost"` for inactive
- Copy button: show "Copied!" text for 2 seconds after clicking, then revert

## State Management
- `useState` for selected tone ("professional" | "friendly" | "direct")
- `useState` for copy feedback (boolean, reset after 2s timeout)
- No external state needed — this is a pure presentational component

## Integration Point
This component will be added to the Negotiation tab (negotiation-tab.tsx) BELOW the existing leverage points card. Claude will handle the integration — Gemma just builds the component.

## Testing Checklist
After building, verify:
- [ ] Component renders without errors
- [ ] All three tones display different email text
- [ ] Currency values are formatted correctly (e.g. $1,200,000 not 1200000)
- [ ] Copy button copies text to clipboard
- [ ] "Copied!" feedback appears and disappears
- [ ] Comparables are listed (handle 0 comps gracefully — hide that section)
- [ ] Agent name appears in greeting
- [ ] Dark mode card with light email preview area looks correct
- [ ] `npm run build` passes with no type errors
