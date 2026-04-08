"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Building2, Landmark, ShieldCheck, Users, FolderSync } from "lucide-react";
import type { OnboardingData } from "../OnboardingFlow";

type Props = {
  data: OnboardingData;
  onFinish: () => void;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function StepComplete({ data, onFinish }: Props) {
  const [checked, setChecked] = useState<number[]>([]);

  const steps = [
    {
      icon: Building2,
      label: "Organisation profile created",
      sub: `${data.company.name} · ABN ${data.company.abn}`,
    },
    {
      icon: Landmark,
      label: "Banking details submitted",
      sub: `${data.banking.accountName} · BSB ${data.banking.bsb} · ${data.banking.givingPercentage}% giving rate`,
    },
    {
      icon: ShieldCheck,
      label: "Compliance & charities submitted",
      sub: `Good2Give foundation · ${data.givingRules.charities.length} ${data.givingRules.charities.length === 1 ? "charity" : "charities"}`,
    },
    {
      icon: Users,
      label: "Authorised users configured",
      sub: `${data.trustee.firstName} ${data.trustee.lastName} (Founder)${data.trustee.additionalUsers.length > 0 ? ` + ${data.trustee.additionalUsers.length} additional` : ""}`,
    },
    {
      icon: FolderSync,
      label: "Reporting schedule set",
      sub: `${data.reporting.frequency.charAt(0).toUpperCase() + data.reporting.frequency.slice(1)} SFTP uploads`,
    },
  ];

  useEffect(() => {
    (async () => {
      for (let i = 0; i < steps.length; i++) {
        await delay(300 + i * 400);
        setChecked((c) => [...c, i]);
      }
    })();
  }, []);

  return (
    <div className="text-center space-y-10">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="mx-auto w-20 h-20 rounded-full bg-primary flex items-center justify-center"
      >
        <CheckCircle2 className="w-10 h-10 text-white" />
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Application submitted!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your Foundation Account application is under review. Here's a summary of what we've received.
        </p>
      </div>

      {/* Summary checklist */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6 text-left space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={checked.includes(i) ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -10 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 p-3 rounded-2xl"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              checked.includes(i) ? "bg-primary/10" : "bg-muted"
            }`}>
              <step.icon className={`w-5 h-5 transition-colors ${
                checked.includes(i) ? "text-primary" : "text-muted-foreground"
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{step.label}</p>
              <p className="text-xs text-muted-foreground truncate">{step.sub}</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={checked.includes(i) ? { scale: 1 } : { scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={onFinish}
          className="rounded-full px-8 h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Our team will review your application and send SFTP credentials within 1–2 business days.
        </p>
      </div>
    </div>
  );
}
