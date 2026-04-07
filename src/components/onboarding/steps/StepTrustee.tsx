"use client";

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

export function StepTrustee({ data, onChange, onNext, onBack }: Props) {
  const isValid = data.firstName.trim() && data.lastName.trim() && data.email.trim() && data.role;

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
        <p className="text-sm text-foreground/80 leading-relaxed">
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
          <Input
            id="phone"
            type="tel"
            placeholder="+61 4xx xxx xxx"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className="h-11 rounded-xl"
          />
          <p className="text-xs text-muted-foreground">For SMS approval notifications.</p>
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
          className="rounded-full px-6 h-10 brand-gradient border-0 hover:opacity-90 transition-opacity shadow-md shadow-primary/20 disabled:opacity-40 disabled:pointer-events-none"
        >
          Review & Complete <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
