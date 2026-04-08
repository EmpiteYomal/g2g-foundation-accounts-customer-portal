"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const approvals = [
  {
    id: "AP-2401",
    charity: "Red Cross Australia",
    amount: "$2,904.00",
    period: "March 2026",
    givingRate: "1%",
    charityShare: "60%",
    dueDate: "Due today",
    urgent: true,
  },
  {
    id: "AP-2402",
    charity: "Salvation Army",
    amount: "$1,936.00",
    period: "March 2026",
    givingRate: "1%",
    charityShare: "40%",
    dueDate: "Due today",
    urgent: true,
  },
  {
    id: "AP-2403",
    charity: "Beyond Blue",
    amount: "$2,000.00",
    period: "February 2026",
    givingRate: "1%",
    charityShare: "100%",
    dueDate: "Due Apr 10",
    urgent: false,
  },
];

export function PendingApprovals() {
  const [items, setItems] = useState(approvals);

  const approve = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.success("Transfer approved", {
      description: `${id} has been approved and queued for processing.`,
    });
  };

  const reject = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.error("Transfer declined", {
      description: `${id} has been declined.`,
    });
  };

  if (items.length === 0) {
    return (
      <Card className="rounded-2xl border-border">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          <div>
            <p className="font-semibold text-foreground text-sm">All caught up!</p>
            <p className="text-sm text-muted-foreground">No pending approvals at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-900" />
            </div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Pending Approvals
            </CardTitle>
            <Badge className="bg-amber-100 text-amber-900 border-amber-200 rounded-full text-xs px-2">
              {items.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground rounded-xl gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 divide-y divide-border/60">
        {items.map((item) => (
          <div
            key={item.id}
            className="py-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm text-foreground">{item.charity}</p>
                {item.urgent && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    {item.dueDate}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded-full">
                  {item.givingRate} of sales
                </span>
                <span className="text-xs text-muted-foreground">→</span>
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {item.charityShare} to this charity
                </span>
                <span className="text-xs text-muted-foreground">· {item.period}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <p className="text-base font-bold text-foreground">{item.amount}</p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reject(item.id)}
                  className="rounded-xl h-8 px-3 text-xs border-red-200 text-red-800 hover:bg-red-50 hover:text-red-900 hover:border-red-300"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => approve(item.id)}
                  className="rounded-xl h-8 px-3 text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
