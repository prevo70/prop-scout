import { NextResponse } from "next/server";

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const EXTRACTION_PROMPT = `Extract property listing data from this real estate listing markdown. Return ONLY valid JSON (no markdown fences, no explanation) with these fields:

{
  "address": "full address including unit number",
  "unit": "unit/apartment number only (e.g. '3112')",
  "street": "street address only (e.g. '101 Bathurst Street')",
  "suburb": "suburb name",
  "postcode": "4 digit postcode",
  "state": "state abbreviation (e.g. 'NSW')",
  "price": null,
  "priceDisplay": "display string e.g. '$1,350,000' or 'Contact Agent'",
  "beds": 0,
  "baths": 0,
  "cars": 0,
  "internalSqm": 0,
  "floor": 0,
  "propertyType": "apartment",
  "features": [],
  "agent": "agent name",
  "agency": "agency name",
  "agentPhone": "phone number",
  "buildingName": "building/complex name if mentioned",
  "architect": "architect if mentioned",
  "strataQuarterly": 0,
  "councilQuarterly": 0,
  "waterQuarterly": 0,
  "currentRentWeekly": 0,
  "leaseEnd": "lease end date if mentioned",
  "description": "first 200 chars of listing description"
}

Rules:
- price: extract as a NUMBER (e.g. 1350000). If "Contact Agent", "Expressions of Interest", "Auction", or no price shown, set to null.
- internalSqm: internal/build area only, not land/total area. If only total shown, use that.
- floor: extract floor/level number. If not mentioned, set to 0.
- features: array of short feature strings (max 12)
- strataQuarterly/councilQuarterly/waterQuarterly: extract quarterly amounts as numbers. If annual, divide by 4.
- currentRentWeekly: if current lease/rent mentioned, extract weekly amount as number
- propertyType: one of "apartment", "house", "townhouse", "land", "commercial"`;

