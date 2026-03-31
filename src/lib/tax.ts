// Australian Personal Income Tax Calculator — 2025-26 FY
// Source: ATO + Stage 3 tax cuts (effective 1 July 2024, unchanged for 2025-26)

// ─── Tax Brackets (Resident) ─────────────────────────────────────────────────

const TAX_BRACKETS = [
  { min: 0, max: 18_200, rate: 0, base: 0 },
  { min: 18_201, max: 45_000, rate: 0.16, base: 0 },
  { min: 45_001, max: 135_000, rate: 0.30, base: 4_288 },
  { min: 135_001, max: 190_000, rate: 0.37, base: 31_288 },
  { min: 190_001, max: Infinity, rate: 0.45, base: 51_638 },
] as const;

// ─── LITO (Low Income Tax Offset) ────────────────────────────────────────────

function calculateLITO(taxableIncome: number): number {
  if (taxableIncome <= 37_500) return 700;
  if (taxableIncome <= 45_000) return 700 - 0.05 * (taxableIncome - 37_500);
  if (taxableIncome <= 66_667) return 325 - 0.015 * (taxableIncome - 45_000);
  return 0;
}

// ─── Medicare Levy ───────────────────────────────────────────────────────────

const MEDICARE_RATE = 0.02;
const MEDICARE_SHADE_IN_LOW = 27_222; // no levy below
const MEDICARE_SHADE_IN_HIGH = 34_027; // full 2% above
const MEDICARE_SHADE_IN_RATE = 0.10;

function calculateMedicareLevy(taxableIncome: number): number {
  if (taxableIncome <= MEDICARE_SHADE_IN_LOW) return 0;
  if (taxableIncome >= MEDICARE_SHADE_IN_HIGH) return Math.round(taxableIncome * MEDICARE_RATE);
  return Math.round((taxableIncome - MEDICARE_SHADE_IN_LOW) * MEDICARE_SHADE_IN_RATE);
}

// ─── HELP/HECS Repayments (2025-26 marginal system) ─────────────────────────

function calculateHELP(repaymentIncome: number): number {
  if (repaymentIncome <= 67_000) return 0;
  if (repaymentIncome <= 125_000) return Math.round((repaymentIncome - 67_000) * 0.15);
  if (repaymentIncome <= 179_285) return Math.round(8_700 + (repaymentIncome - 125_000) * 0.17);
  return Math.round(repaymentIncome * 0.10);
}

// ─── Core Tax Calculation ────────────────────────────────────────────────────

export function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
    const b = TAX_BRACKETS[i];
    if (taxableIncome >= b.min) {
      return Math.round(b.base + (taxableIncome - b.min + 1) * b.rate);
    }
  }
  return 0;
}

export function getMarginalRate(taxableIncome: number): number {
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
    if (taxableIncome >= TAX_BRACKETS[i].min) return TAX_BRACKETS[i].rate;
  }
  return 0;
}

export function getTaxBracketLabel(taxableIncome: number): string {
  const rate = getMarginalRate(taxableIncome);
  return `${Math.round(rate * 100)}%`;
}

// ─── Tax Profile Inputs ──────────────────────────────────────────────────────

export interface TaxProfileInputs {
  grossSalary: number;
  otherIncome: number;           // dividends, interest, etc.
  deductions: number;            // work-related deductions
  hasHELP: boolean;
  // Property investment (filled from scenario)
  rentalIncome: number;          // annual rental income
  rentalExpenses: number;        // interest + holding costs + depreciation
  depreciationAmount: number;    // Division 43 + Division 40 allowances
}

// ─── Full Tax Calculation Result ─────────────────────────────────────────────

export interface TaxResult {
  // Pre-property
  grossIncome: number;
  taxableIncomeBeforeProperty: number;
  taxBeforeProperty: number;
  marginalRateBeforeProperty: number;
  // Property impact
  netRentalIncome: number;       // can be negative (= net rental loss)
  rentalIncome: number;
  rentalExpenses: number;
  // Post-property (with negative gearing)
  taxableIncomeAfterProperty: number;
  taxAfterProperty: number;
  marginalRateAfterProperty: number;
  // Components
  lito: number;
  medicareLevy: number;
  helpRepayment: number;
  // Tax saving from property
  taxSaving: number;             // how much less tax you pay due to property
  effectivePropertyCost: number; // annual out-of-pocket after tax benefit
  weeklyPropertyCost: number;
  // Summary
  totalTaxBeforeProperty: number;  // tax + medicare + HELP
  totalTaxAfterProperty: number;
  takeHomeBeforeProperty: number;
  takeHomeAfterProperty: number;
  takeHomeDifference: number;      // weekly impact
  // Bracket info for visualization
  brackets: { label: string; min: number; max: number; rate: number; taxInBracket: number }[];
}

// ─── Calculate Full Tax Scenario ─────────────────────────────────────────────

