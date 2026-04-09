"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FolderSync, Info } from "lucide-react";
import { cn } from "@/lib/utils";
type ReportingData = {
  frequency: string;
};

type Props = {
  data: ReportingData;
  onChange: (v: Partial<ReportingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const frequencies = [
  {
    value: "daily",
    label: "Daily",
    desc: "Sales and payroll reports uploaded every business day.",
  },
  {
    value: "weekly",
    label: "Weekly",
    desc: "Reports uploaded at the end of each week, typically Friday.",
  },
  {
    value: "monthly",
    label: "Monthly",
    desc: "Reports uploaded at the end of each calendar month.",
  },
];

export function StepReporting({ data, onChange, onNext, onBack }: Props) {
  const isValid = !!data.frequency;

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <FolderSync className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Reporting schedule</h2>
        <p className="text-muted-foreground">
          Choose how often your organisation will upload sales and payroll reports for reconciliation.
        </p>
      </div>

      {/* SFTP explanation */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
        <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-blue-900">How reconciliation works</p>
          <p className="text-sm text-blue-800 leading-relaxed">
            Your finance team uploads sales and payroll reports via <strong>SFTP</strong> on the agreed schedule. The platform automatically matches these against your bulk bank transfers to confirm the correct giving amount has been collected for the period.
          </p>
        </div>
      </div>

      {/* Frequency selection */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">
          Report upload frequency <span className="text-primary">*</span>
        </p>
        <div className="space-y-2.5">
          {frequencies.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange({ frequency: f.value })}
              className={cn(
                "w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                data.frequency === f.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-muted/30"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                data.frequency === f.value ? "border-primary" : "border-border"
              )}>
                {data.frequency === f.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <p className={cn(
                  "text-sm font-semibold transition-colors",
                  data.frequency === f.value ? "text-primary" : "text-foreground"
                )}>
                  {f.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SFTP credential note */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        SFTP credentials and folder structure will be provided in your onboarding confirmation email after account approval.
      </p>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="rounded-full px-6 h-10 bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Review & Complete <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
