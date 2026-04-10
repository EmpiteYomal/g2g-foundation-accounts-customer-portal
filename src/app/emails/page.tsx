"use client";

import { useState } from "react";
import { AccountApprovedEmail } from "./templates/AccountApprovedEmail";
import { ApplicationReceivedEmail } from "./templates/ApplicationReceivedEmail";
import { NewUserInvitationEmail } from "./templates/NewUserInvitationEmail";
import { DisbursementApprovedEmail } from "./templates/DisbursementApprovedEmail";
import { PasswordResetEmail } from "./templates/PasswordResetEmail";
import { Copy, Check, ChevronRight, Mail, Download } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// ─── Template registry ────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "application-received",
    label: "Application Received",
    description: "Sent immediately after the user submits their onboarding application.",
    trigger: "User completes onboarding",
    recipient: "Account Founder",
    subject: "We've received your Foundation Account application",
    component: ApplicationReceivedEmail,
  },
  {
    id: "new-user-invitation",
    label: "New User Invitation",
    description: "Sent when a team member is invited to a Foundation Account.",
    trigger: "Account holder invites a team member",
    recipient: "Invited team member",
    subject: "You've been invited to join a Foundation Account",
    component: NewUserInvitationEmail,
  },
  {
    id: "disbursement-approved",
    label: "Disbursement Approved",
    description: "Sent when a trustee approves a fund transfer to charities.",
    trigger: "Trustee approves disbursement",
    recipient: "Account Founder + all users",
    subject: "Disbursement approved — funds are on their way",
    component: DisbursementApprovedEmail,
  },
  {
    id: "password-reset",
    label: "Password Reset",
    description: "Sent when a user requests a password reset.",
    trigger: "User clicks 'Forgot password'",
    recipient: "The requesting user",
    subject: "Reset your Goodstack Foundation Account password",
    component: PasswordResetEmail,
  },
  {
    id: "account-approved",
    label: "Account Approved",
    description: "Sent when G2G approves a Foundation Account application.",
    trigger: "Admin approves application",
    recipient: "Account Founder",
    subject: "Your Foundation Account is approved 🎉",
    component: AccountApprovedEmail,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmailTemplatesPage() {
  const [selected, setSelected] = useState("application-received");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "html">("preview");

  const template = TEMPLATES.find((t) => t.id === selected)!;
  const Component = template.component;

  const getHtml = () => {
    try {
      return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${template.label}</title>\n</head>\n<body style="margin:0;padding:0;">\n${renderToStaticMarkup(<Component />)}\n</body>\n</html>`;
    } catch {
      return "<!-- Unable to render HTML -->";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getHtml()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([getHtml()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F2] flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-900">Email Templates</span>
            <span className="ml-2 text-xs text-gray-400">Goodstack Foundation Accounts</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-medium">
            {(["preview", "html"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                  viewMode === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {mode === "html" ? "HTML" : "Preview"}
              </button>
            ))}
          </div>
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy HTML"}
          </button>
          {/* Download button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download HTML
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="px-4 pt-5 pb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Templates</p>
          </div>
          <nav className="px-2 pb-4 space-y-0.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${
                  selected === t.id
                    ? "bg-orange-50 text-orange-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.label}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{t.trigger}</p>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ml-2 transition-colors ${
                  selected === t.id ? "text-orange-500" : "text-gray-300 group-hover:text-gray-400"
                }`} />
              </button>
            ))}
          </nav>

          {/* Template meta */}
          <div className="mx-3 mt-2 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-500">About this template</p>
            <div className="space-y-1.5">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Trigger</p>
                <p className="text-xs text-gray-700 font-medium">{template.trigger}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Recipient</p>
                <p className="text-xs text-gray-700 font-medium">{template.recipient}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main preview area ── */}
        <main className="flex-1 overflow-y-auto">
          {viewMode === "preview" ? (
            <div className="py-8 px-6">
              {/* Device frame label */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-gray-400 font-medium">{template.label}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">600px width · Email client preview</span>
              </div>

              {/* Email preview wrapper with shadow to simulate email client */}
              <div className="mx-auto max-w-[640px] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/60 ring-1 ring-gray-200">
                {/* Fake email client chrome */}
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span className="font-semibold w-12 text-right flex-shrink-0">From:</span>
                      <span>Goodstack Foundation Accounts &lt;noreply@goodstack.io&gt;</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold w-12 text-right flex-shrink-0">To:</span>
                      <span>jane.smith@kfc.com.au</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold w-12 text-right flex-shrink-0">Subject:</span>
                      <span className="font-medium text-gray-700">{template.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Email body */}
                <div className="bg-white">
                  <Component />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-6 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
                {getHtml()}
              </pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
