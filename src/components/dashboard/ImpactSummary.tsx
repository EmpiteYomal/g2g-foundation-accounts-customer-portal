"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const charityBreakdown = [
  { name: "Red Cross Australia", amount: "$29,035", pct: 60, color: "#F05123" },
  { name: "Salvation Army", amount: "$14,518", pct: 30, color: "#F3744F" },
  { name: "Beyond Blue", amount: "$2,903", pct: 6, color: "#F6977B" },
  { name: "Cancer Council", amount: "$1,936", pct: 4, color: "#FEEEE9" },
];

export function ImpactSummary() {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">Impact Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Big number */}
        <div className="text-center py-3 px-4 rounded-2xl bg-gradient-to-br from-[#FEEEE9] to-orange-50 border border-[#F6977B]/30">
          <p className="text-xs text-primary/70 font-medium mb-1">Total Impact · All Time</p>
          <p className="text-3xl font-bold text-primary">$48,392</p>
          <p className="text-xs text-muted-foreground mt-1">Across 4 charities</p>
        </div>

        {/* Donut-style bar */}
        <div>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
            {charityBreakdown.map((c) => (
              <div
                key={c.name}
                style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                className="h-full"
              />
            ))}
          </div>

          <div className="space-y-2.5">
            {charityBreakdown.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-xs text-muted-foreground truncate">{c.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-foreground">{c.amount}</span>
                  <span className="text-[10px] text-muted-foreground w-7 text-right">{c.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone */}
        <div className="pt-1 border-t border-border">
          <p className="text-[11px] text-muted-foreground mb-1.5">Next milestone</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-foreground">$50,000 total</span>
            <span className="text-xs text-primary font-semibold">96.8%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "96.8%" }} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">$1,608 to go</p>
        </div>
      </CardContent>
    </Card>
  );
}
