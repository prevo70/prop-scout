export const DEFAULT_ACQUISITION_COSTS = {
  conveyancing: 2000,
  legalFees: 2500,
  buildingInspection: 700,
  pestInspection: 400,
  strataReport: 300,
  titleSearch: 350,
  mortgageRegistration: 154.2,
  transferRegistration: 154.2,
  loanApplicationFee: 600,
  depreciationSchedule: 750,
} as const;

export const DEFAULT_HOLDING = {
  insurance: 1800,
  pmPercent: 8.5,
} as const;

export const DEFAULT_LOAN = {
  depositPercent: 20,
  interestRate: 6.1,
  loanTermYears: 30,
} as const;

export const DEFAULT_GROWTH_RATES = {
  strataIncrease: 3.0,
  councilIncrease: 2.5,
  waterIncrease: 2.5,
  rentGrowth: 3.0,
  capitalGrowth: 4.0,
} as const;

export const VACANCY_RATE = 3.5; // Sydney CBD default %
