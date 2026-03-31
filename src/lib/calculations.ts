import type { Property } from "./data";
import type { ScenarioAdjustments } from "./scenarios";
import {
  DEFAULT_ACQUISITION_COSTS as DAC,
  DEFAULT_HOLDING as DH,
  DEFAULT_LOAN as DL,
  DEFAULT_GROWTH_RATES as DG,
  VACANCY_RATE,
} from "./constants";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DerivedValues {
  // Resolved purchase price (may differ from base if adjusted)
  purchasePrice: number;
  // Resolved acquisition line items
  conveyancing: number;
  legalFees: number;
  buildingInspection: number;
  pestInspection: number;
  strataReport: number;
  titleSearch: number;
  mortgageRegistration: number;
  transferRegistration: number;
  loanApplicationFee: number;
  depreciationSchedule: number;
  // Computed acquisition totals
  stampDuty: number;
  totalAcquisition: number;
  deposit: number;
  loanAmount: number;
  totalCashRequired: number;
  // Holding
  insurance: number;
  pmPercent: number;
  annualHolding: number;
  // Rental
  ltrWeekly: number;
  ltrAnnual: number;
  ltrNetRental: number;
  ltrGrossYield: number;
  ltrNetYield: number;
  strNightly: number;
  strOccupancy: number;
  strAnnualRevenue: number;
  strGrossYield: number;
  // Investment
  interestRate: number;
  annualInterest: number;
  annualCashflow: number;
  grossYield: number;
  netYield: number;
  capRate: number;
  cashOnCash: number;
  depositPercent: number;
}

export interface YearProjection {
  year: number;
  propertyValue: number;
  equity: number;
  annualRent: number;
  holdingCosts: number;
  interestCost: number;
  netCashflow: number;
  cumulativeCashflow: number;
  cumulativeEquity: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPI: number;
  monthlyIO: number;
  totalInterestPI: number;
  totalInterestIO: number;
  lvr: number;
  lmiRequired: boolean;
}

// ─── Recalculate ─────────────────────────────────────────────────────────────

