"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Plus, ChevronRight, Calendar, Percent, RefreshCw } from "lucide-react";

const rules = [
  {
    id: "R-01",
    name: "Weekly Round-up",
    type: "round-up",
    frequency: "Every Monday",
    charities: ["Red Cross 60%", "Salvation Army 40%"],
    status: "active",
    nextRun: "Apr 14",
  },
  {
    id: "R-02",
    name: "1% of Sales",
    type: "percentage",
    frequency: "Monthly",
    charities: ["Cancer Council 100%"],
    status: "active",
    nextRun: "May 1",
  },
  {
    id: "R-03",
    name: "Q2 CSR Grant",
    type: "manual",
    frequency: "One-time",
    charities: ["Beyond Blue 100%"],
    status: "pending",
    nextRun: "Pending approval",
  },
];

const typeIcon: Record<string, typeof RefreshCw> = {
  "round-up": RefreshCw,
  percentage: Percent,
  manual: Calendar,
};

export function GivingRulesPanel() {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <GitBranch className="w-3.5 h-3.5 text-blue-800" />
            </div>
            <CardTitle className="text-sm font-semibold">Giving Rules</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="rounded-xl h-7 w-7 p-0 text-muted-foreground hover:text-blue-800">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {rules.map((rule) => {
          const Icon = typeIcon[rule.type] ?? Calendar;
          return (
            <div
              key={rule.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-blue-200 hover:bg-blue-50/40 transition-all cursor-pointer group"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                rule.status === "active" ? "bg-blue-50" : "bg-muted"
              }`}>
                <Icon className={`w-3.5 h-3.5 ${rule.status === "active" ? "text-blue-800" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{rule.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    rule.status === "active"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-amber-50 text-amber-900"
                  }`}>
                    {rule.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{rule.frequency}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {rule.charities.join(" · ")}
                </p>
                <p className="text-xs text-blue-800/80 mt-0.5 font-medium">
                  Next: {rule.nextRun}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
            </div>
          );
        })}

        <Button variant="outline" size="sm" className="w-full rounded-xl h-8 text-xs gap-1.5 border-dashed border-blue-300 text-blue-800 hover:bg-blue-50 hover:border-blue-400">
          <Plus className="w-3.5 h-3.5" /> Add new rule
        </Button>
      </CardContent>
    </Card>
  );
}
