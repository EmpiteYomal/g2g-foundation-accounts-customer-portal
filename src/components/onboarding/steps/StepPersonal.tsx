"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";

export type PersonalData = {
  dateOfBirth: string;
  phone: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
};

type Props = {
  data: PersonalData;
  onChange: (values: Partial<PersonalData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

export function StepPersonal({ data, onChange, onNext, onBack }: Props) {
  const canContinue =
    data.dateOfBirth.trim() &&
    data.phone.trim() &&
    data.address.trim() &&
    data.suburb.trim() &&
    data.state.trim() &&
    data.postcode.trim();

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Your personal details</h2>
        <p className="text-muted-foreground">
          We&apos;ll use these details to set up your Foundation Account.
        </p>
      </div>

      <div className="space-y-6">
        {/* DOB + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onChange({ dateOfBirth: e.target.value })}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Mobile number</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+61 4XX XXX XXX"
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address">Residential address</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="123 Example Street"
            className="rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="suburb">Suburb</Label>
            <Input
              id="suburb"
              value={data.suburb}
              onChange={(e) => onChange({ suburb: e.target.value })}
              placeholder="Sydney"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              value={data.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">State</option>
              {AU_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              value={data.postcode}
              onChange={(e) => onChange({ postcode: e.target.value })}
              placeholder="2000"
              maxLength={4}
              className="rounded-xl"
            />
          </div>
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
          disabled={!canContinue}
          className="rounded-full px-6 h-10 bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