export function recalculate(
  base: Property,
  adj: ScenarioAdjustments
): DerivedValues {
  const isCash = adj.isCashPurchase;

  // Resolve purchase price (can be overridden in scenario)
  const purchasePrice = adj.purchasePrice ?? base.price;

  // Recalculate stamp duty if purchase price changed
  const stampDuty = adj.purchasePrice != null
    ? calculateNswStampDuty(purchasePrice)
    : base.stampDuty;

  // Resolve acquisition line items
  const conveyancing = adj.conveyancing ?? DAC.conveyancing;
  const legalFees = adj.legalFees ?? DAC.legalFees;
  const buildingInspection = adj.buildingInspection ?? DAC.buildingInspection;
  const pestInspection = adj.pestInspection ?? DAC.pestInspection;
  const strataReport = adj.strataReport ?? DAC.strataReport;
  const titleSearch = adj.titleSearch ?? DAC.titleSearch;
  const mortgageRegistration = isCash ? 0 : (adj.mortgageRegistration ?? DAC.mortgageRegistration);
  const transferRegistration = adj.transferRegistration ?? DAC.transferRegistration;
  const loanApplicationFee = isCash ? 0 : (adj.loanApplicationFee ?? DAC.loanApplicationFee);
  const depreciationSchedule = adj.depreciationSchedule ?? DAC.depreciationSchedule;

  const totalAcquisition =
    stampDuty +
    conveyancing + legalFees + buildingInspection + pestInspection +
    strataReport + titleSearch + mortgageRegistration + transferRegistration +
    loanApplicationFee + depreciationSchedule;

  // Loan
  const depositPercent = adj.depositPercent ?? DL.depositPercent;
  const deposit = isCash ? purchasePrice : Math.round(purchasePrice * depositPercent / 100);
  const loanAmount = isCash ? 0 : purchasePrice - deposit;
  const totalCashRequired = isCash
    ? purchasePrice + totalAcquisition
    : deposit + totalAcquisition;

  // Holding
  const strataAnnual = adj.strataAnnual ?? base.strataAnnual;
  const councilAnnual = adj.councilAnnual ?? base.councilAnnual;
  const waterAnnual = adj.waterAnnual ?? base.waterAnnual;
  const insurance = adj.insurance ?? DH.insurance;
  const pmPercent = adj.pmPercent ?? DH.pmPercent;

  // Rental
  const ltrWeekly = adj.rentWeekly ?? base.ltrWeekly;
  const ltrAnnual = ltrWeekly * 52;
  const pmCost = Math.round(ltrAnnual * pmPercent / 100);
  const ltrNetRental = Math.round(ltrAnnual * (1 - VACANCY_RATE / 100));

  const annualHolding = strataAnnual + councilAnnual + waterAnnual + insurance + pmCost;

  // Yields (all based on resolved purchase price)
  const ltrGrossYield = purchasePrice > 0 ? round2((ltrAnnual / purchasePrice) * 100) : 0;
  const netYieldCalc = purchasePrice > 0 ? round2(((ltrNetRental - annualHolding) / purchasePrice) * 100) : 0;
  const ltrNetYield = netYieldCalc;

  // Interest
  const interestRate = adj.interestRate ?? DL.interestRate;
  const annualInterest = isCash ? 0 : Math.round(loanAmount * interestRate / 100);

  // Cashflow
  const annualCashflow = ltrNetRental - annualInterest - annualHolding;

  // Gross yield
  const grossYield = ltrGrossYield;
  const netYield = netYieldCalc;

  // Cap rate: NOI / price (NOI = net rental - holding, before debt)
  const noi = ltrNetRental - annualHolding;
  const capRate = purchasePrice > 0 ? round2((noi / purchasePrice) * 100) : 0;

  // Cash-on-cash
  const cashOnCash = totalCashRequired > 0
    ? round2((annualCashflow / totalCashRequired) * 100)
    : 0;

  // STR
  const strNightly = adj.strNightly ?? base.strNightly;
  const strOccupancy = adj.strOccupancy ?? base.strOccupancy;
  const bookedNights = Math.round(365 * strOccupancy / 100);
  const strAnnualRevenue = strNightly * bookedNights;
  const strGrossYield = purchasePrice > 0 ? round2((strAnnualRevenue / purchasePrice) * 100) : 0;

  return {
    purchasePrice,
    conveyancing, legalFees, buildingInspection, pestInspection,
    strataReport, titleSearch, mortgageRegistration, transferRegistration,
    loanApplicationFee, depreciationSchedule,
    stampDuty, totalAcquisition, deposit, loanAmount, totalCashRequired,
    insurance, pmPercent, annualHolding,
    ltrWeekly, ltrAnnual, ltrNetRental, ltrGrossYield, ltrNetYield,
    strNightly, strOccupancy, strAnnualRevenue, strGrossYield,
    interestRate, annualInterest, annualCashflow,
    grossYield, netYield, capRate, cashOnCash, depositPercent,
  };
}

// ─── NSW Stamp Duty Calculator ───────────────────────────────────────────────

function calculateNswStampDuty(price: number): number {
  // NSW 2025-26 investor rates (non-first-home-buyer)
  if (price <= 17_000) return Math.round(price * 1.25 / 100);
  if (price <= 35_000) return Math.round(213 + (price - 17_000) * 1.50 / 100);
  if (price <= 93_000) return Math.round(483 + (price - 35_000) * 1.75 / 100);
  if (price <= 351_000) return Math.round(1_498 + (price - 93_000) * 3.50 / 100);
  if (price <= 1_168_000) return Math.round(10_530 + (price - 351_000) * 4.50 / 100);
  if (price <= 3_721_000) return Math.round(47_295 + (price - 1_168_000) * 5.50 / 100);
  // Premium property
  return Math.round(47_295 + (3_721_000 - 1_168_000) * 5.50 / 100 + (price - 3_721_000) * 7.00 / 100);
}

