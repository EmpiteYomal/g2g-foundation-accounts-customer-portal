"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, TrendingUp, ArrowUpRight } from "lucide-react";

const charities = [
  { name: "Red Cross Australia", allocation: 60, mtd: 504.00, color: "hsl(20, 75%, 55%)" },
  { name: "Salvation Army",      allocation: 40, mtd: 336.00, color: "hsl(45, 75%, 50%)" },
];

const mtdDonated = 842.00;

// Last 6 months of giving
const monthlyTrend = [
  { month: "Nov", amount: 610 },
  { month: "Dec", amount: 890 },
  { month: "Jan", amount: 720 },
  { month: "Feb", amount: 980 },
  { month: "Mar", amount: 840 },
  { month: "Apr", amount: 842, current: true },
];

const maxAmount = Math.max(...monthlyTrend.map((m) => m.amount));

export function GivingRatePanel() {
  return (
    <Card className="rounded-2xl border-border h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Giving Rate</CardTitle>
          <Button variant="ghost" size="sm" className="rounded-xl h-7 w-7 p-0 text-muted-foreground hover:text-blue-800">
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-0 flex-1 flex flex-col">
        {/* MTD impact */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                ${mtdDonated.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
              </span>{" "}
              donated this month
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            0.2%
          </div>
        </div>

        {/* Charity split */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">Charity split</p>

          <div className="h-2 bg-muted rounded-full overflow-hidden flex gap-0.5">
            {charities.map((c, i) => (
              <div
                key={i}
                className="h-full rounded-full"
                style={{ width: `${c.allocation}%`, backgroundColor: c.color }}
              />
            ))}
          </div>

          <div className="space-y-2">
            {charities.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <p className="text-xs text-foreground truncate">{c.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">${c.mtd.toFixed(2)}</p>
                  <p className="text-xs font-semibold text-foreground w-7 text-right">{c.allocation}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly trend */}
        <div className="flex-1 flex flex-col justify-end space-y-2 pt-1 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">Monthly giving</p>
          <div className="flex items-end justify-between gap-1.5 h-20">
            {monthlyTrend.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: "60px" }}>
                  <div
                    className={`w-full rounded-t-md transition-all ${m.current ? "bg-blue-800" : "bg-blue-100"}`}
                    style={{ height: `${(m.amount / maxAmount) * 60}px` }}
                  />
                </div>
                <p className={`text-[10px] font-medium ${m.current ? "text-blue-800" : "text-muted-foreground"}`}>
                  {m.month}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground">6-month average</p>
            <p className="text-xs font-semibold text-foreground">
              ${(monthlyTrend.reduce((s, m) => s + m.amount, 0) / monthlyTrend.length).toFixed(0)}/mo
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
