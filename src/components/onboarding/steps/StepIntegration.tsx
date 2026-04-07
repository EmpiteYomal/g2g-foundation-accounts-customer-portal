"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Plug, RefreshCw, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "../OnboardingFlow";

type Props = {
  data: OnboardingData["integration"];
  onChange: (v: Partial<OnboardingData["integration"]>) => void;
  onNext: () => void;
  onBack: () => void;
};

const posSystems = [
  "Square",
  "Lightspeed",
  "Toast",
  "Shopify POS",
  "Vend",
  "Kounta",
  "Custom / API",
];

export function StepIntegration({ data, onChange, onNext, onBack }: Props) {
  const isValid = data.posSystem;

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Plug className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Connect your POS</h2>
        <p className="text-muted-foreground">
          Link your point-of-sale system so donations are captured automatically with every transaction.
        </p>
      </div>

      <div className="space-y-6">
        {/* POS Selection */}
        <div className="space-y-1.5">
          <Label>Point-of-sale system <span className="text-primary">*</span></Label>
          <Select value={data.posSystem} onValueChange={(v) => onChange({ posSystem: v ?? "" })}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Choose your POS system" />
            </SelectTrigger>
            <SelectContent>
              {posSystems.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {data.posSystem && (
          <div className="space-y-1.5">
            <Label htmlFor="apikey">API Key / Webhook Secret</Label>
            <Input
              id="apikey"
              type="password"
              placeholder="sk-••••••••••••••••"
              value={data.apiKey}
              onChange={(e) => onChange({ apiKey: e.target.value })}
              className="h-11 rounded-xl font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Found in your {data.posSystem} developer settings. We encrypt and store this securely.
            </p>
          </div>
        )}

        {/* Donation modes */}
        <div className="space-y-3">
          <Label>Donation collection method</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange({ roundupEnabled: !data.roundupEnabled })}
              className={cn(
                "flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all",
                data.roundupEnabled
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                data.roundupEnabled ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Round-up</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Round each transaction up to the next dollar and donate the difference.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ percentageEnabled: !data.percentageEnabled })}
              className={cn(
                "flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all",
                data.percentageEnabled
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                data.percentageEnabled ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Percentage of sales</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Donate a fixed percentage of each transaction automatically.
                </p>
              </div>
            </button>
          </div>

          {data.percentageEnabled && (
            <div className="flex items-center gap-3 pl-1">
              <Label htmlFor="pct" className="whitespace-nowrap text-sm">Percentage rate</Label>
              <div className="relative max-w-[120px]">
                <Input
                  id="pct"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={data.percentage}
                  onChange={(e) => onChange({ percentage: e.target.value })}
                  className="h-9 rounded-xl pr-7 text-sm"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
              <span className="text-xs text-muted-foreground">of each transaction</span>
            </div>
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
          className="rounded-full px-6 h-10 brand-gradient border-0 hover:opacity-90 transition-opacity shadow-md shadow-primary/20 disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
