"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NegotiationEmailProps {
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
  openingOffer: number;
  targetLow: number;
  targetHigh: number;
  leveragePoints: { title: string; detail: string }[];
  comparables: { address: string; price: number; date: string; sqm: number }[];
  grossYield: number;
  annualCashflow: number;
}

type Tone = "professional" | "friendly" | "direct";

function fmt(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency", currency: "AUD", maximumFractionDigits: 0,
  }).format(n);
}

function generateEmail(p: NegotiationEmailProps, tone: Tone): { subject: string; body: string } {
  const subject = `Offer — ${p.address}`;
  const compsBlock = p.comparables.length > 0
    ? p.comparables.slice(0, 3).map(c => `  - ${c.address}: ${fmt(c.price)} (${c.date})`).join("\n")
    : null;

  if (tone === "professional") {
    return {
      subject,
      body: `Dear ${p.agent},

Thank you for your time regarding ${p.address}${p.building ? ` (${p.building})` : ""}. We have completed our due diligence and would like to present a formal offer.

OFFER: ${fmt(p.openingOffer)}

This offer reflects our analysis of current market conditions:

${p.daysOnMarket > 0 ? `• The property has been listed for ${p.daysOnMarket} days, compared to a suburb median of approximately 73 days.\n` : ""}${compsBlock ? `• Recent comparable sales in the area:\n${compsBlock}\n` : ""}${p.grossYield > 0 ? `• At the current asking price of ${p.priceDisplay}, the gross yield is ${p.grossYield}%${p.annualCashflow !== 0 ? ` with annual cashflow of ${fmt(p.annualCashflow)}` : ""}.\n` : ""}
We are pre-approved and ready to proceed with a 42-day settlement. This offer is subject to satisfactory building and pest inspection and finance approval.

We are genuinely interested in the property and look forward to your response. We are open to discussing terms that work for both parties.

Kind regards,
[Your name]
[Your phone]`,
    };
  }

  if (tone === "friendly") {
    return {
      subject,
      body: `Hi ${p.agent},

Thanks for showing us ${p.address}${p.building ? ` in the ${p.building}` : ""} — we really liked the place and can see it working well for us.

We have done our homework and would love to put forward an offer of ${fmt(p.openingOffer)}. We know the asking is ${p.priceDisplay}, but based on what similar places have sold for recently${compsBlock ? ` (${p.comparables.slice(0, 2).map(c => `${fmt(c.price)}`).join(", ")})` : ""}, we feel this is a fair starting point.

${p.daysOnMarket > 60 ? `We also noticed it has been on the market for a little while now — we are serious buyers and happy to move quickly.\n\n` : ""}Happy to chat through the details. We are flexible on settlement timing and ready to move when the time is right.

Cheers,
[Your name]
[Your phone]`,
    };
  }

  // Direct tone
  return {
    subject,
    body: `${p.agent},

Offer for ${p.address}: ${fmt(p.openingOffer)}

Supporting data:
${p.daysOnMarket > 0 ? `- ${p.daysOnMarket} days on market (median: 73)\n` : ""}${compsBlock ? `${p.comparables.slice(0, 3).map(c => `- ${c.address} — ${fmt(c.price)} (${c.date})`).join("\n")}\n` : ""}${p.grossYield > 0 ? `- Gross yield at asking: ${p.grossYield}%\n` : ""}${p.annualCashflow !== 0 ? `- Cashflow: ${fmt(p.annualCashflow)}/yr\n` : ""}
Settlement: 42 days. Subject to B&P + finance.

Regards,
[Your name]`,
  };
}

export function NegotiationEmail(props: NegotiationEmailProps) {
  const [tone, setTone] = useState<Tone>("professional");
  const [copied, setCopied] = useState(false);

  const { subject, body } = generateEmail(props, tone);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = body;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Draft Email to Agent</CardTitle>
          <div className="flex items-center gap-1">
            {(["professional", "friendly", "direct"] as const).map(t => (
              <Button
                key={t}
                variant={tone === t ? "secondary" : "ghost"}
                size="sm"
                className="text-xs capitalize"
                onClick={() => setTone(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email header */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-16 shrink-0">To:</span>
            <span>{props.agent}{props.agency ? `, ${props.agency}` : ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-16 shrink-0">Subject:</span>
            <span className="font-medium">{subject}</span>
          </div>
        </div>

        {/* Email body preview */}
        <div className="bg-white/95 text-gray-900 rounded-lg p-5 font-[system-ui] text-sm leading-relaxed whitespace-pre-wrap">
          {body}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">{tone}</Badge>
            {props.openingOffer > 0 && (
              <span className="text-xs text-muted-foreground">
                Offer: {fmt(props.openingOffer)} ({Math.round((1 - props.openingOffer / props.price) * 100)}% below asking)
              </span>
            )}
          </div>
          <Button onClick={handleCopy} variant={copied ? "default" : "secondary"} size="sm">
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
