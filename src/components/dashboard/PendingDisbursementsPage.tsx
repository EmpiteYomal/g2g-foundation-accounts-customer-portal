"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowUpFromLine,
  Hourglass,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Plus,
  X,
  Search,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  CalendarDays,
  Repeat,
  ShieldCheck,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import { downloadABA } from "@/lib/abaDownload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ───────────────────────────────────────────────────────────────────

type CharityStatus = "pending" | "processed" | "on_hold" | "reversed";
type PackageStatus = "pending_processing" | "partial" | "completed";

type CharityLine = {
  charity: string;
  pct: number;
  grossAmount: number;
  netAmount: number;
  status: CharityStatus;
  holdReason?: string;
};

type DisbursementPackage = {
  id: string;
  submittedDate: string;
  approvedBy: string;
  totalGross: number;
  adminFeePct: number;
  adminFeeAmount: number;
  netTotal: number;
  status: PackageStatus;
  charities: CharityLine[];
};

type ScoreItem = { label: string; score: number; max: number; description: string };
type ScoreSection = { label: string; score: number; max: number; items: ScoreItem[] };
type CharityScore = { total: number; maxTotal: number; sections: ScoreSection[] };

type ApprovedCharity = {
  id: string;
  name: string;
  category: string;
  abn: string;
  location: string;
  score: CharityScore;
};

type SelectedCharity = ApprovedCharity & { allocation: number };

type DistributionForm = {
  charities: SelectedCharity[];
  amount: string;
  frequency: "one-time" | "recurring";
  startDate: string;
  visibility: "public" | "anonymous";
};

// ─── Static data ─────────────────────────────────────────────────────────────

function makeScore(
  finItems: [number, string, number, string][],
  progItems: [number, string, number, string][],
  govItems: [number, string, number, string][],
  resItems: [number, string, number, string][]
): CharityScore {
  const toSection = (label: string, max: number, items: [number, string, number, string][]): ScoreSection => ({
    label,
    score: items.reduce((s, i) => s + i[0], 0),
    max,
    items: items.map(([score, itemLabel, itemMax, description]) => ({ score, label: itemLabel, max: itemMax, description })),
  });
  const sections = [
    toSection("Financial Health", 3, finItems),
    toSection("Program Effectiveness", 3, progItems),
    toSection("Governance & Transparency", 2, govItems),
    toSection("Resilience & Risk Management", 2, resItems),
  ];
  return { total: sections.reduce((s, sec) => s + sec.score, 0), maxTotal: 10, sections };
}

