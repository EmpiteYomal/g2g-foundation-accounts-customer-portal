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
import { ArrowRight, ArrowLeft, Users, Info, Plus, Trash2 } from "lucide-react";
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

  const isValid =
    data.firstName.trim() &&
    data.lastName.trim() &&
    data.email.trim() &&
    data.role &&
    data.dateOfBirth.trim();

  const handlePhoneNumber = (number: string) => {
    const digits = number.replace(/\D/g, "");
    onChange({ phone: digits ? `${countryCode} ${digits}` : "" });
  };

  const handleCountryCode = (code: string | null) => {
    if (!code) return;
    setCountryCode(code);
    const digits = data.phone.replace(/^\+\d+\s?/, "");
    onChange({ phone: digits ? `${code} ${digits}` : "" });
  };

  const numberPart = data.phone.replace(/^\+\d+\s?/, "");

  const addUser = () => {
    if (data.additionalUsers.length < 3) {
      onChange({ additionalUsers: [...data.additionalUsers, { name: "", position: "", email: "" }] });
    }
  };

  const updateUser = (index: number, field: "name" | "position" | "email", value: string) => {
    const updated = data.additionalUsers.map((u, i) =>
      i === index ? { ...u, [field]: value } : u
    );
    onChange({ additionalUsers: updated });
  };

  const removeUser = (index: number) => {
    onChange({ additionalUsers: data.additionalUsers.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Authorised users</h2>
        <p className="text-muted-foreground">
          Identify your Account Founder and up to three additional users who can view reports or approve grants.
        </p>
      </div>

      {/* KYC/AML notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Date of birth is required for the Account Founder to meet Australian <strong>AML/KYC</strong> obligations. The founder will receive an email to complete identity verification.
        </p>
      </div>

      {/* Account Founder */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-foreground">Account Founder</p>
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

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="dob">Date of birth <span className="text-primary">*</span></Label>
            <Input
              id="dob"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onChange({ dateOfBirth: e.target.value })}
              className="h-11 rounded-xl"
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
            />
            <p className="text-xs text-muted-foreground">Must be 18 years or older to establish a Foundation Account.</p>
          </div>
        </div>
      </div>

      {/* Additional users */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            Additional users <span className="text-muted-foreground font-normal">(optional, up to 3)</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          These users can access reports and approve grants. They will receive email invitations.
        </p>

        {data.additionalUsers.map((user, i) => (
          <div key={i} className="p-4 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User {i + 2}</p>
              <button
                type="button"
                onClick={() => removeUser(i)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Full name</Label>
                <Input
                  placeholder="Alex Brown"
                  value={user.name}
                  onChange={(e) => updateUser(i, "name", e.target.value)}
                  className="h-9 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Position</Label>
                <Input
                  placeholder="Finance Manager"
                  value={user.position}
                  onChange={(e) => updateUser(i, "position", e.target.value)}
                  className="h-9 rounded-lg text-sm"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-xs text-muted-foreground">Work email</Label>
                <Input
                  type="email"
                  placeholder="alex.brown@company.com.au"
                  value={user.email}
                  onChange={(e) => updateUser(i, "email", e.target.value)}
                  className="h-9 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        {data.additionalUsers.length < 3 && (
          <button
            type="button"
            onClick={addUser}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add user
          </button>
        )}
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
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
