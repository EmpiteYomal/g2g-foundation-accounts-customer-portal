"use client";

import { useState, useRef, useEffect } from "react";
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
  User,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

// ─── Shared field component ───────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// ORG SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

type OrgDetails = {
  name: string; legalName: string; abn: string; acn: string;
  industry: string; website: string; phone: string; email: string;
  addressLine1: string; addressLine2: string; city: string;
  state: string; postcode: string; country: string; description: string;
};

const ORG_INITIAL: OrgDetails = {
  name: "KFC Australia Pty Ltd", legalName: "KFC Australia Pty Ltd",
  abn: "51 004 220 518", acn: "004 220 518",
  industry: "Quick Service Restaurant", website: "https://kfc.com.au",
  phone: "+61 2 9220 0000", email: "foundation@kfc.com.au",
  addressLine1: "Level 12, 100 Miller Street", addressLine2: "",
  city: "North Sydney", state: "NSW", postcode: "2060", country: "Australia",
  description: "The KFC Foundation supports Australian charities through employee and customer giving programs.",
};

function OrgLogoSection({ editing }: { editing: boolean }) {
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
        <div className="w-20 h-20 rounded-2xl border border-border flex items-center justify-center bg-muted/30 flex-shrink-0 overflow-hidden">
          {logo ? <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
                : <Building2 className="w-8 h-8 text-muted-foreground/40" />}
        </div>
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

function OrgSettings() {
  const [org, setOrg]     = useState<OrgDetails>(ORG_INITIAL);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<OrgDetails>(ORG_INITIAL);
  const [saved, setSaved] = useState(false);

  const startEdit = () => { setDraft(org); setEditing(true); setSaved(false); };
  const cancel    = () => setEditing(false);
  const save      = () => { setOrg(draft); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const set = (key: keyof OrgDetails) => (val: string) => setDraft((d) => ({ ...d, [key]: val }));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your organisation&apos;s details and profile.</p>
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
              <Button variant="outline" onClick={cancel} className="rounded-xl gap-2 h-9 text-sm"><X className="w-4 h-4" /> Cancel</Button>
              <Button onClick={save} className="rounded-xl gap-2 h-9 text-sm"><Save className="w-4 h-4" /> Save Changes</Button>
            </>
          ) : (
            <Button variant="outline" onClick={startEdit} className="rounded-xl gap-2 h-9 text-sm"><Pencil className="w-4 h-4" /> Edit</Button>
          )}
        </div>
      </div>

      <OrgLogoSection editing={editing} />

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Organisation Identity</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Display Name"  value={editing ? draft.name      : org.name}      onChange={set("name")}      placeholder="e.g. KFC Foundation"          disabled={!editing} />
          <Field label="Legal Name"    value={editing ? draft.legalName : org.legalName} onChange={set("legalName")} placeholder="Full registered legal name"    disabled={!editing} />
          <Field label="ABN"           value={editing ? draft.abn       : org.abn}       onChange={set("abn")}       placeholder="XX XXX XXX XXX"                disabled={!editing} />
          <Field label="ACN"           value={editing ? draft.acn       : org.acn}       onChange={set("acn")}       placeholder="XXX XXX XXX"                   disabled={!editing} />
          <div className="sm:col-span-2">
            <Field label="Industry / Sector" value={editing ? draft.industry : org.industry} onChange={set("industry")} placeholder="e.g. Quick Service Restaurant" disabled={!editing} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Description</Label>
            <textarea value={editing ? draft.description : org.description}
              onChange={(e) => set("description")(e.target.value)} disabled={!editing} rows={3}
              placeholder="Brief description of your organisation…"
              className={`w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                !editing ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}`}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Contact Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address" value={editing ? draft.email   : org.email}   onChange={set("email")}   type="email" placeholder="foundation@example.com.au" disabled={!editing} />
          <Field label="Phone Number"  value={editing ? draft.phone   : org.phone}   onChange={set("phone")}   type="tel"   placeholder="+61 2 XXXX XXXX"           disabled={!editing} />
          <div className="sm:col-span-2">
            <Field label="Website" value={editing ? draft.website : org.website} onChange={set("website")} type="url" placeholder="https://example.com.au" disabled={!editing} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Registered Address</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Field label="Address Line 1" value={editing ? draft.addressLine1 : org.addressLine1} onChange={set("addressLine1")} placeholder="Street address" disabled={!editing} /></div>
          <div className="sm:col-span-2"><Field label="Address Line 2 (optional)" value={editing ? draft.addressLine2 : org.addressLine2} onChange={set("addressLine2")} placeholder="Suite, floor, etc." disabled={!editing} /></div>
          <Field label="City / Suburb" value={editing ? draft.city     : org.city}     onChange={set("city")}     placeholder="City"      disabled={!editing} />
          <div className="space-y-1.5">
            <Label>State</Label>
            <select value={editing ? draft.state : org.state} onChange={(e) => set("state")(e.target.value)} disabled={!editing}
              className={`w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${!editing ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}`}>
              {AU_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Field label="Postcode" value={editing ? draft.postcode : org.postcode} onChange={set("postcode")} placeholder="XXXX"      disabled={!editing} />
          <Field label="Country"  value={editing ? draft.country  : org.country}  onChange={set("country")}  placeholder="Australia" disabled={!editing} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">G2G Account Info</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">Read only</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Account ID",      value: "FA-20250112-KFC" },
            { label: "Account Type",    value: "Foundation Sub-Account" },
            { label: "Status",          value: "Active" },
            { label: "Created",         value: "12 Jan 2025" },
            { label: "Account Manager", value: "Sarah Lim (G2G)" },
            { label: "Admin Fee",       value: "10% per giving" },
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

// ─────────────────────────────────────────────────────────────────────────────
// PERSONAL SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

type PersonDetails = {
  firstName: string; lastName: string; dateOfBirth: string;
  email: string; phone: string;
  addressLine1: string; addressLine2: string;
  suburb: string; state: string; postcode: string;
};

const PERSON_INITIAL: PersonDetails = {
  firstName: "Jane", lastName: "Smith", dateOfBirth: "1985-07-15",
  email: "jane.smith@gmail.com", phone: "+61 412 345 678",
  addressLine1: "24 Harbour View Drive", addressLine2: "",
  suburb: "Kirribilli", state: "NSW", postcode: "2061",
};

function AvatarSection({ editing }: { editing: boolean }) {
  const [photo, setPhoto]       = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef                 = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">Profile Photo</h2>
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border border-border flex items-center justify-center bg-primary flex-shrink-0 overflow-hidden">
          {photo
            ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            : <span className="text-white text-2xl font-bold">JS</span>
          }
        </div>
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
            <p className="text-xs text-muted-foreground mt-0.5">PNG or JPG up to 2MB · Square image recommended</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        )}
        {editing && photo && (
          <button onClick={() => setPhoto(null)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function PersonalSettings() {
  const [person, setPerson] = useState<PersonDetails>(PERSON_INITIAL);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]   = useState<PersonDetails>(PERSON_INITIAL);
  const [saved, setSaved]   = useState(false);

  const startEdit = () => { setDraft(person); setEditing(true); setSaved(false); };
  const cancel    = () => setEditing(false);
  const save      = () => { setPerson(draft); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const set = (key: keyof PersonDetails) => (val: string) => setDraft((d) => ({ ...d, [key]: val }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your personal details and account preferences.</p>
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
              <Button variant="outline" onClick={cancel} className="rounded-xl gap-2 h-9 text-sm"><X className="w-4 h-4" /> Cancel</Button>
              <Button onClick={save} className="rounded-xl gap-2 h-9 text-sm"><Save className="w-4 h-4" /> Save Changes</Button>
            </>
          ) : (
            <Button variant="outline" onClick={startEdit} className="rounded-xl gap-2 h-9 text-sm"><Pencil className="w-4 h-4" /> Edit</Button>
          )}
        </div>
      </div>

      {/* Avatar */}
      <AvatarSection editing={editing} />

      {/* Personal identity */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Personal Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name"     value={editing ? draft.firstName   : person.firstName}   onChange={set("firstName")}   placeholder="Jane"       disabled={!editing} />
          <Field label="Last Name"      value={editing ? draft.lastName    : person.lastName}    onChange={set("lastName")}    placeholder="Smith"      disabled={!editing} />
          <div className="sm:col-span-2">
            <Field label="Date of Birth" value={editing ? draft.dateOfBirth : person.dateOfBirth} onChange={set("dateOfBirth")} type="date"              disabled={!editing} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Contact Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address" value={editing ? draft.email : person.email} onChange={set("email")} type="email" placeholder="jane@gmail.com"  disabled={!editing} />
          <Field label="Mobile Number" value={editing ? draft.phone : person.phone} onChange={set("phone")} type="tel"   placeholder="+61 4XX XXX XXX" disabled={!editing} />
        </div>
      </div>

      {/* Residential address */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Residential Address</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Address Line 1" value={editing ? draft.addressLine1 : person.addressLine1} onChange={set("addressLine1")} placeholder="Street address" disabled={!editing} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Address Line 2 (optional)" value={editing ? draft.addressLine2 : person.addressLine2} onChange={set("addressLine2")} placeholder="Unit, apartment, etc." disabled={!editing} />
          </div>
          <Field label="Suburb" value={editing ? draft.suburb : person.suburb} onChange={set("suburb")} placeholder="Suburb" disabled={!editing} />
          <div className="space-y-1.5">
            <Label>State</Label>
            <select value={editing ? draft.state : person.state} onChange={(e) => set("state")(e.target.value)} disabled={!editing}
              className={`w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${!editing ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}`}>
              {AU_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Field label="Postcode" value={editing ? draft.postcode : person.postcode} onChange={set("postcode")} placeholder="XXXX" disabled={!editing} />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Security</h2>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border/60">
          <div>
            <p className="text-sm font-medium text-foreground">Password</p>
            <p className="text-xs text-muted-foreground mt-0.5">Last changed 3 months ago</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs">Change password</Button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground mt-0.5">Extra layer of security for your account</p>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Enabled</span>
        </div>
      </div>

      {/* G2G account info */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">G2G Account Info</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">Read only</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Account ID",      value: "FA-20250112-JS" },
            { label: "Account Type",    value: "Personal Foundation Account" },
            { label: "Status",          value: "Active" },
            { label: "Created",         value: "12 Jan 2025" },
            { label: "Account Manager", value: "Sarah Lim (G2G)" },
            { label: "Admin Fee",       value: "10% per giving" },
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

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT — picks which settings to show
// ─────────────────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [accountType, setAccountType] = useState<"org" | "person">("org");

  useEffect(() => {
    if (localStorage.getItem("accountType") === "person") setAccountType("person");
  }, []);

  return accountType === "person" ? <PersonalSettings /> : <OrgSettings />;
}
