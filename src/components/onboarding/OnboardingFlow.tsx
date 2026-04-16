"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StepWelcome } from "./steps/StepWelcome";
import { StepAccountType } from "./steps/StepAccountType";
import { StepCompany } from "./steps/StepCompany";
import { StepTrustee } from "./steps/StepTrustee";
import { StepPersonal } from "./steps/StepPersonal";
import { StepComplete } from "./steps/StepComplete";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export type AccountType = "org" | "person";

export type OnboardingData = {
  accountType: AccountType | null;
  company: {
    name: string;
    abn: string;
    industry: string;
    size: string;
    website: string;
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    logoFileName: string;
  };
  trustee: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    dateOfBirth: string;
  };
  personal: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    suburb: string;
    state: string;
    postcode: string;
  };
};

const ORG_STEPS = [
  { id: 0, label: "Welcome" },
  { id: 1, label: "Account type" },
  { id: 2, label: "Organisation" },
  { id: 3, label: "Trustee" },
  { id: 4, label: "Complete" },
];

const PERSON_STEPS = [
  { id: 0, label: "Welcome" },
  { id: 1, label: "Account type" },
  { id: 2, label: "Personal details" },
  { id: 3, label: "Complete" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    accountType: null,
    company: {
      name: "",
      abn: "",
      industry: "",
      size: "",
      website: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      logoFileName: "",
    },
    trustee: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      dateOfBirth: "",
    },
    personal: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
    },
  });

  type NestedSection = Exclude<keyof OnboardingData, "accountType">;

  const updateData = <K extends NestedSection>(
    section: K,
    values: Partial<OnboardingData[K]>
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...values },
    }));
  };

  // Determine the active step list based on chosen account type
  const activeSteps = data.accountType === "person" ? PERSON_STEPS : ORG_STEPS;
  const maxStep = activeSteps.length - 1;

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, maxStep));
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const finish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accountType", data.accountType ?? "org");
    }
    router.push("/dashboard");
  };

  // Nav steps = everything between Welcome and Complete
  const navSteps = activeSteps.slice(1, -1);
  const totalNavSteps = navSteps.length;
  const progressPercent = step <= 1 ? 0 : Math.min(100, Math.round(((step - 1) / totalNavSteps) * 100));

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  if (step === 0) {
    return <StepWelcome onNext={next} />;
  }

  const isComplete = step === maxStep;

  return (
    <div className="min-h-screen bg-[#FAF9F8] flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur border-b border-border">
        <Image src="/logo.svg" alt="Goodstack Foundation Accounts" width={120} height={36} priority />

        {!isComplete && (
          <div className="hidden sm:flex items-center gap-6">
            {navSteps.map((s, i) => (
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
          {!isComplete && (
            <span>Step {step} of {totalNavSteps}</span>
          )}
        </div>
      </header>

      {!isComplete && (
        <div className="sticky top-[65px] z-30">
          <Progress value={progressPercent} className="h-0.5 rounded-none bg-border" />
        </div>
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
              <StepAccountType
                selected={data.accountType}
                onSelect={(type) => setData((prev) => ({ ...prev, accountType: type }))}
                onNext={next}
                onBack={back}
              />
            )}

            {/* ── Org flow ── */}
            {step === 2 && data.accountType !== "person" && (
              <StepCompany
                data={data.company}
                onChange={(v) => updateData("company", v)}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && data.accountType !== "person" && (
              <StepTrustee
                data={data.trustee}
                onChange={(v) => updateData("trustee", v)}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 4 && <StepComplete data={data} onFinish={finish} />}

            {/* ── Individual flow ── */}
            {step === 2 && data.accountType === "person" && (
              <StepPersonal
                data={data.personal}
                onChange={(v) => updateData("personal", v)}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && data.accountType === "person" && (
              <StepComplete data={data} onFinish={finish} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