const APPROVED_CHARITIES: ApprovedCharity[] = [
  {
    id: "c1", name: "Red Cross Australia", category: "Humanitarian", abn: "50 169 561 394", location: "Melbourne, VIC",
    score: makeScore(
      [[1.5, "Revenue vs. Expenses", 1.5, "Operates close to break-even with strong funding reserves."], [1.5, "Asset to Liability Ratio", 1.5, "Strong asset base relative to liabilities."]],
      [[2, "Program Reach", 2, "Serves millions across disaster relief, blood services, and support."], [1.5, "Described Impact & Outcomes", 1.5, "Well-documented outcomes with annual impact reports."]],
      [[2, "Reporting & Compliance", 2, "Fully ACNC-registered with audited financials published annually."]],
      [[1.5, "Handling of Unforeseen Circumstances", 2, "Demonstrated resilience during COVID-19 and natural disasters."]]
    ),
  },
  {
    id: "c2", name: "WHO Foundation", category: "Global Health", abn: "—", location: "Geneva (Intl)",
    score: makeScore(
      [[1, "Revenue vs. Expenses", 1.5, "Operates with a surplus; reliant on donor pledges."], [1, "Asset to Liability Ratio", 1.5, "Moderate asset base; liabilities managed within policy."]],
      [[2, "Program Reach", 2, "Global health initiatives across 194 member states."], [1, "Described Impact & Outcomes", 1.5, "Impact metrics reported but lag by 12–18 months."]],
      [[1.5, "Reporting & Compliance", 2, "Annual reports published; some disclosure gaps noted."]],
      [[1, "Handling of Unforeseen Circumstances", 2, "COVID-19 response highlighted coordination challenges."]]
    ),
  },
  {
    id: "c3", name: "ACLU Foundation", category: "Civil Liberties", abn: "—", location: "New York (Intl)",
    score: makeScore(
      [[1, "Revenue vs. Expenses", 1.5, "Modest surplus; heavily litigation-funded."], [1, "Asset to Liability Ratio", 1.5, "Stable balance sheet with endowment backing."]],
      [[1.5, "Program Reach", 2, "Cases impact millions through landmark rulings."], [0.5, "Described Impact & Outcomes", 1.5, "Outcomes difficult to quantify; litigation timelines variable."]],
      [[1, "Reporting & Compliance", 2, "US-based reporting standards; limited international disclosure."]],
      [[0.5, "Handling of Unforeseen Circumstances", 2, "Limited evidence of risk-management frameworks."]]
    ),
  },
  {
    id: "c4", name: "Salvation Army", category: "Community", abn: "42 609 278 633", location: "Sydney, NSW",
    score: makeScore(
      [[1.5, "Revenue vs. Expenses", 1.5, "Consistent surplus reinvested into community programs."], [1, "Asset to Liability Ratio", 1.5, "Large property holdings offset by operational debt."]],
      [[2, "Program Reach", 2, "Reaches over 1M Australians annually across 400+ centres."], [1, "Described Impact & Outcomes", 1.5, "Impact reporting present but inconsistent across divisions."]],
      [[1.5, "Reporting & Compliance", 2, "ACNC-registered; audited financials publicly available."]],
      [[1.5, "Handling of Unforeseen Circumstances", 2, "Strong disaster-response track record over decades."]]
    ),
  },
  {
    id: "c5", name: "Alzheimer's Australia", category: "Health Research", abn: "79 625 733 633", location: "Canberra, ACT",
    score: makeScore(
      [[1, "Revenue vs. Expenses", 1.5, "Operates at a slight deficit; dependent on government grants."], [1, "Asset to Liability Ratio", 1.5, "Adequate asset base; limited liquid reserves."]],
      [[1.5, "Program Reach", 2, "Supports ~400K Australians living with dementia."], [0.5, "Described Impact & Outcomes", 1.5, "Research outcomes published but program impact harder to measure."]],
      [[1, "Reporting & Compliance", 2, "ACNC registered; some annual report delays observed."]],
      [[0.5, "Handling of Unforeseen Circumstances", 2, "Limited published continuity or risk framework."]]
    ),
  },
  {
    id: "c6", name: "Beyond Blue", category: "Mental Health", abn: "87 093 865 840", location: "Melbourne, VIC",
    score: makeScore(
      [[1.5, "Revenue vs. Expenses", 1.5, "Strong government and corporate funding with small surplus."], [1.5, "Asset to Liability Ratio", 1.5, "Healthy asset base with minimal liabilities."]],
      [[2, "Program Reach", 2, "3M+ website visits/month; crisis line handles 300K contacts/year."], [1.5, "Described Impact & Outcomes", 1.5, "Evidence-based programs with third-party evaluation."]],
      [[2, "Reporting & Compliance", 2, "ACNC registered; Best Practice Governance certified."]],
      [[1.5, "Handling of Unforeseen Circumstances", 2, "Scaled operations effectively during COVID-19 crisis spike."]]
    ),
  },
  {
    id: "c7", name: "Cancer Council", category: "Health Research", abn: "51 116 463 846", location: "Sydney, NSW",
    score: makeScore(
      [[1.5, "Revenue vs. Expenses", 1.5, "Consistent surplus; diversified fundraising base."], [1, "Asset to Liability Ratio", 1.5, "Good asset coverage; property portfolio well managed."]],
      [[2, "Program Reach", 2, "Australia-wide research, prevention, and support programs."], [1.5, "Described Impact & Outcomes", 1.5, "Annual impact reports with measurable research milestones."]],
      [[2, "Reporting & Compliance", 2, "ACNC registered; full financial disclosure each year."]],
      [[1, "Handling of Unforeseen Circumstances", 2, "Adapted clinical-trial programs during COVID-19."]]
    ),
  },
  {
    id: "c8", name: "Oxfam Australia", category: "Poverty Relief", abn: "18 055 208 636", location: "Melbourne, VIC",
    score: makeScore(
      [[0.5, "Revenue vs. Expenses", 1.5, "Recent operating deficit; restructuring underway."], [1, "Asset to Liability Ratio", 1.5, "Asset base declining following restructure."]],
      [[1.5, "Program Reach", 2, "Active in 20+ countries; strong gender-equality focus."], [1, "Described Impact & Outcomes", 1.5, "Outcome evidence strong internationally, weaker domestically."]],
      [[1.5, "Reporting & Compliance", 2, "ACNC registered; independent audit completed annually."]],
      [[0.5, "Handling of Unforeseen Circumstances", 2, "Staff reductions raised concerns over program continuity."]]
    ),
  },
];

