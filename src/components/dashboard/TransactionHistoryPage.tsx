"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TxType = "inflow" | "disbursement" | "reversal" | "fee";
type TxStatus = "completed" | "pending" | "on_hold" | "reversed";

type Transaction = {
  id: string;
  date: string;
  description: string;
  type: TxType;
  amount: number;
  status: TxStatus;
  reference?: string;
};

const ALL_TRANSACTIONS: Transaction[] = [
  { id: "TXN-8850", date: "8 Apr 2026",  description: "Round-up donations — store #42",        type: "inflow",       amount:  312.40, status: "completed" },
  { id: "TXN-8849", date: "7 Apr 2026",  description: "Customer card donation — online",         type: "inflow",       amount:   50.00, status: "completed" },
  { id: "TXN-8848", date: "5 Apr 2026",  description: "Corporate matching contribution — March", type: "inflow",       amount: 1200.00, status: "completed" },
  { id: "TXN-8847", date: "3 Apr 2026",  description: "Round-up donations — store #17",         type: "inflow",       amount:  278.00, status: "completed" },
  { id: "TXN-8846", date: "1 Apr 2026",  description: "Disbursement — Red Cross Australia",     type: "disbursement", amount:  900.00, status: "completed", reference: "GIVING-221" },
  { id: "TXN-8845", date: "1 Apr 2026",  description: "Disbursement — ACLU",                   type: "disbursement", amount: 3150.00, status: "completed", reference: "GIVING-221" },
  { id: "TXN-8844", date: "1 Apr 2026",  description: "Reversal — WHO (compliance hold)",       type: "reversal",     amount:  450.00, status: "reversed",  reference: "GIVING-221" },
  { id: "TXN-8843", date: "1 Apr 2026",  description: "G2G admin fee — March disbursement",     type: "fee",          amount:  500.00, status: "completed", reference: "GIVING-221" },
  { id: "TXN-8842", date: "31 Mar 2026", description: "Disbursement — Red Cross Australia",     type: "disbursement", amount:  870.00, status: "completed", reference: "GIVING-208" },
  { id: "TXN-8841", date: "31 Mar 2026", description: "Disbursement — Salvation Army",          type: "disbursement", amount:  580.00, status: "completed", reference: "GIVING-208" },
  { id: "TXN-8840", date: "31 Mar 2026", description: "G2G admin fee — February disbursement",  type: "fee",          amount:  160.50, status: "completed", reference: "GIVING-208" },
  { id: "TXN-8839", date: "28 Mar 2026", description: "Bank transfer — KFC March funds",        type: "inflow",       amount: 2990.00, status: "completed" },
  { id: "TXN-8838", date: "15 Mar 2026", description: "Round-up donations — all stores",        type: "inflow",       amount:  654.20, status: "completed" },
  { id: "TXN-8837", date: "1 Mar 2026",  description: "Disbursement — Beyond Blue",             type: "disbursement", amount:  450.00, status: "pending",   reference: "GIVING-198" },
  { id: "TXN-8836", date: "1 Mar 2026",  description: "Disbursement — Cancer Council",          type: "disbursement", amount:  315.00, status: "on_hold",   reference: "GIVING-198" },
  { id: "TXN-8835", date: "28 Feb 2026", description: "Bank transfer — KFC February funds",     type: "inflow",       amount: 2750.00, status: "completed" },
];

const PAGE_SIZE = 10;

const typeConfig: Record<TxType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  inflow:       { label: "Inflow",       icon: ArrowDownToLine, color: "text-emerald-600", bg: "bg-emerald-50" },
  disbursement: { label: "Disbursement", icon: ArrowUpFromLine, color: "text-blue-600",    bg: "bg-blue-50" },
  reversal:     { label: "Reversal",     icon: RefreshCw,       color: "text-violet-600",  bg: "bg-violet-50" },
  fee:          { label: "Admin Fee",    icon: ReceiptText,     color: "text-rose-600",    bg: "bg-rose-50" },
};

const statusConfig: Record<TxStatus, { label: string; cls: string }> = {
  completed: { label: "Completed", cls: "text-emerald-800 bg-emerald-50 border-emerald-200" },
  pending:   { label: "Pending",   cls: "text-amber-800  bg-amber-50  border-amber-200" },
  on_hold:   { label: "On Hold",   cls: "text-orange-800 bg-orange-50 border-orange-200" },
  reversed:  { label: "Reversed",  cls: "text-violet-800 bg-violet-50 border-violet-200" },
};

const periodOptions = ["This Month", "Last 3 Months", "Last 6 Months", "All Time"] as const;
type Period = typeof periodOptions[number];

const typeFilterOptions = [
  { value: "all",         label: "All" },
  { value: "inflow",      label: "Inflows" },
  { value: "disbursement",label: "Disbursements" },
  { value: "reversal",    label: "Reversals" },
  { value: "fee",         label: "Admin Fees" },
] as const;
type TypeFilter = typeof typeFilterOptions[number]["value"];

function formatAmount(type: TxType, amount: number) {
  const formatted = `$${amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
  return type === "inflow" || type === "reversal" ? `+${formatted}` : `−${formatted}`;
}

function amountColor(type: TxType) {
  return type === "inflow" || type === "reversal" ? "text-emerald-700" : "text-foreground";
}

export function TransactionHistoryPage() {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<Period>("Last 3 Months");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_TRANSACTIONS.filter((tx) => {
      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      const matchesQuery =
        !query ||
        tx.description.toLowerCase().includes(query.toLowerCase()) ||
        tx.id.toLowerCase().includes(query.toLowerCase()) ||
        (tx.reference ?? "").toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [query, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalIn = filtered
    .filter((t) => t.type === "inflow" || t.type === "reversal")
    .reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered
    .filter((t) => t.type === "disbursement" || t.type === "fee")
    .reduce((s, t) => s + t.amount, 0);

  const handleTypeFilter = (val: TypeFilter) => {
    setTypeFilter(val);
    setPage(1);
  };

  const handleQuery = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            All inflows, disbursements, reversals, and fees for your Foundation Account
          </p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 h-9 text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total In",       value: `$${totalIn.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`,  color: "text-emerald-700" },
          { label: "Total Out",      value: `$${totalOut.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`, color: "text-foreground" },
          { label: "Net Movement",   value: `$${(totalIn - totalOut).toLocaleString("en-AU", { minimumFractionDigits: 2 })}`, color: "text-violet-700" },
          { label: "Transactions",   value: `${filtered.length}`, color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-border px-5 py-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
        {/* Period + search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1.5 p-1 bg-muted/60 rounded-xl w-fit">
            {periodOptions.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  period === p
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by ID, description, reference…"
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Type filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {typeFilterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTypeFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                typeFilter === opt.value
                  ? "bg-primary text-white border-primary"
                  : "text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Description</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Amount</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted-foreground text-sm py-16">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((tx, i) => {
                  const tCfg = typeConfig[tx.type];
                  const sCfg = statusConfig[tx.status];
                  const TypeIcon = tCfg.icon;
                  return (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-muted/20 transition-colors cursor-default"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-muted-foreground">{tx.id}</span>
                        {tx.reference && (
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">{tx.reference}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{tx.date}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-foreground font-medium">{tx.description}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${tCfg.bg} ${tCfg.color}`}>
                          <TypeIcon className="w-3 h-3" />
                          {tCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`text-sm font-semibold ${amountColor(tx.type)}`}>
                          {formatAmount(tx.type, tx.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${sCfg.cls}`}>
                          {sCfg.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    page === n
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
