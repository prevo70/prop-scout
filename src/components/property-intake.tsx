"use client";

import { useState } from "react";
import type { Property } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type IntakeState = "idle" | "scraping" | "review" | "done";

interface PropertyIntakeProps {
  onAdd: (property: Property) => void;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
}

export function PropertyIntake({ onAdd }: PropertyIntakeProps) {
  const [state, setState] = useState<IntakeState>("idle");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Property | null>(null);

  async function handleScrape() {
    if (!url.trim()) return;
    setError("");
    setState("scraping");

    try {
      const res = await fetch("/api/properties/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to scrape property");
        setState("idle");
        return;
      }

      setDraft(data.property as Property);
      setState("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setState("idle");
    }
  }

  function handleAdd() {
    if (!draft) return;
    onAdd(draft);
    setState("done");
    setTimeout(() => {
      setState("idle");
      setUrl("");
      setDraft(null);
    }, 2000);
  }

  function updateDraft(field: string, value: string | number) {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  }

  return (
    <Card className="border-border/50 border-dashed">
      <CardContent className="pt-4">
        {/* Idle: URL input */}
        {state === "idle" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Paste any property listing URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                className="font-mono text-sm"
              />
              <Button onClick={handleScrape} disabled={!url.trim()} className="shrink-0">
                Scout Property
              </Button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        )}

        {/* Scraping: Loading */}
        {state === "scraping" && (
          <div className="flex items-center gap-3 py-2">
            <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Analysing listing...</p>
            <p className="text-xs text-muted-foreground/50 font-mono truncate flex-1">{url}</p>
          </div>
        )}

        {/* Review: Editable extracted data */}
        {state === "review" && draft && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-amber-400 border-amber-400/30">Review</Badge>
                <p className="text-sm font-medium">Confirm property details</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setState("idle"); setDraft(null); }}>
                Cancel
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-[10px] text-muted-foreground">Address</Label>
                <Input value={draft.address} onChange={(e) => updateDraft("address", e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Suburb</Label>
                <Input value={draft.suburb} onChange={(e) => updateDraft("suburb", e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Building</Label>
                <Input value={draft.building} onChange={(e) => updateDraft("building", e.target.value)} className="text-sm" />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Price</Label>
                <Input type="number" value={draft.price || ""} onChange={(e) => updateDraft("price", Number(e.target.value))} className="font-mono text-sm" placeholder="Contact Agent" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Beds</Label>
                <Input type="number" value={draft.beds} onChange={(e) => updateDraft("beds", Number(e.target.value))} className="font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Baths</Label>
                <Input type="number" value={draft.baths} onChange={(e) => updateDraft("baths", Number(e.target.value))} className="font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Cars</Label>
                <Input type="number" value={draft.cars} onChange={(e) => updateDraft("cars", Number(e.target.value))} className="font-mono text-sm" />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Internal sqm</Label>
                <Input type="number" value={draft.internalSqm} onChange={(e) => updateDraft("internalSqm", Number(e.target.value))} className="font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Floor</Label>
                <Input type="number" value={draft.floor} onChange={(e) => updateDraft("floor", Number(e.target.value))} className="font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Rent $/wk</Label>
                <Input type="number" value={draft.currentRentWeekly || ""} onChange={(e) => updateDraft("currentRentWeekly", Number(e.target.value))} className="font-mono text-sm" placeholder="0" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Agent</Label>
                <Input value={draft.agent} onChange={(e) => updateDraft("agent", e.target.value)} className="text-sm" />
              </div>
            </div>

            {/* Quick summary */}
            <Separator className="opacity-30" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{draft.beds}b {draft.baths}b {draft.cars}c</span>
                <span>{draft.internalSqm}sqm</span>
                {draft.price > 0 && <span>Stamp duty: {fmt(draft.stampDuty)}</span>}
                {!draft.priceVerified && <Badge variant="outline" className="text-amber-400 border-amber-400/30 text-[10px]">Price unverified</Badge>}
              </div>
              <Button onClick={handleAdd}>
                Add to PropScout
              </Button>
            </div>
          </div>
        )}

        {/* Done */}
        {state === "done" && (
          <div className="flex items-center gap-2 py-2">
            <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <span className="text-emerald-400 text-[10px]">✓</span>
            </div>
            <p className="text-sm text-emerald-400">Property added to PropScout</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
