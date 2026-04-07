"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, UserCheck, Info } from "lucide-react";
import type { OnboardingData } from "../OnboardingFlow";

type Props = {
  data: OnboardingData["trustee"];
  onChange: (v: Partial<OnboardingData["trustee"]>) => void;
  onNext: () => void;
  onBack: () => void;
};

const roles = [
  "CEO / Managing Director",
  "CFO / Finance Director",
  "Company Secretary",
  "Board Member",
  "Appointed Trustee",
  "Other",
];

const countryCodes = [
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+64", flag: "🇳🇿", label: "NZ" },
  { code: "+1",  flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "GB" },
  { code: "+65", flag: "🇸🇬", label: "SG" },
  { code: "+852", flag: "🇭🇰", label: "HK" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
];

export function StepTrustee({ data, onChange, onNext, onBack }: Props) {
  const [countryCode, setCountryCode] = useState("+61");

  const isValid = data.firstName.trim() && data.lastName.trim() && data.email.trim() && data.role;

  const handlePhoneNumber = (number: string) => {
    // Strip non-digits
    const digits = number.replace(/\D/g, "");
    onChange({ phone: digits ? `${countryCode} ${digits}` : "" });
  };

  const handleCountryCode = (code: string | null) => {
    if (!code) return;
    setCountryCode(code);
    // Re-apply code to existing number portion
    const digits = data.phone.replace(/^\+\d+\s?/, "");
    onChange({ phone: digits ? `${code} ${digits}` : "" });
  };

  // Extract just the number portion for the input display
  const numberPart = data.phone.replace(/^\+\d+\s?/, "");

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <UserCheck className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Appoint a Trustee</h2>
        <p className="text-muted-foreground">
          The Trustee is the authorised approver for all outgoing fund transfers from your Foundation Account.
        </p>
      </div>

      {/* Info callout */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-base text-foreground/80 leading-relaxed">
          The Trustee will receive an email invitation to set up their account. They must accept before any funds can be disbursed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="fname">First name <span className="text-primary">*</span></Label>
          <Input
            id="fname"
            placeholder="Jane"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lname">Last name <span className="text-primary">*</span></Label>
          <Input
            id="lname"
            placeholder="Smith"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="email">Work email <span className="text-primary">*</span></Label>
          <Input
            id="email"
            type="email"
            placeholder="jane.smith@company.com.au"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Mobile number</Label>
          <div className="flex h-11 rounded-xl border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
            {/* Country code picker */}
            <Select value={countryCode} onValueChange={(v) => handleCountryCode(v)}>
              <SelectTrigger className="h-full w-[100px] rounded-none border-0 border-r border-input focus:ring-0 focus-visible:ring-0 bg-muted/40 flex-shrink-0 px-3 gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span className="text-muted-foreground">{c.code}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Number input */}
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="400 000 000"
              value={numberPart}
              onChange={(e) => handlePhoneNumber(e.target.value)}
              className="h-full flex-1 rounded-none border-0 focus-visible:ring-0 bg-transparent px-3"
            />
          </div>
          <p className="text-base text-muted-foreground">For SMS approval notifications.</p>
        </div>

        <div className="space-y-1.5">
          <Label>Role / Title <span className="text-primary">*</span></Label>
          <Select value={data.role} onValueChange={(v) => onChange({ role: v ?? "" })}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select their role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
