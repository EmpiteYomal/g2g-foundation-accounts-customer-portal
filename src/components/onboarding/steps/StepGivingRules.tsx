"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Heart, Plus, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "../OnboardingFlow";

type Props = {
  data: OnboardingData["givingRules"];
  onChange: (v: Partial<OnboardingData["givingRules"]>) => void;
  onNext: () => void;
  onBack: () => void;
};

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
];

const suggestedCharities = [
  "Red Cross Australia",
  "Salvation Army",
  "Beyond Blue",
  "Cancer Council",
  "Oxfam Australia",
  "RSPCA",
];

export function StepGivingRules({ data, onChange, onNext, onBack }: Props) {
  const totalAllocation = data.charities.reduce((sum, c) => sum + c.allocation, 0);
  const isValid = data.charities.length > 0 && totalAllocation === 100;

  const updateCharity = (index: number, field: "name" | "allocation", value: string | number) => {
    const updated = data.charities.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    onChange({ charities: updated });
  };

  const addCharity = () => {
    const remaining = 100 - totalAllocation;
    if (remaining > 0) {
      onChange({
        charities: [...data.charities, { name: "", allocation: Math.min(remaining, 10) }],
      });
    }
  };

  const removeCharity = (index: number) => {
    onChange({ charities: data.charities.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Set giving rules</h2>
        <p className="text-muted-foreground">
          Define how and when funds are distributed to your chosen charities.
        </p>
      </div>

      <div className="space-y-6">
        {/* Frequency */}
        <div className="space-y-1.5">
          <Label>Distribution frequency</Label>
          <div className="flex flex-wrap gap-2">
            {frequencies.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange({ frequency: f.value })}
                className={cn(
                  "px-4 py-2 rounded-full text-base font-medium border transition-all",
                  data.frequency === f.value
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Charity allocation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Charity allocation</Label>
            <div className={cn(
              "flex items-center gap-1.5 text-base font-medium px-3 py-1 rounded-full transition-colors",
              totalAllocation === 100
                ? "bg-green-50 text-green-700"
                : totalAllocation > 100
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-700"
            )}>
              {totalAllocation !== 100 && <AlertCircle className="w-3 h-3" />}
              {totalAllocation}% allocated
            </div>
          </div>

          {/* Allocation bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden flex gap-0.5">
            {data.charities.map((c, i) => (
              <div
                key={i}
                className="h-full transition-all rounded-full"
                style={{
                  width: `${c.allocation}%`,
                  backgroundColor: `hsl(${20 + i * 25}, 75%, ${55 - i * 5}%)`,
                }}
              />
            ))}
          </div>

          <div className="space-y-2.5">
            {data.charities.map((charity, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <Select value={charity.name} onValueChange={(v) => updateCharity(i, "name", v ?? "")}>
                    <SelectTrigger className="h-10 rounded-xl text-base">
                      <SelectValue placeholder="Select a charity" />
                    </SelectTrigger>
                    <SelectContent>
                      {suggestedCharities.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-24">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={charity.allocation}
                    onChange={(e) => updateCharity(i, "allocation", Number(e.target.value))}
                    className="h-10 rounded-xl pr-6 text-base text-center"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCharity(i)}
                  className="w-9 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {data.charities.length < 5 && (
            <button
              type="button"
              onClick={addCharity}
              className="flex items-center gap-2 text-base text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add charity
            </button>
          )}

          {totalAllocation !== 100 && data.charities.length > 0 && (
            <p className="text-base text-amber-600 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              Allocations must total exactly 100% to continue.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="rounded-full px-6 h-10 bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
