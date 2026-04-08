"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Percent,
  Heart,
  BarChart3,
  Plus,
  Trash2,
  AlertCircle,
  Search,
  ChevronDown,
  Check,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Data ─────────────────────────────────────────────────────────────────────

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

const REPORT_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
];

// ── Default state (mirrors onboarding defaults) ────────────────────────────

const defaultConfig = {
  givingPercentage: "1",
  charities: [
    { name: "Red Cross Australia", allocation: 60 },
    { name: "Salvation Army", allocation: 40 },
  ] as { name: string; allocation: number }[],
  reportingFrequency: "monthly",
};

// ── Charity combobox ──────────────────────────────────────────────────────

function CharityCombobox({
  value,
  onChange,
  usedCharities,
}: {
  value: string;
  onChange: (v: string) => void;
  usedCharities: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
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
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        });
      }
    } else {
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest("[data-charity-dropdown]")
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dropdown = open ? (
    <div
      data-charity-dropdown
      style={dropdownStyle}
      className="rounded-xl border border-border bg-white shadow-lg overflow-hidden"
    >
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
      <div className="max-h-48 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">No charities found.</p>
        ) : (
          filtered.map((charity) => (
            <button
              key={charity}
              type="button"
              onClick={() => { onChange(charity); setOpen(false); }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-primary/5 transition-colors"
            >
              <span>{charity}</span>
              {charity === value && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        ref={triggerRef}
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
      {typeof document !== "undefined" && dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export function ConfigurationPage() {
  const [cfg, setCfg] = useState(defaultConfig);
  const [dirty, setDirty] = useState(false);

  const update = <K extends keyof typeof defaultConfig>(key: K, value: (typeof defaultConfig)[K]) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  // Charities helpers
  const totalAlloc = cfg.charities.reduce((sum, c) => sum + c.allocation, 0);
  const usedCharities = cfg.charities.map((c) => c.name);

  const updateCharity = (index: number, field: "name" | "allocation", value: string | number) => {
    const updated = cfg.charities.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    update("charities", updated);
  };

  const addCharity = () => {
    const remaining = 100 - totalAlloc;
    if (remaining > 0 && cfg.charities.length < 5) {
      update("charities", [...cfg.charities, { name: "", allocation: Math.min(remaining, 10) }]);
    }
  };

  const removeCharity = (index: number) => {
    update("charities", cfg.charities.filter((_, i) => i !== index));
  };

  const save = () => {
    setDirty(false);
    toast.success("Configuration saved", {
      description: "Your giving settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Configuration</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your giving rules, charity allocations, and integration settings.
          </p>
        </div>
        <Button
          onClick={save}
          disabled={!dirty || totalAlloc !== 100}
          className="rounded-xl bg-primary hover:bg-primary/90 text-white gap-2 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Save className="w-4 h-4" /> Save changes
        </Button>
      </div>

      {/* Giving rate */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Percent className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-semibold">Giving Rate</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The percentage of each sales transaction donated to your chosen charities.
          </p>
          <div className="flex items-center gap-3">
            <Label htmlFor="pct" className="whitespace-nowrap text-sm">Percentage of sales</Label>
            <div className="relative max-w-[120px]">
              <Input
                id="pct"
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={cfg.givingPercentage}
                onChange={(e) => update("givingPercentage", e.target.value)}
                className="h-10 rounded-xl pr-7 text-sm text-center"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
            <span className="text-sm text-muted-foreground">of each transaction</span>
          </div>
        </CardContent>
      </Card>

      {/* Charity allocations */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-600" />
              </div>
              <CardTitle className="text-sm font-semibold">Charity Allocations</CardTitle>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors",
              totalAlloc === 100
                ? "bg-green-50 text-green-700"
                : totalAlloc > 100
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-700"
            )}>
              {totalAlloc !== 100 && <AlertCircle className="w-3 h-3" />}
              {totalAlloc}% allocated
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose which DGR-endorsed charities receive your donations. Allocations must total 100%.
          </p>

          {/* Allocation bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden flex gap-0.5">
            {cfg.charities.map((c, i) => (
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
            {cfg.charities.map((charity, i) => (
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

          {cfg.charities.length < 5 && (
            <button
              type="button"
              onClick={addCharity}
              disabled={totalAlloc >= 100}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Plus className="w-4 h-4" /> Add charity
            </button>
          )}

          {totalAlloc !== 100 && cfg.charities.length > 0 && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              Allocations must total exactly 100% before saving.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reporting frequency */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <CardTitle className="text-sm font-semibold">Reporting</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            How often you receive donation summary reports.
          </p>
          <div className="space-y-1.5">
            <Label className="text-sm">Report frequency</Label>
            <Select value={cfg.reportingFrequency} onValueChange={(v) => update("reportingFrequency", v)}>
              <SelectTrigger className="h-10 rounded-xl max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_FREQUENCIES.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
