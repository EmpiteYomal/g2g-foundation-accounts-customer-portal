"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download } from "lucide-react";

const charityLogo: Record<string, string> = {
  "Red Cross Australia": "/charity logos/redcross_au.jpeg",
  "Salvation Army":      "/charity logos/salvationarmy.jpg",
  "Beyond Blue":         "/charity logos/beyondblue.png",
  "Cancer Council":      "/charity logos/cancercouncil.png",
};

const transactions = [
  { id: "TXN-8842", charity: "Red Cross Australia", amount: "+$2,904.00", date: "Apr 7, 2026",  givingRate: "1%", charityShare: "60%", givingId: "GIVING-221", status: "completed"  },
  { id: "TXN-8841", charity: "Salvation Army",      amount: "+$1,936.00", date: "Apr 7, 2026",  givingRate: "1%", charityShare: "40%", givingId: "GIVING-221", status: "completed"  },
  { id: "TXN-8840", charity: "Red Cross Australia", amount: "+$2,611.50", date: "Mar 31, 2026", givingRate: "1%", charityShare: "60%", givingId: "GIVING-208", status: "completed"  },
  { id: "TXN-8839", charity: "Salvation Army",      amount: "+$1,741.00", date: "Mar 31, 2026", givingRate: "1%", charityShare: "40%", givingId: "GIVING-208", status: "completed"  },
  { id: "TXN-8838", charity: "Beyond Blue",         amount: "+$500.00",   date: "Mar 28, 2026", givingRate: "1%", charityShare: "60%", givingId: "GIVING-198", status: "processing" },
  { id: "TXN-8837", charity: "Cancer Council",      amount: "+$350.00",   date: "Mar 24, 2026", givingRate: "1%", charityShare: "40%", givingId: "GIVING-198", status: "completed"  },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  completed:  { label: "Completed",  class: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  processing: { label: "Processing", class: "bg-blue-50 text-blue-800 border-blue-200" },
  pending:    { label: "Pending",    class: "bg-amber-50 text-amber-900 border-amber-200" },
  failed:     { label: "Failed",     class: "bg-red-50 text-red-800 border-red-200" },
};

export function RecentTransactions() {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground rounded-xl gap-1 h-8">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground rounded-xl gap-1 h-8">
              View all <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-2 pb-2.5">Transaction</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 pb-2.5">Charity</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 pb-2.5 hidden sm:table-cell">Method</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-2 pb-2.5">Amount</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-2 pb-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transactions.map((txn) => {
                const s = statusConfig[txn.status];
                const logo = charityLogo[txn.charity];
                return (
                  <tr key={txn.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-2 py-3">
                      <p className="font-mono text-xs text-muted-foreground">{txn.id}</p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{txn.date}</p>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {logo ? (
                            <img src={logo} alt={txn.charity} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground">{txn.charity[0]}</span>
                          )}
                        </div>
                        <span className="font-medium text-foreground text-sm">{txn.charity}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          {txn.charityShare} · {txn.givingId}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <span className="font-semibold text-sm text-emerald-800">{txn.amount}</span>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${s.class}`}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
