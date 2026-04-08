"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  Upload,
  CheckCircle2,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrgDetails = {
  name: string;
  legalName: string;
  abn: string;
  acn: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  description: string;
};

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL: OrgDetails = {
  name:         "KFC Australia Pty Ltd",
  legalName:    "KFC Australia Pty Ltd",
  abn:          "51 004 220 518",
  acn:          "004 220 518",
  industry:     "Quick Service Restaurant",
  website:      "https://kfc.com.au",
  phone:        "+61 2 9220 0000",
  email:        "foundation@kfc.com.au",
  addressLine1: "Level 12, 100 Miller Street",
  addressLine2: "",
  city:         "North Sydney",
  state:        "NSW",
  postcode:     "2060",
  country:      "Australia",
  description:  "The KFC Foundation supports Australian charities through employee and customer giving programs.",
};

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

// ─── Logo Upload ──────────────────────────────────────────────────────────────

function LogoSection({ editing }: { editing: boolean }) {
  const [logo, setLogo]         = useState<string | null>("/kfcau.webp");
  const [dragging, setDragging] = useState(false);
  const fileRef                 = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setLogo(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">Organisation Logo</h2>

      <div className="flex items-center gap-6">
        {/* Preview */}
        <div className="w-20 h-20 rounded-2xl border border-border flex items-center justify-center bg-muted/30 flex-shrink-0 overflow-hidden">
          {logo ? (
            <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <Building2 className="w-8 h-8 text-muted-foreground/40" />
          )}
        </div>

        {/* Drop zone — only shown when editing */}
        {editing && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20"
            }`}
          >
            <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Click or drag to upload</p>
            <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, SVG up to 2MB · Recommended 400×400px</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        )}

        {editing && logo && (
          <button onClick={() => setLogo(null)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Editable field ───────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = "text", disabled = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className={`rounded-xl ${disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}`} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [org, setOrg]       = useState<OrgDetails>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]   = useState<OrgDetails>(INITIAL);
  const [saved, setSaved]   = useState(false);

  const startEdit = () => { setDraft(org); setEditing(true); setSaved(false); };
  const cancel    = () => { setEditing(false); };
  const save      = () => { setOrg(draft); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const set = (key: keyof OrgDetails) => (val: string) => setDraft((d) => ({ ...d, [key]: val }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your organisation's details and profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </motion.span>
          )}
          {editing ? (
            <>
              <Button variant="outline" onClick={cancel} className="rounded-xl gap-2 h-9 text-sm">
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button onClick={save} className="rounded-xl gap-2 h-9 text-sm">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={startEdit} className="rounded-xl gap-2 h-9 text-sm">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Logo */}
      <LogoSection editing={editing} />

      {/* Organisation identity */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Organisation Identity</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Display Name"  value={editing ? draft.name      : org.name}      onChange={set("name")}      placeholder="e.g. KFC Foundation"      disabled={!editing} />
          <Field label="Legal Name"    value={editing ? draft.legalName : org.legalName} onChange={set("legalName")} placeholder="Full registered legal name" disabled={!editing} />
          <Field label="ABN"           value={editing ? draft.abn       : org.abn}       onChange={set("abn")}       placeholder="XX XXX XXX XXX"            disabled={!editing} />
          <Field label="ACN"           value={editing ? draft.acn       : org.acn}       onChange={set("acn")}       placeholder="XXX XXX XXX"               disabled={!editing} />
          <div className="sm:col-span-2 space-y-1.5">
            <Field label="Industry / Sector" value={editing ? draft.industry : org.industry} onChange={set("industry")} placeholder="e.g. Quick Service Restaurant" disabled={!editing} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Description</Label>
            <textarea
              value={editing ? draft.description : org.description}
              onChange={(e) => set("description")(e.target.value)}
              disabled={!editing}
              rows={3}
              placeholder="Brief description of your organisation…"
              className={`w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                !editing ? "bg-muted text-muted-foreground cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Contact details */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Contact Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address" value={editing ? draft.email   : org.email}   onChange={set("email")}   type="email" placeholder="foundation@example.com.au" disabled={!editing} />
          <Field label="Phone Number"  value={editing ? draft.phone   : org.phone}   onChange={set("phone")}   type="tel"   placeholder="+61 2 XXXX XXXX"            disabled={!editing} />
          <div className="sm:col-span-2">
            <Field label="Website" value={editing ? draft.website : org.website} onChange={set("website")} type="url" placeholder="https://example.com.au" disabled={!editing} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Registered Address</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Address Line 1" value={editing ? draft.addressLine1 : org.addressLine1} onChange={set("addressLine1")} placeholder="Street address" disabled={!editing} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Address Line 2 (optional)" value={editing ? draft.addressLine2 : org.addressLine2} onChange={set("addressLine2")} placeholder="Suite, floor, etc." disabled={!editing} />
          </div>
          <Field label="City / Suburb" value={editing ? draft.city     : org.city}     onChange={set("city")}     placeholder="City"       disabled={!editing} />
          <div className="space-y-1.5">
            <Label>State</Label>
            <select
              value={editing ? draft.state : org.state}
              onChange={(e) => set("state")(e.target.value)}
              disabled={!editing}
              className={`w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                !editing ? "bg-muted text-muted-foreground cursor-not-allowed" : ""
              }`}
            >
              {AU_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Field label="Postcode" value={editing ? draft.postcode : org.postcode} onChange={set("postcode")} placeholder="XXXX" disabled={!editing} />
          <Field label="Country"  value={editing ? draft.country  : org.country}  onChange={set("country")}  placeholder="Australia"    disabled={!editing} />
        </div>
      </div>

      {/* G2G account info — read only */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">G2G Account Info</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">Read only</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Account ID",    value: "FA-20250112-KFC" },
            { label: "Account Type",  value: "Foundation Sub-Account" },
            { label: "Status",        value: "Active" },
            { label: "Created",       value: "12 Jan 2025" },
            { label: "Account Manager", value: "Sarah Lim (G2G)" },
            { label: "Admin Fee",     value: "10% per giving" },
          ].map((f) => (
            <div key={f.label} className="bg-muted/30 rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground">{f.label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