const PACKAGES: DisbursementPackage[] = [
  {
    id: "GIVING-221",
    submittedDate: "31 Mar 2026",
    approvedBy: "Jane Smith (Trustee)",
    totalGross: 5000,
    adminFeePct: 10,
    adminFeeAmount: 500,
    netTotal: 4500,
    status: "partial",
    charities: [
      { charity: "Red Cross Australia", pct: 20, grossAmount: 1000, netAmount: 900,  status: "processed" },
      { charity: "ACLU",                pct: 70, grossAmount: 3500, netAmount: 3150, status: "processed" },
      { charity: "WHO",                 pct: 10, grossAmount:  500, netAmount:  450, status: "reversed", holdReason: "Charity compliance hold — missing accreditation documents" },
    ],
  },
  {
    id: "GIVING-208",
    submittedDate: "28 Feb 2026",
    approvedBy: "Jane Smith (Trustee)",
    totalGross: 2990,
    adminFeePct: 10,
    adminFeeAmount: 299,
    netTotal: 2691,
    status: "partial",
    charities: [
      { charity: "Red Cross Australia", pct: 60, grossAmount: 1794, netAmount: 1614.60, status: "processed" },
      { charity: "Salvation Army",      pct: 30, grossAmount:  897, netAmount:  807.30, status: "processed" },
      { charity: "Beyond Blue",         pct: 10, grossAmount:  299, netAmount:  269.10, status: "pending" },
    ],
  },
  {
    id: "GIVING-198",
    submittedDate: "31 Jan 2026",
    approvedBy: "Jane Smith (Trustee)",
    totalGross: 2750,
    adminFeePct: 10,
    adminFeeAmount: 275,
    netTotal: 2475,
    status: "completed",
    charities: [
      { charity: "Red Cross Australia", pct: 60, grossAmount: 1650, netAmount: 1485, status: "processed" },
      { charity: "Salvation Army",      pct: 40, grossAmount: 1100, netAmount:  990, status: "processed" },
    ],
  },
];

const ADMIN_FEE_PCT = 10;
const STEPS = ["Select Charities", "Details", "Review & Submit"];

// ─── Config maps ─────────────────────────────────────────────────────────────

const pkgStatusConfig: Record<PackageStatus, { label: string; icon: React.ElementType; cls: string }> = {
  pending_processing: { label: "Pending Processing",  icon: Clock,         cls: "text-amber-800 bg-amber-50 border-amber-200" },
  partial:            { label: "Partially Processed", icon: AlertCircle,   cls: "text-orange-800 bg-orange-50 border-orange-200" },
  completed:          { label: "Completed",           icon: CheckCircle2,  cls: "text-emerald-800 bg-emerald-50 border-emerald-200" },
};

