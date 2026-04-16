"use client";

import { useEffect, useState } from "react";
import { StatCards } from "./StatCards";
import { RecentTransactions } from "./RecentTransactions";
import { GivingRatePanel } from "./GivingRatePanel";
import { PendingApprovals } from "./PendingApprovals";
import { ImpactSummary } from "./ImpactSummary";

export function DashboardHome() {
  const [accountType, setAccountType] = useState<"org" | "person">("org");

  useEffect(() => {
    const stored = localStorage.getItem("accountType");
    if (stored === "person") setAccountType("person");
  }, []);

  const isIndividual = accountType === "person";

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good morning, Jane</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {isIndividual
            ? <>Here&apos;s your personal Foundation Account overview for <span className="font-medium text-foreground">April 2026</span>.</>
            : <>Here&apos;s your KFC Foundation Account overview for <span className="font-medium text-foreground">April 2026</span>.</>
          }
        </p>
      </div>

      {/* KPI cards */}
      <StatCards accountType={accountType} />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          {!isIndividual && <PendingApprovals />}
          <RecentTransactions extended={isIndividual} />
        </div>

        {/* Right column — 1/3 */}
        <div className="flex flex-col gap-6">
          <ImpactSummary />
          <div className="flex-1 flex flex-col">
            <GivingRatePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
