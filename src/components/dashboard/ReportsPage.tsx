"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  ArrowUpFromLine,
  TrendingUp,
  Heart,
  ChevronDown,
  FileSpreadsheet,
  FilePieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportType = "giving-summary" | "charity-breakdown" | "transaction-export" | "annual-statement";
type ReportFormat = "pdf" | "csv";
type ReportStatus = "ready" | "generating";

type Report = {
  id: string;
  type: ReportType;
  label: string;
  description: string;
  period: string;
  generatedDate: string;
  format: ReportFormat;
  status: ReportStatus;
  sizeKb: number;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const REPORTS: Report[] = [
  { id: "r1", type: "annual-statement",    label: "Annual Giving Statement",      description: "Full summary of all givings and disbursements for the financial year.", period: "FY 2024–25",       generatedDate: "1 Jul 2025",  format: "pdf", status: "ready",      sizeKb: 284 },
  { id: "r2", type: "giving-summary",      label: "Giving Summary — Q1 2026",     description: "Aggregated giving totals by charity and package for Q1.",               period: "Jan–Mar 2026",     generatedDate: "2 Apr 2026",  format: "pdf", status: "ready",      sizeKb: 142 },
  { id: "r3", type: "charity-breakdown",   label: "Charity Allocation Report",     description: "Breakdown of allocation percentages and amounts per charity.",           period: "Jan–Mar 2026",     generatedDate: "2 Apr 2026",  format: "pdf", status: "ready",      sizeKb: 98  },
  { id: "r4", type: "transaction-export",  label: "Transaction Export — March",    description: "Full transaction log including inflows, disbursements, and fees.",       period: "Mar 2026",         generatedDate: "1 Apr 2026",  format: "csv", status: "ready",      sizeKb: 56  },
  { id: "r5", type: "transaction-export",  label: "Transaction Export — February", description: "Full transaction log including inflows, disbursements, and fees.",       period: "Feb 2026",         generatedDate: "1 Mar 2026",  format: "csv", status: "ready",      sizeKb: 48  },
  { id: "r6", type: "giving-summary",      label: "Giving Summary — Q4 2025",     description: "Aggregated giving totals by charity and package for Q4.",               period: "Oct–Dec 2025",     generatedDate: "3 Jan 2026",  format: "pdf", status: "ready",      sizeKb: 138 },
];

const typeConfig: Record<ReportType, { icon: React.ElementType; color: string; bg: string }> = {
  "giving-summary":     { icon: TrendingUp,      color: "text-blue-600",    bg: "bg-blue-50"    },
  "charity-breakdown":  { icon: Heart,            color: "text-emerald-600", bg: "bg-emerald-50" },
  "transaction-export": { icon: FileSpreadsheet,  color: "text-violet-600",  bg: "bg-violet-50"  },
  "annual-statement":   { icon: FilePieChart,     color: "text-amber-600",   bg: "bg-amber-50"   },
};

const formatConfig: Record<ReportFormat, { label: string; cls: string }> = {
  pdf: { label: "PDF", cls: "text-red-700 bg-red-50 border-red-200"     },
  csv: { label: "CSV", cls: "text-green-700 bg-green-50 border-green-200" },
};

const periodOptions = ["All Time", "This Financial Year", "Last Financial Year", "Last 6 Months", "Last 3 Months"] as const;
type PeriodFilter = typeof periodOptions[number];

const typeFilterOptions = [
  { value: "all",                 label: "All" },
  { value: "giving-summary",      label: "Giving Summaries" },
  { value: "charity-breakdown",   label: "Charity Breakdown" },
  { value: "transaction-export",  label: "Transaction Exports" },
  { value: "annual-statement",    label: "Annual Statements" },
] as const;
type TypeFilter = typeof typeFilterOptions[number]["value"];

// ─── Generate Report Modal ────────────────────────────────────────────────────

const reportTemplates: { type: ReportType; label: string; description: string }[] = [
  { type: "giving-summary",     label: "Giving Summary",       description: "Aggregated giving totals by charity and package." },
  { type: "charity-breakdown",  label: "Charity Allocation",   description: "Allocation percentages and amounts per charity."  },
  { type: "transaction-export", label: "Transaction Export",   description: "Full log of inflows, disbursements, and fees."    },
  { type: "annual-statement",   label: "Annual Statement",     description: "Full year summary for compliance and records."    },
];

const periodLabels = ["This Month", "Last 3 Months", "Last 6 Months", "This Financial Year", "Last Financial Year"];

function GenerateModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: (r: Report) => void }) {
  const [selectedType, setSelectedType] = useState<ReportType>("giving-summary");
  const [selectedPeriod, setSelectedPeriod] = useState(periodLabels[2]);
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [open, setOpen] = useState(false);

  const submit = () => {
    const template = reportTemplates.find((t) => t.type === selectedType)!;
    const cfg = typeConfig[selectedType];
    onGenerate({
      id: `r${Date.now()}`,
      type: selectedType,
      label: `${template.label} — ${selectedPeriod}`,
      description: template.description,
      period: selectedPeriod,
      generatedDate: "8 Apr 2026",
      format,
      status: "ready",
      sizeKb: Math.floor(Math.random() * 200 + 50),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }} transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Generate Report</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Choose a report type, period, and format.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        {/* Report type */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Report type</p>
          <div className="grid grid-cols-2 gap-2">
            {reportTemplates.map((t) => {
              const cfg = typeConfig[t.type];
              const Icon = cfg.icon;
              const selected = selectedType === t.type;
              return (
                <button key={t.type} onClick={() => setSelectedType(t.type)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    selected ? `${cfg.bg} border-current ${cfg.color}` : "border-border hover:bg-muted/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selected ? cfg.color : "text-muted-foreground"}`} />
                  <div>
                    <p className={`text-xs font-semibold ${selected ? cfg.color : "text-foreground"}`}>{t.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Period */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Period</p>
          <div className="relative">
            <button onClick={() => setOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border text-sm text-foreground hover:bg-muted/40 transition-colors">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" />{selectedPeriod}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-border shadow-lg z-10 overflow-hidden">
                {periodLabels.map((p) => (
                  <button key={p} onClick={() => { setSelectedPeriod(p); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted/40 ${p === selectedPeriod ? "text-primary font-medium" : "text-foreground"}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Format</p>
          <div className="flex gap-2">
            {(["pdf", "csv"] as ReportFormat[]).map((f) => (
              <button key={f} onClick={() => setFormat(f)}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                  format === f ? formatConfig[f].cls + " border-current" : "border-border text-muted-foreground hover:bg-muted/40"
                }`}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={submit} className="flex-1 rounded-xl gap-2">
            <FileText className="w-4 h-4" /> Generate
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [reports, setReports]       = useState<Report[]>(REPORTS);
  const [generating, setGenerating] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [period, setPeriod]         = useState<PeriodFilter>("All Time");

  const filtered = reports.filter((r) => typeFilter === "all" || r.type === typeFilter);

  const handleGenerate = (r: Report) => setReports((prev) => [r, ...prev]);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Download giving summaries, transaction exports, and annual statements.
            </p>
          </div>
          <Button onClick={() => setGenerating(true)} className="rounded-xl gap-2 h-9 text-sm">
            <FileText className="w-4 h-4" /> Generate Report
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Reports",      value: String(reports.length),                                                    sub: "All time" },
            { label: "Annual Statements",  value: String(reports.filter((r) => r.type === "annual-statement").length),       sub: "For compliance" },
            { label: "Giving Summaries",   value: String(reports.filter((r) => r.type === "giving-summary").length),         sub: "Quarterly & annual" },
            { label: "Transaction Exports",value: String(reports.filter((r) => r.type === "transaction-export").length),     sub: "CSV downloads" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl border border-border px-5 py-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1.5 p-1 bg-muted/60 rounded-xl w-fit">
            {periodOptions.map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  period === p ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {typeFilterOptions.map((opt) => (
              <button key={opt.value} onClick={() => setTypeFilter(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  typeFilter === opt.value
                    ? "bg-primary text-white border-primary"
                    : "text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report list */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Available Reports</h2>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">No reports found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your filters or generate a new report.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filtered.map((report, i) => {
                const cfg    = typeConfig[report.type];
                const fmtCfg = formatConfig[report.format];
                const Icon   = cfg.icon;
                return (
                  <motion.div key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>

                    {/* Label + description */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{report.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{report.description}</p>
                    </div>

                    {/* Period */}
                    <div className="hidden md:block text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" /> {report.period}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Generated {report.generatedDate}</p>
                    </div>

                    {/* Size */}
                    <p className="hidden lg:block text-xs text-muted-foreground flex-shrink-0">{report.sizeKb} KB</p>

                    {/* Format badge */}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${fmtCfg.cls}`}>
                      {fmtCfg.label}
                    </span>

                    {/* Download */}
                    <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-8 text-xs flex-shrink-0">
                      <Download className="w-3.5 h-3.5" /> Download
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {generating && (
        <GenerateModal onClose={() => setGenerating(false)} onGenerate={handleGenerate} />
      )}
    </>
  );
}
