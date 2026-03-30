"use client";

import type { Property } from "@/lib/data";
import type { ScenarioAdjustments } from "@/lib/scenarios";
import {
  DEFAULT_ACQUISITION_COSTS as DAC,
  DEFAULT_HOLDING as DH,
  DEFAULT_LOAN as DL,
  DEFAULT_GROWTH_RATES as DG,
} from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScenarioEditorProps {
  adjustments: ScenarioAdjustments;
  updateField: (field: keyof ScenarioAdjustments, value: number | boolean) => void;
  baseProperty: Property;
}

interface FieldDef {
  key: keyof ScenarioAdjustments;
  label: string;
  placeholder: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="col-span-full text-[11px] uppercase tracking-widest text-muted-foreground pt-2 first:pt-0">
      {children}
    </h4>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: number | undefined;
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{field.label}</Label>
      <div className="relative">
        {field.prefix && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {field.prefix}
          </span>
        )}
        <Input
          type="number"
          step={field.step}
          placeholder={String(field.placeholder)}
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") return;
            onChange(Number(v));
          }}
          className={`font-mono text-sm ${field.prefix ? "pl-6" : ""} ${field.suffix ? "pr-6" : ""}`}
        />
        {field.suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {field.suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function ScenarioEditor({
  adjustments,
  updateField,
  baseProperty,
}: ScenarioEditorProps) {
  const sections: { title: string; fields: FieldDef[] }[] = [
    {
      title: "Purchase Price",
      fields: [
        { key: "purchasePrice", label: "Purchase Price", placeholder: baseProperty.price, step: 10000, prefix: "$" },
      ],
    },
    {
      title: "Acquisition Costs",
      fields: [
        { key: "conveyancing", label: "Conveyancing", placeholder: DAC.conveyancing, step: 100, prefix: "$" },
        { key: "legalFees", label: "Legal Fees", placeholder: DAC.legalFees, step: 100, prefix: "$" },
        { key: "buildingInspection", label: "Building Inspection", placeholder: DAC.buildingInspection, step: 50, prefix: "$" },
        { key: "pestInspection", label: "Pest Inspection", placeholder: DAC.pestInspection, step: 50, prefix: "$" },
        { key: "strataReport", label: "Strata Report", placeholder: DAC.strataReport, step: 50, prefix: "$" },
        { key: "titleSearch", label: "Title Search", placeholder: DAC.titleSearch, step: 50, prefix: "$" },
        { key: "mortgageRegistration", label: "Mortgage Registration", placeholder: DAC.mortgageRegistration, step: 10, prefix: "$" },
        { key: "transferRegistration", label: "Transfer Registration", placeholder: DAC.transferRegistration, step: 10, prefix: "$" },
        { key: "loanApplicationFee", label: "Loan Application Fee", placeholder: DAC.loanApplicationFee, step: 50, prefix: "$" },
        { key: "depreciationSchedule", label: "Depreciation Schedule", placeholder: DAC.depreciationSchedule, step: 50, prefix: "$" },
      ],
    },
    {
      title: "Holding Costs",
      fields: [
        { key: "strataAnnual", label: "Strata (annual)", placeholder: baseProperty.strataAnnual, step: 100, prefix: "$" },
        { key: "councilAnnual", label: "Council (annual)", placeholder: baseProperty.councilAnnual, step: 100, prefix: "$" },
        { key: "waterAnnual", label: "Water (annual)", placeholder: baseProperty.waterAnnual, step: 100, prefix: "$" },
        { key: "insurance", label: "Insurance (annual)", placeholder: DH.insurance, step: 100, prefix: "$" },
        { key: "pmPercent", label: "Property Mgmt", placeholder: DH.pmPercent, step: 0.5, suffix: "%" },
      ],
    },
    {
      title: "Loan",
      fields: [
        { key: "depositPercent", label: "Deposit", placeholder: DL.depositPercent, step: 1, suffix: "%" },
        { key: "interestRate", label: "Interest Rate", placeholder: DL.interestRate, step: 0.05, suffix: "%" },
      ],
    },
    {
      title: "Rental",
      fields: [
        { key: "rentWeekly", label: "LTR Weekly Rent", placeholder: baseProperty.ltrWeekly, step: 10, prefix: "$" },
        { key: "strNightly", label: "STR Nightly Rate", placeholder: baseProperty.strNightly, step: 5, prefix: "$" },
        { key: "strOccupancy", label: "STR Occupancy", placeholder: baseProperty.strOccupancy, step: 1, suffix: "%" },
      ],
    },
    {
      title: "Growth Rates",
      fields: [
        { key: "strataIncrease", label: "Strata Increase", placeholder: DG.strataIncrease, step: 0.5, suffix: "%" },
        { key: "councilIncrease", label: "Council Increase", placeholder: DG.councilIncrease, step: 0.5, suffix: "%" },
        { key: "rentGrowth", label: "Rent Growth", placeholder: DG.rentGrowth, step: 0.5, suffix: "%" },
        { key: "capitalGrowth", label: "Capital Growth", placeholder: baseProperty.fiveYearCagr ?? DG.capitalGrowth, step: 0.5, suffix: "%" },
      ],
    },
  ];

  return (
    <div className="border-b bg-card/30 px-4 py-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
        {sections.map((section) => (
          <div key={section.title} className="contents">
            <SectionHeader>{section.title}</SectionHeader>
            {section.fields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={adjustments[field.key] as number | undefined}
                onChange={(val) => updateField(field.key, val)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
