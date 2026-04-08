"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Landmark, Upload, FileText, Percent, Info } from "lucide-react";
import type { OnboardingData } from "../OnboardingFlow";

type Props = {
  data: OnboardingData["banking"];
  onChange: (v: Partial<OnboardingData["banking"]>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function StepBanking({ data, onChange, onNext, onBack }: Props) {
  const docInputRef = useRef<HTMLInputElement>(null);

  const isValid =
    data.accountName.trim() &&
    data.bsb.replace(/\D/g, "").length === 6 &&
    data.accountNumber.trim().length >= 6 &&
    data.bankDocFileName.trim() &&
    data.givingPercentage.trim() &&
    Number(data.givingPercentage) > 0 &&
    data.financeContactName.trim() &&
    data.financeContactEmail.includes("@");

  const formatBsb = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 6);
    return digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits;
  };

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Landmark className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Banking & funding</h2>
        <p className="text-muted-foreground">
          Your bank details enable bulk fund transfers that are automatically reconciled against your uploaded sales reports.
        </p>
      </div>

      <div className="space-y-7">
        {/* Bank account details */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-foreground">Bank account details</p>

          <div className="space-y-1.5">
            <Label htmlFor="accountName">
              Account name <span className="text-primary">*</span>
            </Label>
            <Input
              id="accountName"
              placeholder="KFC Australia Pty Ltd"
              value={data.accountName}
              onChange={(e) => onChange({ accountName: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="bsb">
                BSB <span className="text-primary">*</span>
              </Label>
              <Input
                id="bsb"
                placeholder="063-000"
                value={data.bsb}
                onChange={(e) => onChange({ bsb: formatBsb(e.target.value) })}
                className="h-11 rounded-xl font-mono"
                maxLength={7}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="accountNumber">
                Account number <span className="text-primary">*</span>
              </Label>
              <Input
                id="accountNumber"
                placeholder="12345678"
                value={data.accountNumber}
                onChange={(e) => onChange({ accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className="h-11 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bank document upload */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">
            Bank account document <span className="text-primary">*</span>
          </Label>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <Info className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Upload a bank statement header or blank deposit slip issued within the last 6 months. It must clearly show the <strong>bank logo, account name, BSB, and account number</strong> on one page.
            </p>
          </div>
          <input
            ref={docInputRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            className="hidden"
            onChange={(e) => onChange({ bankDocFileName: e.target.files?.[0]?.name ?? "" })}
          />
          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            className="w-full h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 group"
          >
            {data.bankDocFileName ? (
              <>
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{data.bankDocFileName}</span>
                <span className="text-xs text-muted-foreground">Click to replace</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Upload PDF or image
                </span>
              </>
            )}
          </button>
        </div>

        {/* Giving rate */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Giving rate <span className="text-primary">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Percentage of total sales to be donated each period. This will be formalised in your Statement of Work (SOW).
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Percent className="w-4 h-4 text-primary" />
            </div>
            <div className="relative max-w-[140px]">
              <Input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={data.givingPercentage}
                onChange={(e) => onChange({ givingPercentage: e.target.value })}
                className="h-11 rounded-xl pr-8 text-base font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
            </div>
            <span className="text-sm text-muted-foreground">of total sales per period</span>
          </div>
        </div>

        {/* Finance contacts */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Finance contact <span className="text-primary">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            This person will receive matching confirmations and admin invoices at the end of each month.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="finName" className="text-xs text-muted-foreground">Full name</Label>
              <Input
                id="finName"
                placeholder="Alex Johnson"
                value={data.financeContactName}
                onChange={(e) => onChange({ financeContactName: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="finEmail" className="text-xs text-muted-foreground">Work email</Label>
              <Input
                id="finEmail"
                type="email"
                placeholder="finance@company.com.au"
                value={data.financeContactEmail}
                onChange={(e) => onChange({ financeContactEmail: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
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
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
