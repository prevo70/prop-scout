export interface ScenarioAdjustments {
  // Purchase price override
  purchasePrice?: number;
  // Acquisition overrides
  conveyancing?: number;
  legalFees?: number;
  buildingInspection?: number;
  pestInspection?: number;
  strataReport?: number;
  titleSearch?: number;
  mortgageRegistration?: number;
  transferRegistration?: number;
  loanApplicationFee?: number;
  depreciationSchedule?: number;
  // Holding overrides
  strataAnnual?: number;
  councilAnnual?: number;
  waterAnnual?: number;
  insurance?: number;
  pmPercent?: number;
  // Loan overrides
  depositPercent?: number;
  interestRate?: number;
  // Rental overrides
  rentWeekly?: number;
  strNightly?: number;
  strOccupancy?: number;
  // Growth rates
  strataIncrease?: number;
  councilIncrease?: number;
  rentGrowth?: number;
  capitalGrowth?: number;
  // Flags
  isCashPurchase: boolean;
}

export interface SavedScenario {
  id: string;
  name: string;
  slug: string;
  adjustments: ScenarioAdjustments;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_ADJUSTMENTS: ScenarioAdjustments = {
  isCashPurchase: false,
};

function storageKey(slug: string): string {
  return `propscout:scenarios:${slug}`;
}

export function getScenarios(slug: string): SavedScenario[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(slug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScenario(scenario: SavedScenario): void {
  const scenarios = getScenarios(scenario.slug);
  const idx = scenarios.findIndex((s) => s.id === scenario.id);
  if (idx >= 0) {
    scenarios[idx] = scenario;
  } else {
    scenarios.push(scenario);
  }
  localStorage.setItem(storageKey(scenario.slug), JSON.stringify(scenarios));
}

export function deleteScenario(slug: string, id: string): void {
  const scenarios = getScenarios(slug).filter((s) => s.id !== id);
  localStorage.setItem(storageKey(slug), JSON.stringify(scenarios));
}