export function calculateFullTax(inputs: TaxProfileInputs): TaxResult {
  const { grossSalary, otherIncome, deductions, hasHELP } = inputs;

  // Pre-property taxable income
  const grossIncome = grossSalary + otherIncome;
  const taxableIncomeBeforeProperty = Math.max(0, grossIncome - deductions);
  const taxBeforeProperty = calculateIncomeTax(taxableIncomeBeforeProperty);
  const marginalRateBeforeProperty = getMarginalRate(taxableIncomeBeforeProperty);

  // Property rental position
  const netRentalIncome = inputs.rentalIncome - inputs.rentalExpenses;
  // If negative, it's a rental loss that reduces taxable income (negative gearing)

  // Post-property taxable income
  const taxableIncomeAfterProperty = Math.max(0, taxableIncomeBeforeProperty + netRentalIncome);
  const taxAfterProperty = calculateIncomeTax(taxableIncomeAfterProperty);
  const marginalRateAfterProperty = getMarginalRate(taxableIncomeAfterProperty);

  // LITO (applied to post-property taxable income)
  const litoAfter = calculateLITO(taxableIncomeAfterProperty);

  // Medicare levy (on post-property taxable income)
  const medicareLevy = calculateMedicareLevy(taxableIncomeAfterProperty);

  // HELP (repayment income includes net investment losses added back)
  const helpRepaymentIncome = taxableIncomeAfterProperty + (netRentalIncome < 0 ? Math.abs(netRentalIncome) : 0);
  const helpRepayment = hasHELP ? calculateHELP(helpRepaymentIncome) : 0;

  // Total tax
  const totalTaxBefore = Math.max(0, calculateIncomeTax(taxableIncomeBeforeProperty) - calculateLITO(taxableIncomeBeforeProperty))
    + calculateMedicareLevy(taxableIncomeBeforeProperty)
    + (hasHELP ? calculateHELP(taxableIncomeBeforeProperty) : 0);

  const totalTaxAfter = Math.max(0, taxAfterProperty - litoAfter)
    + medicareLevy
    + helpRepayment;

  // Tax saving from negative gearing
  const taxSaving = Math.max(0, totalTaxBefore - totalTaxAfter);

  // Out-of-pocket cost after tax benefit
  // If rental loss = -$30k and tax saving = $11k, effective cost = $19k
  const annualCashflowFromProperty = netRentalIncome; // negative if negatively geared
  const effectivePropertyCost = annualCashflowFromProperty < 0
    ? Math.abs(annualCashflowFromProperty) - taxSaving
    : 0; // positive cashflow = no out-of-pocket
  const weeklyPropertyCost = Math.round(effectivePropertyCost / 52);

  // Take home pay
  const takeHomeBeforeProperty = grossIncome - totalTaxBefore;
  const takeHomeAfterProperty = grossIncome + netRentalIncome - totalTaxAfter;
  const takeHomeDifference = Math.round((takeHomeAfterProperty - takeHomeBeforeProperty) / 52);

  // Bracket breakdown for visualization
  const brackets = TAX_BRACKETS.map((b, i) => {
    const bracketMin = b.min;
    const bracketMax = i < TAX_BRACKETS.length - 1 ? b.max : taxableIncomeAfterProperty;
    const taxInBracket = taxableIncomeAfterProperty >= bracketMin
      ? Math.round(Math.min(taxableIncomeAfterProperty, bracketMax) - bracketMin + (i > 0 ? 1 : 0)) * b.rate
      : 0;

    return {
      label: b.rate === 0 ? "Tax Free" : `${Math.round(b.rate * 100)}%`,
      min: bracketMin,
      max: b.max === Infinity ? Math.max(taxableIncomeAfterProperty, 250_000) : b.max,
      rate: b.rate,
      taxInBracket: Math.max(0, Math.round(taxInBracket)),
    };
  });

  return {
    grossIncome,
    taxableIncomeBeforeProperty,
    taxBeforeProperty,
    marginalRateBeforeProperty,
    netRentalIncome,
    rentalIncome: inputs.rentalIncome,
    rentalExpenses: inputs.rentalExpenses,
    taxableIncomeAfterProperty,
    taxAfterProperty,
    marginalRateAfterProperty,
    lito: litoAfter,
    medicareLevy,
    helpRepayment,
    taxSaving,
    effectivePropertyCost,
    weeklyPropertyCost,
    totalTaxBeforeProperty: totalTaxBefore,
    totalTaxAfterProperty: totalTaxAfter,
    takeHomeBeforeProperty,
    takeHomeAfterProperty,
    takeHomeDifference,
    brackets,
  };
}

// ─── Exports for constants (useful for UI labels) ────────────────────────────

export const TAX_BRACKET_TABLE = TAX_BRACKETS;
export const MEDICARE_LEVY_RATE = MEDICARE_RATE;
