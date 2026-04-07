"use client";

import { StatCards } from "./StatCards";
import { RecentTransactions } from "./RecentTransactions";
import { GivingRulesPanel } from "./GivingRulesPanel";
import { PendingApprovals } from "./PendingApprovals";
import { ImpactSummary } from "./ImpactSummary";

export function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good morning, Jane</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Here&apos;s your Foundation Account overview for{" "}
          <span className="font-medium text-foreground">April 2026</span>.
        </p>
      </div>

      {/* KPI cards */}
      <StatCards />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          <PendingApprovals />
          <RecentTransactions />
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          <ImpactSummary />
          <GivingRulesPanel />
        </div>
      </div>
    </div>
  );
}
