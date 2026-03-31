import { NextResponse } from "next/server";
import { calculateAcquisitionCosts, type AcquisitionCostInputs } from "@/lib/calculators/acquisition-costs";

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const purchasePrice = asNumber(payload.purchasePrice);
  if (!purchasePrice || purchasePrice <= 0) {
    return NextResponse.json({ error: "purchasePrice must be a positive number" }, { status: 400 });
  }

  const inputs: AcquisitionCostInputs = {
    purchasePrice,
    buyerType: typeof payload.buyerType === "string" ? payload.buyerType as AcquisitionCostInputs["buyerType"] : undefined,
    propertyType: typeof payload.propertyType === "string" ? payload.propertyType as AcquisitionCostInputs["propertyType"] : undefined,
    depositPercent: asNumber(payload.depositPercent),
    isCashPurchase: Boolean(payload.isCashPurchase),
    includeBuyersAgent: Boolean(payload.includeBuyersAgent),
    buyersAgentPercent: asNumber(payload.buyersAgentPercent),
    includeFinancialPlanner: Boolean(payload.includeFinancialPlanner),
    financialPlannerFee: asNumber(payload.financialPlannerFee),
  };

  const result = calculateAcquisitionCosts(inputs);

  return NextResponse.json({ result });
}
