"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";

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

export function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-10">
      {/* Hero */}
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Foundation Accounts Portal
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Turn every sale into{" "}
          <span className="text-primary">community impact.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Good2Give DonationLink is your secure corporate giving dashboard —
          automated collections, smart distribution, and full audit transparency.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={onNext}
          className="rounded-full px-8 h-12 text-base font-semibold brand-gradient border-0 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
        >
          Get Started <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <p className="text-xs text-muted-foreground">Takes about 5 minutes · No credit card required</p>
      </div>
    </div>
  );
}
