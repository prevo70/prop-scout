"use client";

import type { Property } from "@/lib/data";
import type { DerivedValues } from "@/lib/calculations";
import { DEFAULT_ACQUISITION_COSTS as DAC, DEFAULT_HOLDING as DH } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CostRow, fmt, fmtFull, M } from "./shared";

interface CostsTabProps {
  p: Property;
  derived?: DerivedValues;
}

export function CostsTab({ p, derived }: CostsTabProps) {
  // Resolve all line items: use derived if present, otherwise defaults
  const conveyancing = derived?.conveyancing ?? DAC.conveyancing;
  const legalFees = derived?.legalFees ?? DAC.legalFees;
  const buildingInspection = derived?.buildingInspection ?? DAC.buildingInspection;
  const pestInspection = derived?.pestInspection ?? DAC.pestInspection;
  const strataReport = derived?.strataReport ?? DAC.strataReport;
  const titleSearch = derived?.titleSearch ?? DAC.titleSearch;
  const mortgageRegistration = derived?.mortgageRegistration ?? DAC.mortgageRegistration;
  const transferRegistration = derived?.transferRegistration ?? DAC.transferRegistration;
  const loanApplicationFee = derived?.loanApplicationFee ?? DAC.loanApplicationFee;
  const depreciationSchedule = derived?.depreciationSchedule ?? DAC.depreciationSchedule;

  const stampDuty = derived?.stampDuty ?? p.stampDuty;
  const totalAcquisition = derived?.totalAcquisition ?? p.totalAcquisition;
  const deposit = derived?.deposit ?? p.deposit;
  const loanAmount = derived?.loanAmount ?? p.loanAmount;
  const totalCashRequired = derived?.totalCashRequired ?? p.totalCashRequired;

  // Holding
  const insurance = derived?.insurance ?? DH.insurance;
  const pmPercent = derived?.pmPercent ?? DH.pmPercent;
  const pmCost = Math.round((derived?.ltrAnnual ?? p.ltrAnnual) * pmPercent / 100);
  const strataAnnual = derived?.strataAnnual ?? p.strataAnnual;
  const councilAnnual = derived?.councilAnnual ?? p.councilAnnual;
  const waterAnnual = derived?.waterAnnual ?? p.waterAnnual;
  const holdingTotal = derived?.annualHolding ?? (strataAnnual + councilAnnual + waterAnnual + insurance + pmCost);
  const depositPercent = derived?.depositPercent ?? 20;
  const depositLabel = loanAmount === 0 ? "Cash Purchase" : `Deposit (${depositPercent}%)`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Acquisition Cost Breakdown */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Acquisition Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CostRow label="Stamp Duty (NSW)" amount={fmt(stampDuty)} />
          <Separator />
          <CostRow label="Conveyancing" amount={fmtFull(conveyancing)} />
          <CostRow label="Legal Fees" amount={fmtFull(legalFees)} />
          <CostRow label="Building Inspection" amount={fmtFull(buildingInspection)} />
          <CostRow label="Pest Inspection" amount={fmtFull(pestInspection)} />
          <CostRow label="Strata Report" amount={fmtFull(strataReport)} />
          <CostRow label="Title Search" amount={fmtFull(titleSearch)} />
          <CostRow label="Mortgage Registration" amount={fmtFull(mortgageRegistration)} />
          <CostRow label="Transfer Registration" amount={fmtFull(transferRegistration)} />
          <CostRow label="Loan Application Fee" amount={fmtFull(loanApplicationFee)} />
          <CostRow label="Depreciation Schedule" amount={fmtFull(depreciationSchedule)} />
          <Separator />
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold">Total Acquisition Costs</span>
            <span className="font-mono text-sm font-semibold text-amber-400">
              {fmt(totalAcquisition)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Loan Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <M label="Purchase Price" value={fmt(p.price)} />
          <M label={depositLabel} value={fmt(deposit)} />
          <M label="Loan Amount" value={fmt(loanAmount)} />
          <Separator />
          <M label="Total Cash Required" value={fmt(totalCashRequired)} accent />
        </CardContent>
      </Card>

      {/* Holding Costs */}
      <Card>
        <CardHeader>
          <CardTitle>Annual Holding Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CostRow label="Strata" amount={fmt(strataAnnual)} />
          <CostRow label="Council" amount={fmt(councilAnnual)} />
          <CostRow label="Water" amount={fmt(waterAnnual)} />
          <CostRow label="Insurance" amount={fmt(insurance)} />
          <CostRow label={`Property Mgmt (${pmPercent}%)`} amount={fmt(pmCost)} />
          <Separator />
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold">Total Holding</span>
            <span className="font-mono text-sm font-semibold text-amber-400">
              {fmt(holdingTotal)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