// NSW Stamp Duty Calculator
function calculateStampDuty(price: number): number {
  if (price <= 17_000) return Math.round(price * 1.25 / 100);
  if (price <= 35_000) return Math.round(213 + (price - 17_000) * 1.50 / 100);
  if (price <= 93_000) return Math.round(483 + (price - 35_000) * 1.75 / 100);
  if (price <= 351_000) return Math.round(1_498 + (price - 93_000) * 3.50 / 100);
  if (price <= 1_168_000) return Math.round(10_530 + (price - 351_000) * 4.50 / 100);
  if (price <= 3_721_000) return Math.round(47_295 + (price - 1_168_000) * 5.50 / 100);
  return Math.round(47_295 + (3_721_000 - 1_168_000) * 5.50 / 100 + (price - 3_721_000) * 7.00 / 100);
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL domain
    const parsed = new URL(url);
    const allowedDomains = ["domain.com.au", "realestate.com.au", "ayre.com.au"];
    const isDomainAllowed = allowedDomains.some(d => parsed.hostname.endsWith(d));
    if (!isDomainAllowed) {
      return NextResponse.json(
        { error: `URL must be from: ${allowedDomains.join(", ")}` },
        { status: 400 }
      );
    }

    if (!FIRECRAWL_API_KEY) {
      return NextResponse.json({ error: "FIRECRAWL_API_KEY not configured" }, { status: 500 });
    }
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    // Step 1: Scrape with Firecrawl
    const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 5000,
      }),
    });

    if (!scrapeRes.ok) {
      const errText = await scrapeRes.text();
      return NextResponse.json(
        { error: `Firecrawl error: ${scrapeRes.status} ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const scrapeData = await scrapeRes.json();
    const markdown = scrapeData?.data?.markdown;

    if (!markdown) {
      return NextResponse.json(
        { error: "No content extracted from URL" },
        { status: 422 }
      );
    }

    // Step 2: Extract with Claude Haiku (token-efficient)
    const extractRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `${EXTRACTION_PROMPT}\n\n---\n\nLISTING MARKDOWN:\n${markdown.slice(0, 8000)}`,
          },
        ],
      }),
    });

    if (!extractRes.ok) {
      const errText = await extractRes.text();
      return NextResponse.json(
        { error: `Anthropic error: ${extractRes.status} ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const extractData = await extractRes.json();
    const rawText = extractData?.content?.[0]?.text ?? "";

    // Parse JSON from response (handle potential markdown fences)
    let extracted;
    try {
      const jsonStr = rawText.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
      extracted = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse extraction result", raw: rawText.slice(0, 500) },
        { status: 422 }
      );
    }

    // Step 3: Build property object with calculations
    const price = extracted.price ? Number(extracted.price) : null;
    const hasPrice = price !== null && price > 0;
    const stampDuty = hasPrice ? calculateStampDuty(price) : 0;

    const defaultCosts = 2000 + 2500 + 700 + 400 + 300 + 350 + 154.2 + 154.2 + 600 + 750; // $7908.40
    const totalAcquisition = stampDuty + Math.round(defaultCosts);
    const deposit = hasPrice ? Math.round(price * 0.2) : 0;
    const loanAmount = hasPrice ? price - deposit : 0;
    const totalCashRequired = deposit + totalAcquisition;

    const rentWeekly = extracted.currentRentWeekly || 0;
    const rentAnnual = rentWeekly * 52;
    const grossYield = hasPrice && rentWeekly > 0 ? Math.round((rentAnnual / price) * 10000) / 100 : 0;

    const strataAnnual = (extracted.strataQuarterly || 0) * 4;
    const councilAnnual = (extracted.councilQuarterly || 0) * 4;
    const waterAnnual = (extracted.waterQuarterly || 0) * 4;

    const slug = (extracted.unit ? `${extracted.unit}-` : "") +
      (extracted.street || "property").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

    const property = {
      slug,
      address: extracted.address || `${extracted.unit || ""}/${extracted.street || "Unknown"}`,
      suburb: `${extracted.suburb || "Sydney"} ${extracted.state || "NSW"} ${extracted.postcode || "2000"}`,
      building: extracted.buildingName || "",
      architect: extracted.architect || "",
      price: price || 0,
      priceDisplay: extracted.priceDisplay || (hasPrice ? `$${price!.toLocaleString()}` : "Contact Agent"),
      priceVerified: hasPrice,
      priceSource: hasPrice
        ? `Listed price (${extracted.agency || "listing"})`
        : "Contact Agent — price unverified. Set via scenario editor.",
      type: extracted.propertyType || "apartment",
      beds: extracted.beds || 0,
      baths: extracted.baths || 0,
      cars: extracted.cars || 0,
      internalSqm: extracted.internalSqm || 0,
      totalSqm: extracted.internalSqm || 0,
      floor: extracted.floor || 0,
      daysOnMarket: 0,
      medianDays: 73,
      agent: extracted.agent || "",
      agency: extracted.agency || "",
      currentRentWeekly: rentWeekly,
      leaseEnd: extracted.leaseEnd || "N/A",
      strataAnnual,
      councilAnnual,
      waterAnnual,
      heroImage: "",
      features: extracted.features || [],
      stampDuty,
      totalAcquisition,
      deposit,
      loanAmount,
      totalCashRequired,
      ltrWeekly: rentWeekly,
      ltrAnnual: rentAnnual,
      ltrGrossYield: grossYield,
      ltrNetYield: 0,
      strNightly: 0,
      strOccupancy: 0,
      strAnnualRevenue: 0,
      strGrossYield: 0,
      strNetYield: 0,
      recommendedStrategy: "Long-Term Rental",
      score: 0,
      recommendation: "UNSCORED",
      riskRating: "UNKNOWN",
      grossYield,
      netYield: 0,
      capRate: 0,
      cashOnCash: 0,
      annualCashflow: 0,
      annualHolding: strataAnnual + councilAnnual + waterAnnual + 1800 + Math.round(rentAnnual * 0.085),
      annualInterest: Math.round(loanAmount * 0.061),
      interestRate: 6.1,
      fiveYearCagr: 4.0,
      fiveYearEquity: 0,
      suburbMedian: 770_000,
      priceToMedian: hasPrice ? Math.round((price / 770_000) * 1000) / 1000 : 0,
      targetLow: 0,
      targetHigh: 0,
      openingOffer: 0,
      walkAway: 0,
      leveragePoints: [],
      comparables: [],
      aiSummary: `Property scraped from listing. ${extracted.description || ""}`.slice(0, 300),
      listingUrl: url,
    };

    return NextResponse.json({ success: true, property });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
