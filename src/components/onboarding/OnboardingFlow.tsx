"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StepWelcome } from "./steps/StepWelcome";
import { StepCompany } from "./steps/StepCompany";
import { StepIntegration } from "./steps/StepIntegration";
import { StepGivingRules } from "./steps/StepGivingRules";
import { StepTrustee } from "./steps/StepTrustee";
import { StepComplete } from "./steps/StepComplete";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export type OnboardingData = {
  company: {
    name: string;
    abn: string;
    industry: string;
    size: string;
    website: string;
  };
  integration: {
    posSystem: string;
    apiKey: string;
    roundupEnabled: boolean;
    percentageEnabled: boolean;
    percentage: string;
  };
  givingRules: {
    frequency: string;
    charities: { name: string; allocation: number }[];
  };
  trustee: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
};

export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
};

const STEPS = [
  { id: 0, label: "Welcome" },
  { id: 1, label: "Company" },
  { id: 2, label: "Integration" },
  { id: 3, label: "Giving Rules" },
  { id: 4, label: "Trustee" },
  { id: 5, label: "Complete" },
];

const TOTAL_STEPS = STEPS.length - 1;

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    company: { name: "", abn: "", industry: "", size: "", website: "" },
    integration: {
      posSystem: "",
      apiKey: "",
      roundupEnabled: true,
      percentageEnabled: false,
      percentage: "1",
    },
    givingRules: {
      frequency: "weekly",
      charities: [
        { name: "Red Cross Australia", allocation: 60 },
        { name: "Salvation Army", allocation: 40 },
      ],
    },
    trustee: { firstName: "", lastName: "", email: "", phone: "", role: "" },
  });

  const updateData = (section: keyof OnboardingData, values: Partial<OnboardingData[keyof OnboardingData]>) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...values },
    }));
  };

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const finish = () => {
    router.push("/dashboard");
  };

  const progressPercent = step <= 1 ? 0 : Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  // Step 0 gets its own full-screen split layout
  if (step === 0) {
    return <StepWelcome onNext={next} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F8] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur border-b border-border">
        <Image src="/logo.svg" alt="Good2Give" width={120} height={36} priority />

        {step < STEPS.length - 1 && (
          <div className="hidden sm:flex items-center gap-6">
            {STEPS.slice(1, -1).map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 text-base transition-colors ${
                  step === i + 1
                    ? "text-primary font-medium"
                    : step > i + 1
                    ? "text-muted-foreground"
                    : "text-muted-foreground/40"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-base border transition-colors ${
                    step > i + 1
                      ? "bg-primary border-primary text-white"
                      : step === i + 1
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground/40"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </span>
                {s.label}
              </div>
            ))}
          </div>
        )}

        <div className="text-base text-muted-foreground">
          {step < STEPS.length - 1 && (
            <span>Step {step} of {TOTAL_STEPS - 1}</span>
          )}
        </div>
      </header>

      {step < STEPS.length - 1 && (
        <Progress value={progressPercent} className="h-0.5 rounded-none bg-border" />
      )}

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            {step === 1 && (
              <StepCompany
                data={data.company}
                onChange={(v) => updateData("company", v)}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 2 && (
              <StepIntegration
                data={data.integration}
                onChange={(v) => updateData("integration", v)}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && (
              <StepGivingRules
                data={data.givingRules}
                onChange={(v) => updateData("givingRules", v)}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 4 && (
              <StepTrustee
                data={data.trustee}
                onChange={(v) => updateData("trustee", v)}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 5 && <StepComplete data={data} onFinish={finish} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