const charityStatusConfig: Record<CharityStatus, { label: string; icon: React.ElementType; cls: string }> = {
  pending:   { label: "Pending",   icon: Clock,        cls: "text-amber-800 bg-amber-50 border-amber-200" },
  processed: { label: "Processed", icon: CheckCircle2, cls: "text-emerald-800 bg-emerald-50 border-emerald-200" },
  on_hold:   { label: "On Hold",   icon: Clock,        cls: "text-orange-800 bg-orange-50 border-orange-200" },
  reversed:  { label: "Reversed",  icon: RefreshCw,    cls: "text-violet-800 bg-violet-50 border-violet-200" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `AUD ${n.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
}

function fmtShort(n: number) {
  return `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
}

// ─── New Distribution Modal ───────────────────────────────────────────────────

function NewDistributionModal({ onClose, onSubmit, isIndividual = false }: { onClose: () => void; onSubmit: () => void; isIndividual?: boolean }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [catSearch, setCatSearch] = useState("");
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [scoreTooltip, setScoreTooltip] = useState<{ charity: ApprovedCharity; rect: DOMRect } | null>(null);
  const [form, setForm] = useState<DistributionForm>({
    charities: [],
    amount: "",
    frequency: "one-time",
    startDate: "",
    visibility: "public",
  });

  const ALL_CATEGORIES = useMemo(
    () => Array.from(new Set(APPROVED_CHARITIES.map((c) => c.category))).sort(),
    []
  );

  const filteredCharities = useMemo(() => {
    const q = search.toLowerCase();
    return APPROVED_CHARITIES.filter(
      (c) =>
        !form.charities.find((s) => s.id === c.id) &&
        (categoryFilter ? c.category === categoryFilter : true) &&
        (c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.abn.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q))
    );
  }, [search, categoryFilter, form.charities]);

  const totalAlloc = form.charities.reduce((s, c) => s + c.allocation, 0);
  const allocValid = form.charities.length > 0 && totalAlloc === 100;

  const amount = parseFloat(form.amount) || 0;
  const adminFee = amount * (ADMIN_FEE_PCT / 100);
  const netAmount = amount - adminFee;

  const addCharity = (c: ApprovedCharity) => {
    const remaining = 100 - totalAlloc;
    setForm((f) => ({
      ...f,
      charities: [...f.charities, { ...c, allocation: Math.max(0, remaining) }],
    }));
    setSearch("");
  };

  const removeCharity = (id: string) => {
    setForm((f) => ({ ...f, charities: f.charities.filter((c) => c.id !== id) }));
  };

  const updateAllocation = (id: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setForm((f) => ({
      ...f,
      charities: f.charities.map((c) => (c.id === id ? { ...c, allocation: num } : c)),
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit();
  };

  const canGoNext = () => {
    if (step === 0) return allocValid;
    if (step === 1) return amount > 0 && form.startDate;
    return true;
  };

  const allocColor =
    totalAlloc === 100
      ? "bg-emerald-500"
      : totalAlloc > 100
      ? "bg-red-500"
      : "bg-amber-400";

  const allocLabel =
    totalAlloc === 100
      ? "100% — ready"
      : totalAlloc > 100
      ? `${totalAlloc}% — over by ${totalAlloc - 100}%`
      : totalAlloc === 0
      ? "Add charities below"
      : `${totalAlloc}% — ${100 - totalAlloc}% remaining`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-foreground">New Giving</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {submitted ? (isIndividual ? "Submitted to G2G" : "Submitted for trustee approval") : `Step ${step + 1} of ${STEPS.length} — ${STEPS[step]}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicators */}
        {!submitted && (
          <div className="flex items-center gap-0 px-6 py-3 border-b border-border flex-shrink-0">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                    i < step
                      ? "bg-primary border-primary text-white"
                      : i === step
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-primary" : i < step ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── Success ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center py-8 gap-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Giving submitted!</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                    {isIndividual
                      ? "Your giving has been submitted directly to G2G for processing."
                      : "Your giving has been sent to the trustee for approval. Once approved, it will be submitted to G2G for processing."}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-2xl border border-border p-5 w-full text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground font-medium">
                      {isIndividual ? "Submitted to G2G for processing" : "Awaiting trustee approval — Jane Smith"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ArrowUpFromLine className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {form.charities.length} {form.charities.length === 1 ? "charity" : "charities"} · {fmtShort(amount)} total · {fmtShort(netAmount)} net after fee
                    </span>
                  </div>
                </div>
                <Button onClick={onClose} className="rounded-full px-8 h-10 bg-primary hover:bg-primary/90">
                  Done
                </Button>
              </motion.div>
            ) : step === 0 ? (
              /* ── Step 1: Select Charities ── */
              <motion.div key="step0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Select charities to distribute to</p>
                  <p className="text-xs text-muted-foreground">Only G2G-approved charities are shown. Set the allocation % for each.</p>
                </div>

                {/* Selected charities */}
                {form.charities.length > 0 && (
                  <div className="space-y-2">
                    {/* Allocation bar */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground font-medium">Total allocation</span>
                      <span className={`text-xs font-semibold ${totalAlloc === 100 ? "text-emerald-700" : totalAlloc > 100 ? "text-red-600" : "text-amber-700"}`}>
                        {allocLabel}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full transition-colors ${allocColor}`}
                        animate={{ width: `${Math.min(totalAlloc, 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {form.charities.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.category} · {c.location}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="relative w-20">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={c.allocation}
                              onChange={(e) => updateAllocation(c.id, e.target.value)}
                              className="h-8 rounded-lg text-sm pr-6 text-right font-semibold"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                          </div>
                          <button
                            onClick={() => removeCharity(c.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Charity search */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Search G2G-approved charities</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Name, category, ABN, location…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-10 rounded-xl text-sm"
                    />
                  </div>

                  {/* Category filter dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setCatDropdownOpen((v) => !v); setCatSearch(""); }}
                      className={`flex items-center justify-between gap-2 w-full h-9 px-3 rounded-xl border text-sm transition-colors ${
                        categoryFilter
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{categoryFilter ?? "Filter by category"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {categoryFilter && (
                          <span
                            role="button"
                            onClick={(e) => { e.stopPropagation(); setCategoryFilter(null); setCatDropdownOpen(false); }}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </span>
                        )}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catDropdownOpen ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {catDropdownOpen && (
                      <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-xl border border-border shadow-lg overflow-hidden">
                        <div className="p-2 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <input
                              autoFocus
                              value={catSearch}
                              onChange={(e) => setCatSearch(e.target.value)}
                              placeholder="Search categories…"
                              className="w-full pl-7 pr-3 h-8 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                          </div>
                        </div>
                        <div className="max-h-44 overflow-y-auto">
                          <button
                            type="button"
                            onClick={() => { setCategoryFilter(null); setCatDropdownOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${!categoryFilter ? "font-semibold text-primary" : "text-muted-foreground"}`}
                          >
                            All categories
                          </button>
                          {ALL_CATEGORIES.filter((c) => c.toLowerCase().includes(catSearch.toLowerCase())).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => { setCategoryFilter(cat); setCatDropdownOpen(false); }}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${categoryFilter === cat ? "font-semibold text-primary" : "text-foreground"}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="max-h-52 overflow-y-auto rounded-xl border border-border divide-y divide-border/60">
                    {filteredCharities.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No charities found</p>
                    ) : (
                      filteredCharities.map((c) => {
                        const s = c.score;
                        const pct = s.total / s.maxTotal;
                        const pillCls = pct >= 0.7 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : pct >= 0.4 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200";
                        return (
                          <button
                            key={c.id}
                            onClick={() => addCharity(c)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.category} · {c.location} · ABN {c.abn}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border cursor-help ${pillCls}`}
                                onMouseEnter={(e) => { e.stopPropagation(); setScoreTooltip({ charity: c, rect: e.currentTarget.getBoundingClientRect() }); }}
                                onMouseLeave={() => setScoreTooltip(null)}
                                onClick={(e) => e.stopPropagation()}
                              >
                                ★ {s.total}/{s.maxTotal}
                              </span>
                              <Plus className="w-4 h-4 text-primary" />
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            ) : step === 1 ? (
              /* ── Step 2: Distribution Details ── */
              <motion.div key="step1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Total amount to distribute <span className="text-primary">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">This is the gross amount before the G2G admin fee ({ADMIN_FEE_PCT}%) is deducted.</p>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">AUD</span>
                    <Input
                      type="number"
                      min={1}
                      step={0.01}
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                      className="pl-14 h-11 rounded-xl text-base font-semibold"
                    />
                  </div>
                  {amount > 0 && (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 border border-border text-sm flex-wrap">
                      <div>
                        <span className="text-muted-foreground text-xs">Admin fee ({ADMIN_FEE_PCT}%)</span>
                        <p className="font-semibold text-rose-700">−{fmtShort(adminFee)}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <span className="text-muted-foreground text-xs">Net for charities</span>
                        <p className="font-semibold text-emerald-700">{fmtShort(netAmount)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Frequency</Label>
                  <div className="flex gap-3">
                    {(["one-time", "recurring"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setForm((prev) => ({ ...prev, frequency: f }))}
                        className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          form.frequency === f
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        {f === "one-time" ? <CalendarDays className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                        {f === "one-time" ? "One-time" : "Recurring"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start date */}
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-semibold text-foreground">
                    {form.frequency === "one-time" ? "Distribution date" : "Start date"} <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="h-11 rounded-xl max-w-xs"
                  />
                </div>

                {/* Visibility */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Visibility</Label>
                  <p className="text-xs text-muted-foreground">Controls whether your organisation name appears on the charity&apos;s donation record.</p>
                  <div className="flex gap-3">
                    {(["public", "anonymous"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setForm((prev) => ({ ...prev, visibility: v }))}
                        className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          form.visibility === v
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        {v === "public" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {v === "public" ? "Public" : "Anonymous"}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── Step 3: Review ── */
              <motion.div key="step2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Review your giving</p>
                  <p className="text-xs text-muted-foreground">
                    {isIndividual
                      ? "Submitting will send this giving directly to G2G for processing."
                      : "Submitting will send this giving to your trustee for approval before it goes to G2G."}
                  </p>
                </div>

                {/* Summary card */}
                <div className="rounded-2xl border border-border overflow-hidden">
                  {/* Header */}
                  <div className="px-5 py-4 bg-muted/30 border-b border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Total Amount",  value: fmtShort(amount) },
                      { label: `Admin Fee (${ADMIN_FEE_PCT}%)`, value: `−${fmtShort(adminFee)}` },
                      { label: "Net to Charities", value: fmtShort(netAmount) },
                      { label: "Frequency", value: form.frequency === "one-time" ? "One-time" : "Recurring" },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-bold text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charity breakdown */}
                  <div className="divide-y divide-border/60">
                    {form.charities.map((c) => {
                      const gross  = (c.allocation / 100) * amount;
                      const net    = gross * (1 - ADMIN_FEE_PCT / 100);
                      return (
                        <div key={c.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.allocation}% allocation · {c.category}</p>
                          </div>
                          <div className="text-right flex-shrink-0 space-y-0.5">
                            <p className="text-xs text-muted-foreground">Gross {fmtShort(gross)}</p>
                            <p className="text-sm font-semibold text-emerald-700">{fmtShort(net)} net</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Meta footer */}
                  <div className="px-5 py-3.5 bg-muted/20 border-t border-border grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium text-foreground">{form.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Visibility</p>
                      <p className="text-sm font-medium text-foreground capitalize">{form.visibility}</p>
                    </div>
                  </div>
                </div>

                {/* Trustee / direct notice */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {isIndividual
                      ? "This giving will be submitted directly to G2G. G2G will deduct the admin fee and process each charity individually."
                      : <>This giving will be sent to <strong>Jane Smith (Trustee)</strong> for approval. Once approved, G2G will deduct the admin fee and process each charity individually.</>
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Score tooltip */}
        {scoreTooltip && (() => {
          const { charity, rect } = scoreTooltip;
          const s = charity.score;
          const top = rect.bottom + 8;
          const left = Math.min(rect.right - 280, window.innerWidth - 296);
          return (
            <div
              className="fixed z-[60] w-72 bg-white rounded-2xl border border-border shadow-xl p-4 space-y-3 pointer-events-none"
              style={{ top, left }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">Impact Score</p>
                <span className="text-base font-bold text-foreground">{s.total} / {s.maxTotal}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.total / s.maxTotal >= 0.7 ? "bg-emerald-500" : s.total / s.maxTotal >= 0.4 ? "bg-amber-400" : "bg-rose-500"}`}
                  style={{ width: `${(s.total / s.maxTotal) * 100}%` }}
                />
              </div>
              <div className="space-y-2.5">
                {s.sections.map((sec) => (
                  <div key={sec.label}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-foreground">{sec.label}</p>
                      <p className="text-xs font-semibold text-muted-foreground">{sec.score} / {sec.max}</p>
                    </div>
                    <div className="space-y-1">
                      {sec.items.map((item) => (
                        <div key={item.label} className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground">{item.label}</p>
                            <p className="text-[11px] text-muted-foreground leading-tight">{item.description}</p>
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground flex-shrink-0">{item.score} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Footer */}
        {!submitted && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20 flex-shrink-0">
            <Button
              variant="ghost"
              onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
              className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canGoNext()}
                className="rounded-full px-6 h-10 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="rounded-full px-6 h-10 bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                {isIndividual ? "Submit Giving" : "Submit for Approval"}
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Package card ─────────────────────────────────────────────────────────────

function PackageCard({ pkg }: { pkg: DisbursementPackage }) {
  const [expanded, setExpanded] = useState(false);
  const pCfg = pkgStatusConfig[pkg.status];
  const PIcon = pCfg.icon;

  const processedNet = pkg.charities.filter((c) => c.status === "processed").reduce((s, c) => s + c.netAmount, 0);
  const reversedNet  = pkg.charities.filter((c) => c.status === "reversed").reduce((s, c) => s + c.netAmount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-4 px-6 py-5 hover:bg-muted/20 transition-colors text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${pkg.status === "completed" ? "bg-emerald-50" : "bg-amber-50"}`}>
          {pkg.status === "completed"
            ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            : <Hourglass className="w-5 h-5 text-amber-600" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-foreground font-mono">{pkg.id}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${pCfg.cls}`}>
              <PIcon className="w-3 h-3" />
              {pCfg.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Submitted {pkg.submittedDate}
          </p>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Total: <span className="text-foreground font-semibold">{fmt(pkg.totalGross)}</span></span>
            <span className="text-xs text-muted-foreground">Admin fee ({pkg.adminFeePct}%): <span className="text-foreground font-semibold">−{fmt(pkg.adminFeeAmount)}</span></span>
            <span className="text-xs text-muted-foreground">Net distributed: <span className="text-emerald-700 font-semibold">{fmt(processedNet)}</span></span>
            {reversedNet > 0 && (
              <span className="text-xs text-muted-foreground">Reversed to account: <span className="text-violet-700 font-semibold">+{fmt(reversedNet)}</span></span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {/* Admin fee row */}
              <div className="px-6 py-3 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                    <span className="text-rose-600 text-xs font-bold">%</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">G2G Admin Fee ({pkg.adminFeePct}%)</p>
                    <p className="text-xs text-muted-foreground">Deducted before distribution</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-rose-700">−{fmt(pkg.adminFeeAmount)}</p>
                  <p className="text-xs text-muted-foreground">of {fmt(pkg.totalGross)}</p>
                </div>
              </div>

              {/* Charity lines */}
              <div className="divide-y divide-border/60">
                {pkg.charities.map((line) => {
                  const cCfg = charityStatusConfig[line.status];
                  const CIcon = cCfg.icon;
                  return (
                    <div key={line.charity} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            line.status === "processed" ? "bg-emerald-50" :
                            line.status === "on_hold"   ? "bg-orange-50" :
                            line.status === "reversed"  ? "bg-violet-50" : "bg-amber-50"
                          }`}>
                            <CIcon className={`w-3.5 h-3.5 ${
                              line.status === "processed" ? "text-emerald-600" :
                              line.status === "on_hold"   ? "text-orange-600" :
                              line.status === "reversed"  ? "text-violet-600" : "text-amber-600"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-foreground">{line.charity}</p>
                              <span className="text-xs text-muted-foreground">{line.pct}% allocation</span>
                            </div>
                            {line.holdReason && (
                              <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-1.5 mt-1.5 leading-relaxed">
                                {line.holdReason}
                              </p>
                            )}
                            {line.status === "reversed" && (
                              <p className="text-xs text-violet-700 mt-1">{fmt(line.netAmount)} returned to your Foundation Account</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 space-y-1">
                          <div>
                            <p className="text-xs text-muted-foreground">Gross</p>
                            <p className="text-sm font-medium text-foreground">{fmt(line.grossAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Net (after fee)</p>
                            <p className={`text-sm font-semibold ${
                              line.status === "processed" ? "text-emerald-700" :
                              line.status === "reversed"  ? "text-violet-700" : "text-foreground"
                            }`}>{fmt(line.netAmount)}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cCfg.cls}`}>
                            <CIcon className="w-3 h-3" />
                            {cCfg.label}
                          </span>
                          {line.status === "processed" && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => downloadABA({ packageId: pkg.id, charityName: line.charity, netAmount: line.netAmount })}
                                title="Download ABA file"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/5 px-2.5 py-1 rounded-lg transition-colors border border-primary/20 hover:border-primary/40"
                              >
                                <Download className="w-3 h-3" />
                                Download ABA
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals footer */}
              <div className="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-6 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground">Total submitted</p>
                    <p className="text-sm font-bold text-foreground">{fmt(pkg.totalGross)}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Net for charities</p>
                    <p className="text-sm font-bold text-foreground">{fmt(pkg.netTotal)}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Successfully distributed</p>
                    <p className="text-sm font-bold text-emerald-700">{fmt(processedNet)}</p>
                  </div>
                  {reversedNet > 0 && (
                    <>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Reversed to account</p>
                        <p className="text-sm font-bold text-violet-700">+{fmt(reversedNet)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function PendingDisbursementsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [isIndividual, setIsIndividual] = useState(false);

  useEffect(() => {
    setIsIndividual(localStorage.getItem("accountType") === "person");
  }, []);

  const pending   = PACKAGES.filter((p) => p.status !== "completed");
  const completed = PACKAGES.filter((p) => p.status === "completed");

  const totalPending = pending.reduce((s, p) => {
    const unprocessed = p.charities
      .filter((c) => c.status === "pending" || c.status === "on_hold")
      .reduce((cs, c) => cs + c.netAmount, 0);
    return s + unprocessed;
  }, 0);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Givings</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Givings submitted to G2G for processing
            </p>
          </div>
          <Button
            onClick={() => { setModalOpen(true); setJustSubmitted(false); }}
            className="rounded-xl gap-2 h-9 text-sm bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> New Giving
          </Button>
        </div>

        {/* Just-submitted banner */}
        <AnimatePresence>
          {justSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800 font-medium">
                {isIndividual
                  ? "Giving submitted — sent to G2G for processing."
                  : "Giving submitted — awaiting trustee approval from Jane Smith."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Awaiting Processing",
              value: `${pending.length} giving${pending.length !== 1 ? "s" : ""}`,
              sub: totalPending > 0 ? `${fmt(totalPending)} pending` : "All up to date",
              icon: Hourglass,
              color: "text-amber-600",
              bg: "bg-amber-50",
              border: "border-amber-100",
            },
            {
              label: "Total Distributed",
              value: fmt(PACKAGES.reduce((s, p) => s + p.netTotal, 0)),
              sub: `Across ${PACKAGES.length} giving${PACKAGES.length !== 1 ? "s" : ""}`,
              icon: CheckCircle2,
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              label: "Completed This Month",
              value: `${completed.length} giving${completed.length !== 1 ? "s" : ""}`,
              sub: `${fmt(completed.reduce((s, p) => s + p.totalGross, 0))} total distributed`,
              icon: CheckCircle2,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white rounded-2xl border ${card.border} p-5`}
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{card.label}</p>
              <p className="text-xl font-bold text-foreground mb-0.5">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed">
            <span className="font-semibold">How givings work: </span>
            {isIndividual
              ? "You submit a giving → G2G deducts the admin fee and runs compliance checks → each charity is processed individually. If a charity is put on hold, the net amount is reversed back to your Foundation Account."
              : "Your trustee approves a giving → G2G deducts the admin fee and runs compliance checks → each charity is processed individually. If a charity is put on hold, the net amount is reversed back to your Foundation Account."}
          </p>
        </div>

        {/* Active packages */}
        {pending.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Active Givings</h2>
            {pending.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        )}

        {/* Completed packages */}
        {completed.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">Completed</h2>
            {completed.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <NewDistributionModal
            isIndividual={isIndividual}
            onClose={() => setModalOpen(false)}
            onSubmit={() => {
              setModalOpen(false);
              setJustSubmitted(true);
              setTimeout(() => setJustSubmitted(false), 6000);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
