"use client";

import { useState } from "react";
import type { ScenarioAdjustments, SavedScenario } from "@/lib/scenarios";
import type { ScenarioMode } from "@/hooks/use-scenario";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Save, RotateCcw, Trash2 } from "lucide-react";

interface ScenarioBarProps {
  mode: ScenarioMode;
  setMode: (mode: ScenarioMode) => void;
  adjustments: ScenarioAdjustments;
  updateField: (field: keyof ScenarioAdjustments, value: number | boolean) => void;
  savedScenarios: SavedScenario[];
  saveCurrentScenario: (name: string) => string;
  loadScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
  resetToDefaults: () => void;
}

export function ScenarioBar({
  mode,
  setMode,
  adjustments,
  updateField,
  savedScenarios,
  saveCurrentScenario,
  loadScenario,
  deleteScenario,
  resetToDefaults,
}: ScenarioBarProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const isAdjusted = mode === "adjusted";

  function handleSave() {
    const name = scenarioName.trim();
    if (!name) return;
    saveCurrentScenario(name);
    setScenarioName("");
    setSaveDialogOpen(false);
  }

  return (
    <div className="border-b bg-card/50 px-4 py-2">
      <div className="flex flex-wrap items-center gap-4">
        {/* Left: Mode toggle */}
        <div className="flex items-center gap-2">
          <Label
            className={`text-xs ${!isAdjusted ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            Model
          </Label>
          <Switch
            checked={isAdjusted}
            onCheckedChange={(checked: boolean) =>
              setMode(checked ? "adjusted" : "model")
            }
            size="sm"
          />
          <Label
            className={`text-xs ${isAdjusted ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            Adjusted
          </Label>
        </div>

        {/* Center: Cash Purchase toggle — always visible */}
        <div className="flex items-center gap-2 border-l border-border/50 pl-4">
          <Switch
            checked={adjustments.isCashPurchase}
            onCheckedChange={(checked: boolean) =>
              updateField("isCashPurchase", checked)
            }
            size="sm"
          />
          <Label className={`text-xs ${adjustments.isCashPurchase ? "text-amber-400 font-semibold" : "text-muted-foreground"}`}>
            Cash Purchase
          </Label>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Scenario controls */}
        {isAdjusted && (
          <div className="flex items-center gap-2">
            {/* Load scenario */}
            <Select
              value={undefined}
              onValueChange={(val) => {
                if (val) loadScenario(val);
              }}
            >
              <SelectTrigger size="sm" className="w-[160px]">
                <SelectValue placeholder="Load scenario..." />
              </SelectTrigger>
              <SelectContent>
                {savedScenarios.length === 0 ? (
                  <SelectItem value="__empty" disabled>
                    No saved scenarios
                  </SelectItem>
                ) : (
                  savedScenarios.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex w-full items-center justify-between gap-2">
                        <span className="truncate">{s.name}</span>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Delete loaded scenario */}
            {savedScenarios.length > 0 && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  const last = savedScenarios[savedScenarios.length - 1];
                  if (last) deleteScenario(last.id);
                }}
              >
                <Trash2 className="size-3.5 text-muted-foreground" />
              </Button>
            )}

            {/* Save dialog */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger
                render={<Button variant="outline" size="sm" />}
              >
                <Save data-icon="inline-start" className="size-3.5" />
                Save
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Scenario</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <Label htmlFor="scenario-name" className="text-sm">
                    Scenario name
                  </Label>
                  <Input
                    id="scenario-name"
                    placeholder="e.g. Conservative offer"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                    }}
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSaveDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Reset */}
            <Button variant="ghost" size="sm" onClick={resetToDefaults}>
              <RotateCcw data-icon="inline-start" className="size-3.5" />
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
