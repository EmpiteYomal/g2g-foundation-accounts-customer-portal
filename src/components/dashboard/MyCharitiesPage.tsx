"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MapPin,
  AlertCircle,
  ChevronDown,
  ArrowUpFromLine,
  CheckCircle2,
  Clock,
  RefreshCw,
  Download,
} from "lucide-react";
import { downloadABA } from "@/lib/abaDownload";

// ─── Types ────────────────────────────────────────────────────────────────────

type MyCharity = {
  id: string;
  name: string;
  category: string;
  location: string;
  allocation: number;
  totalDonated: number;
  lastDonation: string;
  abn: string;
};

type GivingRecord = {
  packageId: string;
  date: string;
  allocationPct: number;
  grossAmount: number;
  netAmount: number;
  status: "processed" | "pending" | "reversed";
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALLOCATION_COLORS = [
  "#f97316",
  "#3b82f6",
  "#10b981",
  "#a855f7",
  "#f59e0b",
];

const GIVING_HISTORY: Record<string, GivingRecord[]> = {
  c1: [
    { packageId: "GIVING-221", date: "1 Apr 2026",  allocationPct: 20, grossAmount: 1000.00, netAmount: 900.00,   status: "processed" },
    { packageId: "GIVING-208", date: "31 Mar 2026", allocationPct: 60, grossAmount: 1794.00, netAmount: 1614.60,  status: "processed" },
    { packageId: "GIVING-198", date: "31 Jan 2026", allocationPct: 60, grossAmount: 1650.00, netAmount: 1485.00,  status: "processed" },
  ],
  c4: [
    { packageId: "GIVING-208", date: "31 Mar 2026", allocationPct: 30, grossAmount: 897.00,  netAmount: 807.30,   status: "processed" },
    { packageId: "GIVING-198", date: "31 Jan 2026", allocationPct: 30, grossAmount: 825.00,  netAmount: 742.50,   status: "processed" },
  ],
  c6: [
    { packageId: "GIVING-208", date: "31 Mar 2026", allocationPct: 10, grossAmount: 299.00,  netAmount: 269.10,   status: "pending"   },
    { packageId: "GIVING-198", date: "1 Mar 2026",  allocationPct: 10, grossAmount: 275.00,  netAmount: 247.50,   status: "processed" },
  ],
  c7: [
    { packageId: "GIVING-198", date: "24 Mar 2026", allocationPct: 10, grossAmount: 275.00,  netAmount: 247.50,   status: "processed" },
  ],
};

const statusConfig = {
  processed: { label: "Processed", icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  pending:   { label: "Pending",   icon: Clock,        cls: "text-amber-700  bg-amber-50  border-amber-200"   },
  reversed:  { label: "Reversed",  icon: RefreshCw,    cls: "text-violet-700 bg-violet-50 border-violet-200"  },
};

const fmt = (n: number) =>
  `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;

// ─── Charity row ──────────────────────────────────────────────────────────────

function CharityRow({ charity, color }: { charity: MyCharity; color: string; }) {
  const [expanded, setExpanded] = useState(false);
  const history = GIVING_HISTORY[charity.id] ?? [];

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors text-left"
      >
        {/* Color dot */}
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />

        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Heart className="w-4 h-4 text-primary" />
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{charity.name}</p>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {charity.location}
            </span>
            <span className="text-xs text-muted-foreground">{charity.category}</span>
            <span className="text-xs text-muted-foreground">Last: {charity.lastDonation}</span>
          </div>
        </div>

        {/* Total donated */}
        <div className="hidden sm:block text-right flex-shrink-0">
          <p className="text-xs text-muted-foreground">Total donated</p>
          <p className="text-sm font-semibold text-foreground">
            ${charity.totalDonated.toLocaleString("en-AU", { minimumFractionDigits: 0 })}
          </p>
        </div>

        {/* Allocation */}
        <div className="flex-shrink-0 w-12 text-right">
          <span className="text-sm font-bold text-foreground">{charity.allocation}%</span>
        </div>

        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Giving history */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-4 rounded-xl border border-border bg-muted/30 overflow-hidden">
              {history.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No giving history yet.</p>
              ) : (
                <>
                  <div className="grid grid-cols-6 gap-3 px-4 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground">Package</p>
                    <p className="text-xs font-semibold text-muted-foreground">Date</p>
                    <p className="text-xs font-semibold text-muted-foreground">Allocation</p>
                    <p className="text-xs font-semibold text-muted-foreground text-right">Amount (net)</p>
                    <p className="text-xs font-semibold text-muted-foreground text-right">Status</p>
                    <p className="text-xs font-semibold text-muted-foreground text-right">ABA</p>
                  </div>
                  {history.map((r) => {
                    const s = statusConfig[r.status];
                    const StatusIcon = s.icon;
                    return (
                      <div key={r.packageId + r.date} className="grid grid-cols-6 gap-3 px-4 py-3 border-b border-border/50 last:border-0 items-center">
                        <div className="flex items-center gap-2">
                          <ArrowUpFromLine className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs font-mono text-foreground">{r.packageId}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                        <span className="text-xs font-medium text-foreground">{r.allocationPct}% of giving</span>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-emerald-700">{fmt(r.netAmount)}</p>
                          <p className="text-[10px] text-muted-foreground">gross {fmt(r.grossAmount)}</p>
                        </div>
                        <div className="flex justify-end">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${s.cls}`}>
                            <StatusIcon className="w-3 h-3" />
                            {s.label}
                          </span>
                        </div>
                        <div className="flex justify-end">
                          {r.status === "processed" ? (
                            <button
                              type="button"
                              onClick={() => downloadABA({ packageId: r.packageId, charityName: charity.name, netAmount: r.netAmount })}
                              title="Download ABA file"
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors border border-primary/20 hover:border-primary/40"
                            >
                              <Download className="w-3 h-3" />
                              ABA
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground/40">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function MyCharitiesPage() {
  const charities: MyCharity[] = [
    { id: "c1", name: "Red Cross Australia", category: "Humanitarian",    location: "Melbourne, VIC", allocation: 60, totalDonated: 29035, lastDonation: "1 Apr 2026",  abn: "50 169 561 394" },
    { id: "c4", name: "Salvation Army",       category: "Community",      location: "Sydney, NSW",    allocation: 30, totalDonated: 14518, lastDonation: "1 Apr 2026",  abn: "42 609 278 633" },
    { id: "c6", name: "Beyond Blue",          category: "Mental Health",  location: "Melbourne, VIC", allocation:  6, totalDonated:  2903, lastDonation: "1 Mar 2026",  abn: "87 093 865 840" },
    { id: "c7", name: "Cancer Council",       category: "Health Research",location: "Sydney, NSW",    allocation:  4, totalDonated:  1936, lastDonation: "24 Mar 2026", abn: "51 116 463 846" },
  ];

  const totalAllocation = charities.reduce((s, c) => s + c.allocation, 0);
  const totalDonated    = charities.reduce((s, c) => s + c.totalDonated, 0);

  const allocStatus =
    totalAllocation === 100 ? "valid" :
    totalAllocation > 100   ? "over"  : "under";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Charities</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Charities your Foundation Account has given to.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Charities",        value: String(charities.length),                                                                                                   sub: "G2G verified" },
          { label: "Total Donated",    value: `$${(totalDonated / 1000).toFixed(1)}k`,                                                                                    sub: "All time" },
          { label: "Total Allocation", value: `${totalAllocation}%`,                                                                                                      sub: totalAllocation === 100 ? "Balanced" : totalAllocation > 100 ? "Over by " + (totalAllocation - 100) + "%" : (100 - totalAllocation) + "% unallocated" },
          { label: "Avg per Charity",  value: charities.length ? `$${Math.round(totalDonated / charities.length).toLocaleString()}` : "—",                                sub: "All time average" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-border px-5 py-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Allocation bar */}
      <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Allocation Breakdown</h2>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
            allocStatus === "valid" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
            allocStatus === "over"  ? "text-red-700   bg-red-50   border-red-200" :
                                     "text-amber-700  bg-amber-50  border-amber-200"
          }`}>
            {totalAllocation}% of 100%
          </span>
        </div>

        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {charities.map((c, i) => (
            <motion.div
              key={c.id}
              animate={{ width: `${(c.allocation / Math.max(totalAllocation, 100)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full rounded-sm"
              style={{ backgroundColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}
            />
          ))}
          {totalAllocation < 100 && (
            <div className="h-full rounded-sm bg-muted" style={{ width: `${100 - totalAllocation}%` }} />
          )}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {charities.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }} />
              <span className="text-xs text-muted-foreground">{c.name.split(" ")[0]}</span>
              <span className="text-xs font-semibold text-foreground">{c.allocation}%</span>
            </div>
          ))}
        </div>

        {allocStatus !== "valid" && (
          <div className={`flex items-start gap-2.5 p-3 rounded-xl text-sm ${
            allocStatus === "over"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-amber-50 border border-amber-200 text-amber-800"
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {allocStatus === "over"
              ? `Allocations exceed 100% by ${totalAllocation - 100}%.`
              : `${100 - totalAllocation}% is unallocated.`}
          </div>
        )}
      </div>

      {/* Charity list */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Charity List</h2>
          <p className="text-xs text-muted-foreground">Click a charity to view giving history</p>
        </div>

        <div className="divide-y divide-border/60">
          {charities.map((c, i) => (
            <CharityRow
              key={c.id}
              charity={c}
              color={ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
