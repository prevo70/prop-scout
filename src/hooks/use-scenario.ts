"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Property } from "@/lib/data";
import {
  type ScenarioAdjustments,
  type SavedScenario,
  DEFAULT_ADJUSTMENTS,
  getScenarios,
  saveScenario as persistScenario,
  deleteScenario as removeScenario,
} from "@/lib/scenarios";
import { recalculate, type DerivedValues } from "@/lib/calculations";

export type ScenarioMode = "model" | "adjusted";

export function useScenario(property: Property) {
  const [mode, setMode] = useState<ScenarioMode>("model");
  const [adjustments, setAdjustments] = useState<ScenarioAdjustments>({ ...DEFAULT_ADJUSTMENTS });
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

  // Load saved scenarios on mount
  useEffect(() => {
    setSavedScenarios(getScenarios(property.slug));
  }, [property.slug]);

  // Derived values (memoized)
  const derived: DerivedValues = useMemo(
    () => recalculate(property, adjustments),
    [property, adjustments]
  );

  // The effective property: model returns base, adjusted returns derived overlay
  const effective: Property = useMemo(() => {
    if (mode === "model") return property;
    return {
      ...property,
      price: derived.purchasePrice,
      priceDisplay: derived.purchasePrice !== property.price
        ? `~${new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(derived.purchasePrice)}`
        : property.priceDisplay,
      stampDuty: derived.stampDuty,
      totalAcquisition: derived.totalAcquisition,
      deposit: derived.deposit,
      loanAmount: derived.loanAmount,
      totalCashRequired: derived.totalCashRequired,
      annualHolding: derived.annualHolding,
      ltrWeekly: derived.ltrWeekly,
      ltrAnnual: derived.ltrAnnual,
      ltrGrossYield: derived.ltrGrossYield,
      ltrNetYield: derived.ltrNetYield,
      strNightly: derived.strNightly,
      strOccupancy: derived.strOccupancy,
      strAnnualRevenue: derived.strAnnualRevenue,
      strGrossYield: derived.strGrossYield,
      interestRate: derived.interestRate,
      annualInterest: derived.annualInterest,
      annualCashflow: derived.annualCashflow,
      grossYield: derived.grossYield,
      netYield: derived.netYield,
      capRate: derived.capRate,
      cashOnCash: derived.cashOnCash,
    };
  }, [mode, property, derived]);

  const updateField = useCallback(
    (field: keyof ScenarioAdjustments, value: number | boolean) => {
      setAdjustments((prev) => ({ ...prev, [field]: value }));
      if (mode === "model") setMode("adjusted");
    },
    [mode]
  );

  const resetToDefaults = useCallback(() => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
  }, []);

  const saveCurrentScenario = useCallback(
    (name: string) => {
      const now = new Date().toISOString();
      const scenario: SavedScenario = {
        id: crypto.randomUUID(),
        name,
        slug: property.slug,
        adjustments: { ...adjustments },
        createdAt: now,
        updatedAt: now,
      };
      persistScenario(scenario);
      setSavedScenarios(getScenarios(property.slug));
      return scenario.id;
    },
    [property.slug, adjustments]
  );

  const loadScenario = useCallback(
    (id: string) => {
      const scenario = savedScenarios.find((s) => s.id === id);
      if (scenario) {
        setAdjustments({ ...scenario.adjustments });
        setMode("adjusted");
      }
    },
    [savedScenarios]
  );

  const deleteScenarioById = useCallback(
    (id: string) => {
      removeScenario(property.slug, id);
      setSavedScenarios(getScenarios(property.slug));
    },
    [property.slug]
  );

  return {
    mode,
    setMode,
    adjustments,
    derived,
    effective,
    updateField,
    resetToDefaults,
    savedScenarios,
    saveCurrentScenario,
    loadScenario,
    deleteScenario: deleteScenarioById,
  };
}
