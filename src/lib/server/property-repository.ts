import type { Property } from "@/lib/data";
import { properties as seedProperties } from "@/lib/data";
import { getSupabaseRestConfig } from "@/lib/server/env";
import { selectSupabase, upsertSupabase } from "@/lib/server/supabase-rest";

export interface PropertyRow {
  record_id: string;
  external_id: string | null;
  source?: string | null;
  address_full: string;
  address_street?: string | null;
  address_suburb: string | null;
  address_postcode: string | null;
  address_state: string | null;
  listing_price_cents: number | null;
  listing_price_display: string | null;
  listing_type?: string | null;
  listing_url: string | null;
  agent_name: string | null;
  agency_name: string | null;
  body_corporate_cents: number | null;
  council_rates_cents: number | null;
  water_rates_cents: number | null;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  car_spaces: number | null;
  internal_area_sqm: number | null;
  land_area_sqm: number | null;
  floor_level: number | null;
  days_on_market: number | null;
  investment_score: number | null;
  status: string;
}

function normalizeAddress(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function createPropertyFromRow(row: PropertyRow): Property {
  const price = row.listing_price_cents ? Math.round(row.listing_price_cents / 100) : 0;
  const suburbParts = [row.address_suburb, row.address_state, row.address_postcode].filter(Boolean);

  return {
    slug: row.external_id ?? row.record_id,
    address: row.address_full,
    suburb: suburbParts.join(" "),
    building: "Imported Listing",
    architect: "Unknown",
    price,
    priceDisplay: row.listing_price_display ?? (price > 0 ? new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(price) : "Price unavailable"),
    priceVerified: Boolean(row.listing_price_cents),
    priceSource: row.listing_url ?? undefined,
    type: row.property_type ?? "Property",
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    cars: row.car_spaces ?? 0,
    internalSqm: row.internal_area_sqm ?? 0,
    totalSqm: row.land_area_sqm ?? row.internal_area_sqm ?? 0,
    floor: row.floor_level ?? 0,
    daysOnMarket: row.days_on_market ?? 0,
    medianDays: 0,
    agent: row.agent_name ?? "Unknown",
    agency: row.agency_name ?? "Unknown",
    currentRentWeekly: 0,
    leaseEnd: "N/A",
    strataAnnual: Math.round((row.body_corporate_cents ?? 0) / 100),
    councilAnnual: Math.round((row.council_rates_cents ?? 0) / 100),
    waterAnnual: Math.round((row.water_rates_cents ?? 0) / 100),
    heroImage: "/hero.webp",
    features: [],
    stampDuty: 0,
    totalAcquisition: 0,
    deposit: 0,
    loanAmount: 0,
    totalCashRequired: 0,
    ltrWeekly: 0,
    ltrAnnual: 0,
    ltrGrossYield: 0,
    ltrNetYield: 0,
    strNightly: 0,
    strOccupancy: 0,
    strAnnualRevenue: 0,
    strGrossYield: 0,
    strNetYield: 0,
    recommendedStrategy: "Long-Term Rental",
    score: Math.round(row.investment_score ?? 0),
    recommendation: "HOLD",
    riskRating: "MEDIUM",
    grossYield: 0,
    netYield: 0,
    capRate: 0,
    cashOnCash: 0,
    annualCashflow: 0,
    annualHolding: 0,
    annualInterest: 0,
    interestRate: 0,
    fiveYearCagr: 0,
    fiveYearEquity: 0,
    suburbMedian: 0,
    priceToMedian: 0,
    targetLow: 0,
    targetHigh: 0,
    openingOffer: 0,
    walkAway: 0,
    leveragePoints: [],
    comparables: [],
    aiSummary: "Imported from Supabase. Complete the related analysis tables to populate the full investment view.",
  };
}

export async function getProperties(): Promise<Property[]> {
  if (!getSupabaseRestConfig()) {
    return seedProperties;
  }

  let rows: PropertyRow[] = [];
  try {
    rows = await selectSupabase<PropertyRow>(
      "properties?select=record_id,external_id,address_full,address_street,address_suburb,address_postcode,address_state,listing_price_cents,listing_price_display,listing_url,agent_name,agency_name,body_corporate_cents,council_rates_cents,water_rates_cents,property_type,bedrooms,bathrooms,car_spaces,internal_area_sqm,land_area_sqm,floor_level,days_on_market,investment_score,status"
    );
  } catch {
    return seedProperties;
  }

  const seedByAddress = new Map(
    seedProperties.map((property) => [normalizeAddress(property.address), property])
  );

  return rows.map((row) => {
    const seed = seedByAddress.get(normalizeAddress(row.address_full));
    if (!seed) {
      return createPropertyFromRow(row);
    }

    const price = row.listing_price_cents ? Math.round(row.listing_price_cents / 100) : seed.price;
    return {
      ...seed,
      slug: row.external_id ?? seed.slug,
      address: row.address_full,
      suburb: [row.address_suburb, row.address_state, row.address_postcode].filter(Boolean).join(" ") || seed.suburb,
      price,
      priceDisplay: row.listing_price_display ?? seed.priceDisplay,
      priceVerified: Boolean(row.listing_price_cents),
      agent: row.agent_name ?? seed.agent,
      agency: row.agency_name ?? seed.agency,
      strataAnnual: Math.round((row.body_corporate_cents ?? seed.strataAnnual * 100) / 100),
      councilAnnual: Math.round((row.council_rates_cents ?? seed.councilAnnual * 100) / 100),
      waterAnnual: Math.round((row.water_rates_cents ?? seed.waterAnnual * 100) / 100),
      type: row.property_type ?? seed.type,
      beds: row.bedrooms ?? seed.beds,
      baths: row.bathrooms ?? seed.baths,
      cars: row.car_spaces ?? seed.cars,
      internalSqm: row.internal_area_sqm ?? seed.internalSqm,
      totalSqm: row.land_area_sqm ?? seed.totalSqm,
      floor: row.floor_level ?? seed.floor,
      daysOnMarket: row.days_on_market ?? seed.daysOnMarket,
      score: Math.round(row.investment_score ?? seed.score),
    };
  });
}

export async function upsertPropertyRow(
  row: Partial<PropertyRow> & Pick<PropertyRow, "address_full" | "status"> & { external_id?: string | null }
) {
  const [saved] = await upsertSupabase<typeof row, PropertyRow>(
    "properties",
    [row],
    row.external_id ? "external_id" : undefined
  );
  return saved;
}