// ─── 5-Year Projection ──────────────────────────────────────────────────────

export function projectFiveYears(
  base: Property,
  adj: ScenarioAdjustments
): YearProjection[] {
  const derived = recalculate(base, adj);
  const capitalGrowth = (adj.capitalGrowth ?? base.fiveYearCagr ?? DG.capitalGrowth) / 100;
  const rentGrowth = (adj.rentGrowth ?? DG.rentGrowth) / 100;
  const strataGrowth = (adj.strataIncrease ?? DG.strataIncrease) / 100;
  const councilGrowth = (adj.councilIncrease ?? DG.councilIncrease) / 100;
  const waterGrowth = (adj.capitalGrowth !== undefined ? DG.capitalGrowth : 2.5) / 100; // water ~= council

  const years: YearProjection[] = [];
  let cumCashflow = 0;

  for (let y = 1; y <= 5; y++) {
    const propertyValue = Math.round(derived.purchasePrice * Math.pow(1 + capitalGrowth, y));
    const equity = propertyValue - derived.loanAmount;
    const annualRent = Math.round(derived.ltrWeekly * 52 * Math.pow(1 + rentGrowth, y));
    const strata = Math.round((adj.strataAnnual ?? base.strataAnnual) * Math.pow(1 + strataGrowth, y));
    const council = Math.round((adj.councilAnnual ?? base.councilAnnual) * Math.pow(1 + councilGrowth, y));
    const water = Math.round((adj.waterAnnual ?? base.waterAnnual) * Math.pow(1 + waterGrowth, y));
    const pm = Math.round(annualRent * derived.pmPercent / 100);
    const holdingCosts = strata + council + water + derived.insurance + pm;
    const interestCost = derived.annualInterest;
    const netRent = Math.round(annualRent * (1 - VACANCY_RATE / 100));
    const netCashflow = netRent - interestCost - holdingCosts;
    cumCashflow += netCashflow;

    years.push({
      year: y,
      propertyValue,
      equity,
      annualRent,
      holdingCosts,
      interestCost,
      netCashflow,
      cumulativeCashflow: cumCashflow,
      cumulativeEquity: equity,
    });
  }

  return years;
}

// ─── Break-Even / Payback Projection ─────────────────────────────────────────

export interface BreakevenYear {
  year: number;
  propertyValue: number;
  loanBalance: number;        // remaining principal (P&I amortisation or full loan if IO)
  equity: number;             // property value - loan balance
  annualRent: number;
  annualExpenses: number;     // holding + interest
  netCashflow: number;
  cumulativeCashInvested: number;  // deposit + acquisition + cumulative negative cashflow
  cumulativeNetPosition: number;   // equity - cumulative cash invested (when this > 0 = break-even)
  cumulativeRentProfit: number;    // cumulative net cashflow from rent
  capitalGain: number;             // property value - purchase price
  totalReturn: number;             // capital gain + cumulative rent profit
  roiPercent: number;              // total return / total cash invested × 100
}

export interface BreakevenInputs {
  years: number;               // 5, 10, 15, 20, 25
  expenseInflation: number;    // blanket % increase per year on all expenses
  capitalGrowthRate: number;   // % per year
  rentGrowthRate: number;      // % per year
  isInterestOnly: boolean;     // IO vs P&I
}

