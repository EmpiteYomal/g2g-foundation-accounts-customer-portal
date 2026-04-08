"use client";

import { useRef } from "react";
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
import { ArrowRight, ArrowLeft, Building2, Upload, ImageIcon } from "lucide-react";
import type { OnboardingData } from "../OnboardingFlow";

type Props = {
  data: OnboardingData["company"];
  onChange: (v: Partial<OnboardingData["company"]>) => void;
  onNext: () => void;
  onBack: () => void;
};

const industries = [
  "Food & Beverage",
  "Retail",
  "Hospitality",
  "Healthcare",
  "Education",
  "Finance & Insurance",
  "Technology",
  "Manufacturing",
  "Other",
];

const sizes = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–1,000 employees",
  "1,000+ employees",
];

const australianStates = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

export function StepCompany({ data, onChange, onNext, onBack }: Props) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const isValid =
    data.name.trim() &&
    data.abn.trim() &&
    data.industry &&
    data.size &&
    data.address.trim() &&
    data.suburb.trim() &&
    data.state &&
    data.postcode.trim();

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your organisation</h2>
        <p className="text-muted-foreground">
          Tell us about your business so we can set up your Foundation Account correctly.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Legal entity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="name">
              Legal entity name <span className="text-primary">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. KFC Australia Pty Ltd"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="h-11 rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Must match the name registered with your ABN.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="abn">
              ABN / ACN <span className="text-primary">*</span>
            </Label>
            <Input
              id="abn"
              placeholder="51 004 220 518"
              value={data.abn}
              onChange={(e) => onChange({ abn: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://yourcompany.com.au"
              value={data.website}
              onChange={(e) => onChange({ website: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Industry <span className="text-primary">*</span></Label>
            <Select value={data.industry || undefined} onValueChange={(v) => onChange({ industry: v ?? "" })}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Organisation size <span className="text-primary">*</span></Label>
            <Select value={data.size || undefined} onValueChange={(v) => onChange({ size: v ?? "" })}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Corporate address */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Corporate address <span className="text-primary">*</span>
          </Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Australian head office for formal correspondence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="address" className="text-xs text-muted-foreground">Street address</Label>
              <Input
                id="address"
                placeholder="Level 10, 1 Collins Street"
                value={data.address}
                onChange={(e) => onChange({ address: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="suburb" className="text-xs text-muted-foreground">Suburb / City</Label>
              <Input
                id="suburb"
                placeholder="Melbourne"
                value={data.suburb}
                onChange={(e) => onChange({ suburb: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">State</Label>
                <Select value={data.state || undefined} onValueChange={(v) => onChange({ state: v ?? "" })}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {australianStates.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="postcode" className="text-xs text-muted-foreground">Postcode</Label>
                <Input
                  id="postcode"
                  placeholder="3000"
                  maxLength={4}
                  value={data.postcode}
                  onChange={(e) => onChange({ postcode: e.target.value.replace(/\D/g, "") })}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Branding assets</Label>
          <p className="text-xs text-muted-foreground">
            High-resolution logo to brand your giving portal. PNG or SVG preferred.
          </p>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/svg+xml,image/jpeg"
            className="hidden"
            onChange={(e) => onChange({ logoFileName: e.target.files?.[0]?.name ?? "" })}
          />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="w-full h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 group"
          >
            {data.logoFileName ? (
              <>
                <ImageIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{data.logoFileName}</span>
                <span className="text-xs text-muted-foreground">Click to replace</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Upload logo
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
