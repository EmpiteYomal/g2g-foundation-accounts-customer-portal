"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HandCoins,
  Heart,
  Users,
  FileText,
  ChevronDown,
  MessageSquare,
  Mail,
  Phone,
  CheckCircle2,
  Wallet,
  ArrowRight,
  BookOpen,
  LifeBuoy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Feature tiles ────────────────────────────────────────────────────────────

const featureTiles = [
  {
    icon: HandCoins,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Creating a Giving",
    description: "Submit a new giving from your Foundation Account. Choose your charities, set the amount, and send for trustee approval before G2G processes it.",
    steps: ["Go to My Givings", "Click New Giving", "Select charities & enter amounts", "Submit for trustee approval"],
  },
  {
    icon: Heart,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Managing Charities",
    description: "View all G2G-verified charities your account has given to, along with a full history of givings per charity.",
    steps: ["Go to My Charities", "Click any charity to expand", "View package history, dates & amounts"],
  },
  {
    icon: Wallet,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "Account Balance",
    description: "Track your Foundation Account balance, view monthly donation trends, and browse the full transaction history with filters.",
    steps: ["Go to Account Balance", "View available balance & totals", "Filter transactions by type or period", "Export a statement"],
  },
  {
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Team & Trustees",
    description: "Manage who has access to your Foundation Account. Trustees are required to approve givings before they are sent to G2G.",
    steps: ["Go to Team & Trustees", "Invite members by email", "Assign roles (Trustee, Admin, Viewer)", "Edit or remove members anytime"],
  },
  {
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "Generating Reports",
    description: "Download giving summaries, transaction exports, charity breakdowns, and annual statements for compliance and records.",
    steps: ["Go to Reports", "Click Generate Report", "Select type, period & format", "Download PDF or CSV"],
  },
  {
    icon: BookOpen,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "Understanding Roles",
    description: "Different roles control what team members can do. Trustees approve givings. Admins can submit givings. Viewers can only read.",
    steps: ["Trustee — approve givings & manage account", "Admin — submit givings & manage charities", "Viewer — read-only access to dashboard"],
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "What is a Foundation Account?",
    a: "A Foundation Account is a dedicated sub-account managed by Good2Give (G2G) that holds funds your organisation collects for charitable giving. It separates donation funds from your operating accounts and ensures all disbursements go through verified charities.",
  },
  {
    q: "How does the approval process work?",
    a: "When you create a new giving, it is sent to a designated Trustee on your account for review. Once approved, G2G deducts an admin fee and processes payments to each charity individually. You will see the status update in My Givings.",
  },
  {
    q: "Why is a charity shown as 'Pending' or 'Reversed'?",
    a: "A pending status means the disbursement to that charity is still being processed by G2G. A reversed status means the funds were returned to your Foundation Account — this can happen if there was an issue with the specific disbursement.",
  },
  {
    q: "Can I change the allocation percentage for a charity?",
    a: "Charity allocation percentages reflect how past givings were split and are managed at the giving level. Contact your G2G account manager if you need to update your standard allocation split.",
  },
  {
    q: "What is the G2G admin fee?",
    a: "G2G charges an admin fee (currently 10%) on each giving to cover processing, compliance checks, and platform costs. The fee is deducted from the gross amount before disbursement to charities.",
  },
  {
    q: "How do I add or remove a trustee?",
    a: "Go to Team & Trustees, click Invite Member, enter their email, and assign the Trustee role. To remove a trustee, click the trash icon on their row. Note: at least one active trustee is required to approve givings.",
  },
  {
    q: "What file formats are available for reports?",
    a: "Reports are available as PDF (for summaries and statements) or CSV (for transaction exports). Go to Reports and click Generate Report to choose your format.",
  },
  {
    q: "How often is my account balance updated?",
    a: "Your account balance reflects confirmed transactions processed by G2G. Inflows from bank transfers or card donations are typically reflected within 1–2 business days of confirmation.",
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ faq, index }: { faq: typeof faqs[number]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="border-b border-border last:border-0">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors gap-4">
        <p className="text-sm font-semibold text-foreground">{faq.q}</p>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden">
            <p className="text-sm text-muted-foreground leading-relaxed px-5 pb-4">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

type Category = "giving" | "account" | "technical" | "billing" | "other";

const categoryOptions: { value: Category; label: string }[] = [
  { value: "giving",    label: "Giving & Disbursements" },
  { value: "account",   label: "Account & Balance"      },
  { value: "technical", label: "Technical Issue"        },
  { value: "billing",   label: "Billing & Fees"         },
  { value: "other",     label: "Other"                  },
];

function ContactForm() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [category, setCategory] = useState<Category>("giving");
  const [message,  setMessage]  = useState("");
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState("");

  const submit = () => {
    if (!name.trim())    return setError("Please enter your name.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email.");
    if (!message.trim()) return setError("Please enter a message.");
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <p className="text-base font-bold text-foreground">Message sent!</p>
          <p className="text-sm text-muted-foreground mt-1">Our support team will get back to you within 1 business day.</p>
        </div>
        <Button variant="outline" onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); setError(""); }}
          className="rounded-xl text-sm mt-2">
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cf-name">Full name</Label>
          <Input id="cf-name" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="Your name" className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-email">Email address</Label>
          <Input id="cf-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@example.com" className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Category</Label>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((opt) => (
            <button key={opt.value} onClick={() => setCategory(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                category === opt.value
                  ? "bg-primary text-white border-primary"
                  : "text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cf-message">Message</Label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => { setMessage(e.target.value); setError(""); }}
          placeholder="Describe your issue or question in detail…"
          rows={5}
          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button onClick={submit} className="w-full rounded-xl gap-2">
        <MessageSquare className="w-4 h-4" /> Send Message
      </Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SupportPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Guides, answers, and direct support for your Foundation Account.
        </p>
      </div>

      {/* System status banner */}
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <p className="text-sm text-emerald-800 font-medium">All systems operational</p>
        <span className="text-xs text-emerald-600 ml-auto">Last checked: 8 Apr 2026, 9:00 AM</span>
      </div>

      {/* Feature tiles */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-4">How things work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {featureTiles.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <motion.div key={tile.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border p-5 space-y-3 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${tile.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${tile.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{tile.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{tile.description}</p>
                </div>
                <ul className="space-y-1.5 pt-1 border-t border-border">
                  {tile.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAQ + Contact side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* FAQ */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <LifeBuoy className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Frequently Asked Questions</h2>
          </div>
          <div>
            {faqs.map((faq, i) => <FaqItem key={i} faq={faq} index={i} />)}
          </div>
        </div>

        {/* Contact + direct contacts */}
        <div className="xl:col-span-2 space-y-4">
          {/* Contact form */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-5">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Contact Support</h2>
            </div>
            <ContactForm />
          </div>

          {/* Direct contact options */}
          <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Other ways to reach us</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground">support@good2give.ngo</p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">1 business day</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Phone</p>
                  <p className="text-xs text-muted-foreground">1300 764 011</p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">Mon–Fri 9–5</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground border-t border-border pt-3">
              For urgent issues with a pending giving approval, please call directly during business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
