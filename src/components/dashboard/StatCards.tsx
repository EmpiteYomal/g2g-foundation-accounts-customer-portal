"use client";

import { motion } from "framer-motion";
import { DollarSign, Clock, TrendingUp, GitBranch } from "lucide-react";

const stats = [
  {
    label: "Total Donated",
    value: "$48,392",
    sub: "+$3,210 this month",
    trend: "+7.1%",
    positive: true,
    icon: DollarSign,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    label: "Pending Approval",
    value: "$6,840",
    sub: "3 transfers awaiting",
    trend: "Action needed",
    positive: false,
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    urgent: true,
  },
  {
    label: "This Month",
    value: "$3,210",
    sub: "vs $2,990 last month",
    trend: "+7.4%",
    positive: true,
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Active Rules",
    value: "4",
    sub: "Across 6 charities",
    trend: "All healthy",
    positive: true,
    icon: GitBranch,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow ${
            "border-border"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} style={{ width: "18px", height: "18px" }} />
            </div>
            {stat.urgent && (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Urgent
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-foreground leading-none mb-1.5">{stat.value}</p>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
              stat.positive
                ? "text-emerald-800 bg-emerald-50"
                : stat.urgent
                ? "text-amber-900 bg-amber-50"
                : "text-muted-foreground bg-muted"
            }`}>
              {stat.trend}
            </span>
            <span className="text-xs text-muted-foreground">{stat.sub}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
