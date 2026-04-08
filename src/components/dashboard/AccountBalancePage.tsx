"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  ReceiptText,
  CreditCard,
  Lock,
  CheckCircle2,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence } from "framer-motion";

// ─── Balance summary ──────────────────────────────────────────────────────────

const balanceSummary = [
  {
    label: "Available Balance",
    value: "$48,392.00",
    sub: "Ready for disbursement",
    icon: Wallet,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    label: "Pending Disbursements",
    value: "$6,840.00",
    sub: "3 givings awaiting processing",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    urgent: true,
  },
  {
    label: "Total Donated (All Time)",
    value: "$112,480.00",
    sub: "Across 4 charities since inception",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

// ─── Monthly chart ────────────────────────────────────────────────────────────

const monthlyData = [
  { month: "Nov", amount: 2400 },
  { month: "Dec", amount: 3100 },
  { month: "Jan", amount: 2750 },
  { month: "Feb", amount: 2990 },
  { month: "Mar", amount: 3210 },
  { month: "Apr", amount: 1840, partial: true },
];

const maxMonthly = Math.max(...monthlyData.map((d) => d.amount));

// ─── Transactions ─────────────────────────────────────────────────────────────

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
  { value: "all",          label: "All" },
  { value: "inflow",       label: "Inflows" },
  { value: "disbursement", label: "Disbursements" },
  { value: "reversal",     label: "Reversals" },
  { value: "fee",          label: "Admin Fees" },
] as const;
type TypeFilter = typeof typeFilterOptions[number]["value"];

function formatAmount(type: TxType, amount: number) {
  const formatted = `$${amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
  return type === "inflow" || type === "reversal" ? `+${formatted}` : `−${formatted}`;
}

function amountColor(type: TxType) {
  return type === "inflow" || type === "reversal" ? "text-emerald-700" : "text-foreground";
}

// ─── Top-up Modal ─────────────────────────────────────────────────────────────

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

function TopUpModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount]     = useState("");
  const [cardNum, setCardNum]   = useState("");
  const [expiry, setExpiry]     = useState("");
  const [cvc, setCvc]           = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const submit = () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num < 10) return setError("Minimum top-up amount is $10.");
    if (cardNum.replace(/\s/g, "").length < 16) return setError("Please enter a valid 16-digit card number.");
    if (expiry.length < 5) return setError("Please enter a valid expiry date.");
    if (cvc.length < 3)    return setError("Please enter a valid CVC.");
    if (!name.trim())      return setError("Please enter the cardholder name.");
    setSuccess(true);
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
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-4 py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Top-up successful!</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">${parseFloat(amount).toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span> has been added to your Foundation Account.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Funds are typically available within 1–2 business days.</p>
            <Button onClick={onClose} className="rounded-xl w-full mt-2">Done</Button>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Top up balance</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Add funds to your Foundation Account via card.</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount (AUD)</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                <Input
                  type="number"
                  min={10}
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(""); }}
                  placeholder="0.00"
                  className="pl-7 rounded-xl text-sm"
                />
              </div>
              <div className="flex gap-2">
                {PRESET_AMOUNTS.map((p) => (
                  <button key={p} onClick={() => { setAmount(String(p)); setError(""); }}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      amount === String(p)
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}>
                    ${p.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Card details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Card details</Label>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" /> Secured by Stripe
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={cardNum}
                    onChange={(e) => { setCardNum(formatCard(e.target.value)); setError(""); }}
                    placeholder="1234 5678 9012 3456"
                    className="pl-9 rounded-xl text-sm font-mono tracking-wider"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Input
                    value={expiry}
                    onChange={(e) => { setExpiry(formatExpiry(e.target.value)); setError(""); }}
                    placeholder="MM/YY"
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Input
                    value={cvc}
                    onChange={(e) => { setCvc(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                    placeholder="CVC"
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <Input
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Cardholder name"
                className="rounded-xl text-sm"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
            )}

            <Button onClick={submit} className="w-full rounded-xl gap-2">
              <CreditCard className="w-4 h-4" />
              {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) >= 10
                ? `Pay $${parseFloat(amount).toLocaleString("en-AU", { minimumFractionDigits: 2 })}`
                : "Top up"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              A 2.9% + 30¢ card processing fee applies. Funds typically clear within 1–2 business days.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AccountBalancePage() {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<Period>("Last 3 Months");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(1);
  const [topping, setTopping] = useState(false);

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

const handleTypeFilter = (val: TypeFilter) => { setTypeFilter(val); setPage(1); };
  const handleQuery      = (val: string)      => { setQuery(val);      setPage(1); };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account Balance</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            KFC Foundation Sub-Account · April 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setTopping(true)} className="rounded-xl gap-2 h-9 text-sm">
            <Plus className="w-4 h-4" /> Top Up
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 h-9 text-sm">
            <Download className="w-4 h-4" /> Export Statement
          </Button>
        </div>
      </div>

      {/* Balance summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {balanceSummary.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-white rounded-2xl p-5 border ${card.border}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {card.urgent && (
                <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 text-xs gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Urgent
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-foreground mb-1">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Monthly chart */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Monthly Donation Totals</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Funds received per month</p>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              +7.4% vs last month
            </span>
          </div>
          <div className="flex items-end gap-3 h-36">
            {monthlyData.map((d) => {
              const pct = (d.amount / maxMonthly) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium">
                    ${(d.amount / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full flex items-end" style={{ height: "96px" }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: 0.2 + monthlyData.indexOf(d) * 0.06, duration: 0.5, ease: "easeOut" }}
                      className={`w-full rounded-lg ${d.partial ? "bg-primary/30" : "bg-primary"}`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${d.partial ? "text-muted-foreground" : "text-foreground"}`}>
                    {d.month}
                    {d.partial && <span className="text-muted-foreground/60"> *</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">* April is a partial month (8 days)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1.5 p-1 bg-muted/60 rounded-xl w-fit">
            {periodOptions.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  period === p ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
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

      {/* Transaction table */}
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
                    page === n ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
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

      <AnimatePresence>
        {topping && <TopUpModal onClose={() => setTopping(false)} />}
      </AnimatePresence>
    </div>
  );
}
