"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Eye, EyeOff, Check } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Automatic Collection",
    desc: "Your POS talks directly to the portal — every round-up tracked instantly.",
  },
  {
    icon: BarChart3,
    title: "Smart Giving Rules",
    desc: "Set it once. Funds distribute to your chosen charities on your schedule.",
  },
  {
    icon: ShieldCheck,
    title: "Trustee Approval",
    desc: "Every transfer requires an authorised approval — total peace of mind.",
  },
];

const trustBadges = [
  "Bank-grade encryption",
  "ACNC-verified charities",
  "Instant tax receipts",
];

export function StepWelcome({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.includes("@") &&
    form.password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onNext();
  };

  const passwordStrength =
    form.password.length === 0
      ? 0
      : form.password.length >= 12 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password)
      ? 4
      : form.password.length >= 10
      ? 3
      : form.password.length >= 8
      ? 2
      : 1;

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col flex-1 bg-[#FFF5F1] relative overflow-hidden border-r border-orange-100">
        {/* Decorative circle accents */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full border-[40px] border-primary/6 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border-[30px] border-primary/8 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo — anchored top */}
          <div className="flex-shrink-0">
            <Image src="/logo.svg" alt="Good2Give" width={160} height={48} priority />
          </div>

          {/* Spacer pushes content to bottom */}
          <div className="flex-1" />

          {/* Hero copy — anchored bottom */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-base font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Donation Accounts Portal
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight tracking-tight mb-5">
              Turn every sale into{" "}
              <span className="text-primary">community impact.</span>
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Good2Give Donation Accounts is your secure corporate giving dashboard —
              automated collections, smart distribution, and full audit transparency.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-5 mb-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-base font-semibold leading-tight mb-0.5">
                    {f.title}
                  </p>
                  <p className="text-muted-foreground text-base leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            {trustBadges.map((b) => (
              <div
                key={b}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-orange-200 text-foreground/60 text-base"
              >
                <Check className="w-3 h-3 text-primary flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="w-full lg:w-[570px] flex-shrink-0 flex flex-col bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center px-6 py-5 border-b border-border">
          <Image src="/logo.svg" alt="Good2Give" width={120} height={36} priority />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-sm"
          >
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Create your account
              </h2>
              <p className="text-muted-foreground text-base mt-1">
                Already have an account?{" "}
                <a href="#" className="text-primary font-medium hover:underline">
                  Sign in
                </a>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-base font-medium">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="h-10 rounded-xl text-base"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-base font-medium">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="h-10 rounded-xl text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-base font-medium">
                  Work email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@company.com.au"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-10 rounded-xl text-base"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-base font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="h-10 rounded-xl text-base pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="flex gap-1 pt-1">
                    {[1, 2, 3, 4].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          lvl <= passwordStrength
                            ? passwordStrength === 4
                              ? "bg-emerald-500"
                              : passwordStrength === 3
                              ? "bg-primary"
                              : passwordStrength === 2
                              ? "bg-amber-400"
                              : "bg-red-400"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isValid || loading}
                className="w-full h-11 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-colors mt-2 disabled:opacity-40 disabled:pointer-events-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create account <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-base text-muted-foreground">
                or continue with
              </span>
            </div>

            {/* Google SSO */}
            <Button
              variant="outline"
              className="w-full h-10 rounded-xl text-base gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-base text-muted-foreground mt-6 leading-relaxed">
              By creating an account you agree to our{" "}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
