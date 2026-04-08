"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const charityBreakdown = [
  { name: "Red Cross Australia", amount: "$29,035", pct: 60, color: "#16a34a" },
  { name: "Salvation Army", amount: "$14,518", pct: 30, color: "#3b82f6" },
  { name: "Beyond Blue", amount: "$2,903", pct: 6, color: "#a855f7" },
  { name: "Cancer Council", amount: "$1,936", pct: 4, color: "#f59e0b" },
];

export function ImpactSummary() {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Impact Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Big number */}
        <div className="text-center py-3 px-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
          <p className="text-xs text-emerald-800 font-medium mb-1">Total Impact · All Time</p>
          <p className="text-3xl font-bold text-emerald-800">$48,392</p>
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
                  <span className="text-sm text-muted-foreground truncate">{c.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-foreground">{c.amount}</span>
                  <span className="text-xs text-muted-foreground w-7 text-right">{c.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone */}
        <div className="pt-1 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1.5">Next milestone</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">$50,000 total</span>
            <span className="text-sm text-emerald-800 font-semibold">96.8%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96.8%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">$1,608 to go</p>
        </div>
      </CardContent>
    </Card>
  );
}