export function projectBreakeven(
  base: Property,
  adj: ScenarioAdjustments,
  inputs: BreakevenInputs
): BreakevenYear[] {
  const derived = recalculate(base, adj);
  const price = derived.purchasePrice;
  const isCash = adj.isCashPurchase;

  const capGrowth = inputs.capitalGrowthRate / 100;
  const rentGrowth = inputs.rentGrowthRate / 100;
  const expInflation = inputs.expenseInflation / 100;

  // Initial cash outlay
  const initialCash = derived.totalCashRequired;

  // Loan amortisation (P&I)
  const monthlyRate = isCash ? 0 : derived.interestRate / 100 / 12;
  const totalMonths = 30 * 12; // 30-year term
  const monthlyPI = (!isCash && monthlyRate > 0)
    ? derived.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  const results: BreakevenYear[] = [];
  let cumCashInvested = initialCash;
  let cumRentProfit = 0;
  let loanBalance = derived.loanAmount;

  for (let y = 1; y <= inputs.years; y++) {
    // Property value
    const propertyValue = Math.round(price * Math.pow(1 + capGrowth, y));

    // Rent grows
    const annualRent = Math.round(derived.ltrWeekly * 52 * Math.pow(1 + rentGrowth, y));
    const netRent = Math.round(annualRent * (1 - VACANCY_RATE / 100));

    // Expenses grow with inflation
    const holdingCosts = Math.round(derived.annualHolding * Math.pow(1 + expInflation, y));

    // Loan
    let interestCost = 0;
    let principalPaid = 0;
    if (!isCash && loanBalance > 0) {
      if (inputs.isInterestOnly) {
        interestCost = Math.round(loanBalance * derived.interestRate / 100);
      } else {
        // P&I: calculate interest on remaining balance, principal is the rest
        const annualPayment = monthlyPI * 12;
        interestCost = Math.round(loanBalance * derived.interestRate / 100);
        principalPaid = Math.min(Math.round(annualPayment - interestCost), loanBalance);
        loanBalance = Math.max(0, loanBalance - principalPaid);
      }
    }

    const annualExpenses = holdingCosts + interestCost;
    const netCashflow = netRent - annualExpenses;
    cumRentProfit += netCashflow;

    // If negative cashflow, that's additional cash invested
    if (netCashflow < 0) {
      cumCashInvested += Math.abs(netCashflow);
    }

    const equity = propertyValue - loanBalance;
    const capitalGain = propertyValue - price;
    const totalReturn = capitalGain + cumRentProfit;
    const cumulativeNetPosition = equity - cumCashInvested;
    const roiPercent = cumCashInvested > 0 ? round2((totalReturn / cumCashInvested) * 100) : 0;

    results.push({
      year: y,
      propertyValue,
      loanBalance: Math.round(loanBalance),
      equity: Math.round(equity),
      annualRent,
      annualExpenses,
      netCashflow,
      cumulativeCashInvested: Math.round(cumCashInvested),
      cumulativeNetPosition: Math.round(cumulativeNetPosition),
      cumulativeRentProfit: Math.round(cumRentProfit),
      capitalGain: Math.round(capitalGain),
      totalReturn: Math.round(totalReturn),
      roiPercent,
    });
  }

  return results;
}

// ─── Mortgage Calculator ─────────────────────────────────────────────────────

export function calculateMortgage(
  purchasePrice: number,
  depositAmount: number,
  annualRate: number,
  termYears: number
): MortgageResult {
  const loanAmount = Math.max(0, purchasePrice - depositAmount);
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;
  const lvr = purchasePrice > 0 ? round2((loanAmount / purchasePrice) * 100) : 0;

  let monthlyPI = 0;
  let totalInterestPI = 0;
  if (loanAmount > 0 && monthlyRate > 0 && totalMonths > 0) {
    monthlyPI = Math.round(
      loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
    totalInterestPI = monthlyPI * totalMonths - loanAmount;
  }

  const monthlyIO = Math.round(loanAmount * monthlyRate);
  const totalInterestIO = monthlyIO * totalMonths;

  return {
    loanAmount,
    monthlyPI,
    monthlyIO,
    totalInterestPI,
    totalInterestIO,
    lvr,
    lmiRequired: lvr > 80,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
