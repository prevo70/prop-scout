import { DEFAULT_ACQUISITION_COSTS, DEFAULT_LOAN } from "@/lib/constants";
import { calculateNswStampDuty, type BuyerType } from "./stamp-duty";

export type PropertyType =
  | "apartment"
  | "house"
  | "townhouse"
  | "land"
  | "commercial";

export interface AcquisitionCostInputs {
  purchasePrice: number;
  buyerType?: BuyerType;
  propertyType?: PropertyType;
  depositPercent?: number;
  isCashPurchase?: boolean;
  includeBuyersAgent?: boolean;
  buyersAgentPercent?: number;
  includeFinancialPlanner?: boolean;
  financialPlannerFee?: number;
}

export interface AcquisitionCostResult {
  purchasePrice: number;
  buyerType: BuyerType;
  depositPercent: number;
  isCashPurchase: boolean;
  lineItems: {
    stampDuty: number;
    stampDutySurcharge: number;
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
    buyersAgentFee: number;
    financialPlannerFee: number;
  };
  totalAcquisitionCosts: number;
  effectivePurchasePrice: number;
  depositAmount: number;
  loanAmount: number;
  totalCashRequired: number;
}

export function calculateAcquisitionCosts(
  inputs: AcquisitionCostInputs
): AcquisitionCostResult {
  const purchasePrice = Math.round(inputs.purchasePrice);
  const buyerType = inputs.buyerType ?? "investor";
  const isCashPurchase = inputs.isCashPurchase ?? false;
  const depositPercent = isCashPurchase
    ? 100
    : inputs.depositPercent ?? DEFAULT_LOAN.depositPercent;

  const stampDuty = calculateNswStampDuty(purchasePrice, buyerType);
  const isApartment = (inputs.propertyType ?? "apartment") === "apartment";
  const buyersAgentFee =
    inputs.includeBuyersAgent
      ? Math.round(purchasePrice * ((inputs.buyersAgentPercent ?? 2.5) / 100))
      : 0;
  const financialPlannerFee = inputs.includeFinancialPlanner
    ? Math.round(inputs.financialPlannerFee ?? 3_500)
    : 0;

  const lineItems = {
    stampDuty: stampDuty.transferDuty,
    stampDutySurcharge: stampDuty.foreignSurcharge,
    conveyancing: DEFAULT_ACQUISITION_COSTS.conveyancing,
    legalFees: DEFAULT_ACQUISITION_COSTS.legalFees,
    buildingInspection: DEFAULT_ACQUISITION_COSTS.buildingInspection,
    pestInspection: DEFAULT_ACQUISITION_COSTS.pestInspection,
    strataReport: isApartment ? DEFAULT_ACQUISITION_COSTS.strataReport : 0,
    titleSearch: DEFAULT_ACQUISITION_COSTS.titleSearch,
    mortgageRegistration: isCashPurchase ? 0 : Math.round(DEFAULT_ACQUISITION_COSTS.mortgageRegistration),
    transferRegistration: Math.round(DEFAULT_ACQUISITION_COSTS.transferRegistration),
    loanApplicationFee: isCashPurchase ? 0 : DEFAULT_ACQUISITION_COSTS.loanApplicationFee,
    depreciationSchedule: DEFAULT_ACQUISITION_COSTS.depreciationSchedule,
    buyersAgentFee,
    financialPlannerFee,
  };

  const totalAcquisitionCosts = Object.values(lineItems).reduce((sum, value) => sum + value, 0);
  const effectivePurchasePrice = purchasePrice + totalAcquisitionCosts;
  const depositAmount = isCashPurchase
    ? purchasePrice
    : Math.round(purchasePrice * (depositPercent / 100));
  const loanAmount = isCashPurchase ? 0 : Math.max(0, purchasePrice - depositAmount);
  const totalCashRequired = isCashPurchase
    ? purchasePrice + totalAcquisitionCosts
    : depositAmount + totalAcquisitionCosts;

  return {
    purchasePrice,
    buyerType,
    depositPercent,
    isCashPurchase,
    lineItems,
    totalAcquisitionCosts,
    effectivePurchasePrice,
    depositAmount,
    loanAmount,
    totalCashRequired,
  };
}
