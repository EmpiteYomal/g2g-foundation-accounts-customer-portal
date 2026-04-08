"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, User, ArrowRight, ArrowLeft } from "lucide-react";

type AccountType = "org" | "person";

type Props = {
  selected: AccountType | null;
  onSelect: (type: AccountType) => void;
  onNext: () => void;
  onBack: () => void;
};

const options = [
  {
    type: "org" as AccountType,
    icon: Building2,
    title: "Organisation",
    description:
      "Register a company, association, or corporate entity as a Foundation Account holder with full trustee-controlled giving.",
    badge: null,
  },
  {
    type: "person" as AccountType,
    icon: User,
    title: "Individual",
    description:
      "Set up a personal Foundation Account to manage and distribute your charitable giving.",
    badge: "Coming soon",
  },
];

export function StepAccountType({ selected, onSelect, onNext, onBack }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Who are you registering?</h2>
        <p className="text-muted-foreground">
          Choose the type of account you&apos;d like to set up.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt, i) => {
          const isDisabled = opt.badge !== null;
          const isSelected = selected === opt.type;
          return (
            <motion.button
              key={opt.type}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(opt.type)}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                isDisabled
                  ? "border-border bg-muted/30 opacity-60 cursor-not-allowed"
                  : isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-white hover:border-primary/40 hover:bg-primary/3 cursor-pointer"
              }`}
            >
              {opt.badge && (
                <span className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {opt.badge}
                </span>
              )}

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  isSelected ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <opt.icon
                  className={`w-5 h-5 transition-colors ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>

              <p className="font-semibold text-foreground mb-1">{opt.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {opt.description}
              </p>

              {isSelected && (
                <motion.div
                  layoutId="type-check"
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
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
          disabled={!selected}
          className="rounded-full px-6 h-10 bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
