"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, ShieldCheck, Plus, Trash2, AlertCircle, Info, Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
type GivingRulesData = {
  charities: { name: string; allocation: number }[];
  founderDeclared: boolean;
};

type Props = {
  data: GivingRulesData;
  onChange: (v: Partial<GivingRulesData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const CHARITIES = [
  "Australian Red Cross",
  "Salvation Army",
  "Beyond Blue",
  "Cancer Council Australia",
  "Oxfam Australia",
  "RSPCA Australia",
  "Lifeline Australia",
  "The Smith Family",
  "Médecins Sans Frontières",
  "World Vision Australia",
  "St Vincent de Paul Society",
  "Mission Australia",
  "Foodbank Australia",
  "Anglicare Australia",
  "Care Australia",
  "Amnesty International Australia",
  "Cerebral Palsy Alliance",
  "Guide Dogs Australia",
  "Hearing Australia",
  "Heart Foundation",
  "Kids Under Cover",
  "Leukaemia Foundation",
  "Make-A-Wish Australia",
  "Mater Foundation",
  "Peter MacCallum Cancer Centre",
  "Royal Flying Doctor Service",
  "Save the Children Australia",
  "Starlight Children's Foundation",
  "The Fred Hollows Foundation",
  "Variety Australia",
];

type CharityComboboxProps = {
  value: string;
  onChange: (v: string) => void;
  usedCharities: string[];
};

function CharityCombobox({ value, onChange, usedCharities }: CharityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = CHARITIES.filter(
    (c) =>
      c.toLowerCase().includes(search.toLowerCase()) &&
      (c === value || !usedCharities.includes(c))
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full h-10 px-3 rounded-xl border text-sm text-left flex items-center justify-between gap-2 transition-colors",
          open ? "border-primary ring-1 ring-primary" : "border-input hover:border-primary/40",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">{value || "Search charity…"}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-white shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search…"
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
            />
          </div>

          {/* Results */}
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No charities found.</p>
            ) : (
              filtered.map((charity) => (
                <button
                  key={charity}
                  type="button"
                  onClick={() => {
                    onChange(charity);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-primary/5 transition-colors"
                >
                  <span>{charity}</span>
                  {charity === value && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function StepGivingRules({ data, onChange, onNext, onBack }: Props) {
  const totalAllocation = data.charities.reduce((sum, c) => sum + c.allocation, 0);
  const isValid = data.founderDeclared && data.charities.length > 0 && totalAllocation === 100;

  const usedCharities = data.charities.map((c) => c.name);

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
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Compliance & charities</h2>
        <p className="text-muted-foreground">
          Choose which charities receive your donations and declare your account authority.
        </p>
      </div>

      <div className="space-y-7">
        {/* G2G as foundation explainer */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
          <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-blue-900">Good2Give holds your funds</p>
            <p className="text-xs text-blue-800 leading-relaxed">
              Good2Give acts as the DGR-endorsed giving vehicle for your Foundation Account. Donated funds are held securely by Good2Give and disbursed to your chosen charities according to the allocation below.
            </p>
          </div>
        </div>

        {/* Charity allocation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-foreground">
              Charity allocation <span className="text-primary">*</span>
            </Label>
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors",
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
          <p className="text-xs text-muted-foreground -mt-1">
            All charities must hold DGR-1 or DGR-2 status. Allocations must total 100%.
          </p>

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
                <CharityCombobox
                  value={charity.name}
                  onChange={(v) => updateCharity(i, "name", v)}
                  usedCharities={usedCharities}
                />
                <div className="relative w-24">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={charity.allocation}
                    onChange={(e) => updateCharity(i, "allocation", Number(e.target.value))}
                    className="h-10 rounded-xl pr-6 text-sm text-center"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
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
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add charity
            </button>
          )}

          {totalAllocation !== 100 && data.charities.length > 0 && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              Allocations must total exactly 100% to continue.
            </p>
          )}
        </div>

        {/* Account Founder Declaration */}
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-2xl border-2 transition-colors cursor-pointer",
            data.founderDeclared
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30"
          )}
          onClick={() => onChange({ founderDeclared: !data.founderDeclared })}
        >
          <div className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
            data.founderDeclared ? "bg-primary border-primary" : "border-border"
          )}>
            {data.founderDeclared && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Account Founder Declaration <span className="text-primary">*</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              I confirm I am over 18 years of age and legally authorised to establish this Foundation Account on behalf of the organisation.
            </p>
          </div>
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
