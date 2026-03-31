import { getServerEnv } from "@/lib/server/env";

const DOMAIN_API_BASE = "https://api.domain.com.au";

export interface DomainLocationSuggestion {
  name: string;
  state: string;
  postcode?: string;
  area?: string;
  region?: string;
  type: string;
}

export interface DomainSearchInput {
  query: string;
  listingType?: "Sale" | "Rent";
  pageSize?: number;
}

export interface DomainListingSummary {
  id: number;
  displayAddress: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  displayPrice: string;
  bedrooms?: number;
  bathrooms?: number;
  carspaces?: number;
  propertyTypes: string[];
  heroImageUrl?: string;
  listingType: string;
  source: "domain";
}

function getHeaders(): HeadersInit {
  const apiKey = getServerEnv().domainApiKey;
  if (!apiKey) {
    throw new Error("Missing DOMAIN_API_KEY");
  }

  return {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };
}

async function domainFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${DOMAIN_API_BASE}${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Domain API ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function suggestListingLocations(
  query: string
): Promise<DomainLocationSuggestion[]> {
  const params = new URLSearchParams({ terms: query });
  return domainFetch<DomainLocationSuggestion[]>(`/v1/listings/locations?${params.toString()}`);
}

export async function searchResidentialListings(
  input: DomainSearchInput
): Promise<DomainListingSummary[]> {
  const suggestions = await suggestListingLocations(input.query);
  const primaryLocation = suggestions[0];

  const searchBody = {
    listingType: input.listingType ?? "Sale",
    pageSize: Math.min(input.pageSize ?? 20, 100),
    locations: primaryLocation ? [{
      state: primaryLocation.state.toUpperCase(),
      region: primaryLocation.region ?? "",
      area: primaryLocation.area ?? "",
      suburb: primaryLocation.type === "suburb" ? primaryLocation.name : "",
      postCode: primaryLocation.postcode ?? "",
      includeSurroundingSuburbs: false,
    }] : undefined,
  };

  const results = await domainFetch<Array<{
    type?: string;
    listing?: {
      id: number;
      listingType?: string;
      propertyTypes?: string[];
      addressParts?: {
        displayAddress?: string;
        suburb?: string;
        postcode?: string;
        stateAbbreviation?: string;
      };
      priceDetails?: {
        displayPrice?: string;
      };
      media?: Array<{ category?: string; url?: string }>;
      bedrooms?: number;
      bathrooms?: number;
      carspaces?: number;
    };
  }>>("/v1/listings/residential/_search", {
    method: "POST",
    body: JSON.stringify(searchBody),
  });

  return results
    .map((result) => result.listing)
    .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing?.id))
    .map((listing) => ({
      id: listing.id,
      displayAddress: listing.addressParts?.displayAddress ?? `Listing ${listing.id}`,
      suburb: listing.addressParts?.suburb,
      postcode: listing.addressParts?.postcode,
      state: listing.addressParts?.stateAbbreviation?.toUpperCase(),
      displayPrice: listing.priceDetails?.displayPrice ?? "Price unavailable",
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      carspaces: listing.carspaces,
      propertyTypes: listing.propertyTypes ?? [],
      heroImageUrl: listing.media?.find((asset) => asset.category === "Image")?.url,
      listingType: listing.listingType ?? input.listingType ?? "Sale",
      source: "domain",
    }));
}
