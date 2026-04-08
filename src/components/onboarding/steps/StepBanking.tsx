"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Landmark, Upload, FileText, Info } from "lucide-react";
import type { OnboardingData } from "../OnboardingFlow";

type Props = {
  data: OnboardingData["banking"];
  onChange: (v: Partial<OnboardingData["banking"]>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function StepBanking({ data, onChange, onNext, onBack }: Props) {
  const docInputRef = useRef<HTMLInputElement>(null);

  const hasDetails =
    data.accountName.trim() &&
    data.bsb.replace(/\D/g, "").length === 6 &&
    data.accountNumber.trim().length >= 6;

  const canContinue = data.skipped || hasDetails;

  const formatBsb = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 6);
    return digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits;
  };

  const handleSkip = () => {
    onChange({ skipped: true, accountName: "", bsb: "", accountNumber: "", bankDocFileName: "" });
    onNext();
  };

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Landmark className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Bank details</h2>
        <p className="text-muted-foreground">
          Add your organisation&apos;s bank account to enable fund transfers. This step is optional — you can add these details after your account is approved.
        </p>
      </div>

      {/* Optional notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
        <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 leading-relaxed">
          Bank details are <strong>optional</strong> during signup. G2G will review your application first — you can provide banking information once your Foundation Account is approved.
        </p>
      </div>

      <div className="space-y-5">
        {/* Bank account details */}
        <div className="space-y-1.5">
          <Label htmlFor="accountName">Account name</Label>
          <Input
            id="accountName"
            placeholder="KFC Australia Pty Ltd"
            value={data.accountName}
            onChange={(e) => onChange({ accountName: e.target.value, skipped: false })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="bsb">BSB</Label>
            <Input
              id="bsb"
              placeholder="063-000"
              value={data.bsb}
              onChange={(e) => onChange({ bsb: formatBsb(e.target.value), skipped: false })}
              className="h-11 rounded-xl font-mono"
              maxLength={7}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="accountNumber">Account number</Label>
            <Input
              id="accountNumber"
              placeholder="12345678"
              value={data.accountNumber}
              onChange={(e) => onChange({ accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10), skipped: false })}
              className="h-11 rounded-xl font-mono"
            />
          </div>
        </div>

        {/* Bank document upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Supporting document</Label>
          <p className="text-xs text-muted-foreground">
            A bank statement or deposit slip showing account name, BSB, and account number.
          </p>
          <input
            ref={docInputRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            className="hidden"
            onChange={(e) => onChange({ bankDocFileName: e.target.files?.[0]?.name ?? "", skipped: false })}
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
                  Upload PDF or image (optional)
                </span>
              </>
            )}
          </button>
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
        <div className="flex items-center gap-3">
          {!hasDetails && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="rounded-full px-5 h-10 text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!canContinue}
            className="rounded-full px-6 h-10 bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Continue <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
