export type BuyerType =
  | "investor"
  | "owner_occupier"
  | "first_home_buyer"
  | "foreign";

export interface StampDutyBreakdown {
  dutiableValue: number;
  transferDuty: number;
  foreignSurcharge: number;
  total: number;
}

export function calculateNswTransferDuty(dutiableValue: number): number {
  if (dutiableValue <= 17_000) return Math.round(dutiableValue * 0.0125);
  if (dutiableValue <= 35_000) return Math.round(213 + (dutiableValue - 17_000) * 0.015);
  if (dutiableValue <= 93_000) return Math.round(483 + (dutiableValue - 35_000) * 0.0175);
  if (dutiableValue <= 351_000) return Math.round(1_498 + (dutiableValue - 93_000) * 0.035);
  if (dutiableValue <= 1_168_000) return Math.round(10_530 + (dutiableValue - 351_000) * 0.045);
  if (dutiableValue <= 3_721_000) return Math.round(47_295 + (dutiableValue - 1_168_000) * 0.055);

  return Math.round(
    47_295 + (3_721_000 - 1_168_000) * 0.055 + (dutiableValue - 3_721_000) * 0.07
  );
}

export function calculateNswStampDuty(
  dutiableValue: number,
  buyerType: BuyerType = "investor"
): StampDutyBreakdown {
  const transferDuty = calculateNswTransferDuty(dutiableValue);
  const foreignSurcharge = buyerType === "foreign" ? Math.round(dutiableValue * 0.09) : 0;

  return {
    dutiableValue,
    transferDuty,
    foreignSurcharge,
    total: transferDuty + foreignSurcharge,
  };
}
