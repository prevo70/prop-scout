import { NextResponse } from "next/server";
import { searchResidentialListings } from "@/lib/integrations/domain";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const listingType = searchParams.get("listingType") === "Rent" ? "Rent" : "Sale";
  const pageSizeParam = Number(searchParams.get("pageSize") ?? 20);
  const pageSize = Number.isFinite(pageSizeParam) ? pageSizeParam : 20;

  if (!query) {
    return NextResponse.json({ error: "Missing q query parameter" }, { status: 400 });
  }

  try {
    const results = await searchResidentialListings({
      query,
      listingType,
      pageSize,
    });

    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Domain search failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
