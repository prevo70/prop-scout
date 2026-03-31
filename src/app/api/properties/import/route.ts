import { NextResponse } from "next/server";
import type { DomainListingSummary } from "@/lib/integrations/domain";
import { createPropertyFromRow, upsertPropertyRow } from "@/lib/server/property-repository";

interface ManualPropertyInput {
  addressFull?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  propertyType?: string;
  priceDisplay?: string;
  listingUrl?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  carSpaces?: number | string;
}

function parseDisplayPrice(displayPrice: string): number | null {
  const matches = displayPrice.match(/\$?([\d,]+)/g);
  if (!matches || matches.length !== 1) return null;

  const digits = matches[0].replace(/[^\d]/g, "");
  if (!digits) return null;

  const price = Number(digits);
  return Number.isFinite(price) ? price * 100 : null;
}

function titleCase(value: string | undefined): string {
  if (!value) return "";
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function parseOptionalInteger(value: number | string | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const trimmed = value?.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(request: Request) {
  let payload: { listing?: DomainListingSummary; manual?: ManualPropertyInput };

  try {
    payload = await request.json() as { listing?: DomainListingSummary; manual?: ManualPropertyInput };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const listing = payload.listing;
  const manual = payload.manual;

  if (!listing && !manual) {
    return NextResponse.json({ error: "Missing listing payload" }, { status: 400 });
  }

  try {
    if (manual) {
      const addressFull = manual.addressFull?.trim();
      if (!addressFull) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
      }

      const priceDisplay = manual.priceDisplay?.trim() || "Price unavailable";
      const row = await upsertPropertyRow({
        external_id: null,
        address_full: addressFull,
        address_street: addressFull,
        address_suburb: manual.suburb?.trim() || null,
        address_postcode: manual.postcode?.trim() || null,
        address_state: manual.state?.trim().toUpperCase() || null,
        property_type: manual.propertyType?.trim() || "apartment",
        bedrooms: parseOptionalInteger(manual.bedrooms),
        bathrooms: parseOptionalInteger(manual.bathrooms),
        car_spaces: parseOptionalInteger(manual.carSpaces),
        listing_price_cents: parseDisplayPrice(priceDisplay),
        listing_price_display: priceDisplay,
        listing_url: manual.listingUrl?.trim() || null,
        listing_type: "Manual",
        status: "active",
        source: "manual",
      });

      return NextResponse.json({
        property: createPropertyFromRow(row),
        row,
      });
    }

    if (!listing) {
      return NextResponse.json({ error: "Missing listing payload" }, { status: 400 });
    }

    const row = await upsertPropertyRow({
      external_id: String(listing.id),
      address_full: listing.displayAddress,
      address_street: listing.displayAddress,
      address_suburb: listing.suburb ?? null,
      address_postcode: listing.postcode ?? null,
      address_state: listing.state ?? null,
      property_type: listing.propertyTypes[0] ?? "apartment",
      bedrooms: listing.bedrooms ?? null,
      bathrooms: listing.bathrooms ?? null,
      car_spaces: listing.carspaces ?? null,
      listing_price_cents: parseDisplayPrice(listing.displayPrice),
      listing_price_display: listing.displayPrice,
      listing_type: titleCase(listing.listingType),
      status: "active",
      source: "domain",
    });

    return NextResponse.json({
      property: createPropertyFromRow(row),
      row,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Property import failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
