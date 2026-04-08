"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Pencil,
  X,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Upload,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
};

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL: UserDetails = {
  firstName:  "Jane",
  lastName:   "Smith",
  email:      "jane@kfc.com.au",
  phone:      "+61 412 345 678",
  jobTitle:   "Head of Corporate Giving",
  department: "Foundation & Community",
};

// ─── Password Reset Section ───────────────────────────────────────────────────

function PasswordSection() {
  const [open,        setOpen]        = useState(false);
  const [current,    setCurrent]    = useState("");
  const [newPwd,     setNewPwd]     = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showCon,    setShowCon]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);

  const strength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8)          score++;
    if (/[A-Z]/.test(pwd))        score++;
    if (/[0-9]/.test(pwd))        score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"];
  const pwdStrength = strength(newPwd);

  const submit = () => {
    if (!current)               return setError("Please enter your current password.");
    if (newPwd.length < 8)      return setError("New password must be at least 8 characters.");
    if (newPwd !== confirm)     return setError("Passwords do not match.");
    setError("");
    setSuccess(true);
    setCurrent(""); setNewPwd(""); setConfirm("");
    setTimeout(() => { setSuccess(false); setOpen(false); }, 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Password</h2>
        </div>
        {!open && (
          <Button variant="outline" onClick={() => { setOpen(true); setSuccess(false); }}
            className="rounded-xl gap-2 h-8 text-xs">
            <Pencil className="w-3.5 h-3.5" /> Change Password
          </Button>
        )}
      </div>

      {!open && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
        </div>
      )}

      {open && !success && (
        <div className="space-y-4">
          {/* Current password */}
          <div className="space-y-1.5">
            <Label>Current password</Label>
            <div className="relative">
              <Input type={showCur ? "text" : "password"} value={current}
                onChange={(e) => { setCurrent(e.target.value); setError(""); }}
                placeholder="Enter current password" className="rounded-xl pr-10" />
              <button onClick={() => setShowCur((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <Label>New password</Label>
            <div className="relative">
              <Input type={showNew ? "text" : "password"} value={newPwd}
                onChange={(e) => { setNewPwd(e.target.value); setError(""); }}
                placeholder="Min. 8 characters" className="rounded-xl pr-10" />
              <button onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPwd && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwdStrength ? strengthColor[pwdStrength] : "bg-muted"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{strengthLabel[pwdStrength]}</p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label>Confirm new password</Label>
            <div className="relative">
              <Input type={showCon ? "text" : "password"} value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                placeholder="Re-enter new password" className="rounded-xl pr-10" />
              <button onClick={() => setShowCon((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirm && newPwd && confirm !== newPwd && (
              <p className="text-xs text-red-600">Passwords do not match.</p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setOpen(false); setCurrent(""); setNewPwd(""); setConfirm(""); setError(""); }}
              className="flex-1 rounded-xl gap-2">
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button onClick={submit} className="flex-1 rounded-xl gap-2">
              <Lock className="w-4 h-4" /> Update Password
            </Button>
          </div>
        </div>
      )}

      {success && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">Password updated successfully.</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

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

export function AccountSettingsPage() {
  const [user,     setUser]    = useState<UserDetails>(INITIAL);
  const [editing,  setEditing] = useState(false);
  const [draft,    setDraft]   = useState<UserDetails>(INITIAL);
  const [saved,    setSaved]   = useState(false);
  const [avatar,   setAvatar]  = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const startEdit = () => { setDraft(user); setEditing(true); setSaved(false); };
  const cancel    = () => setEditing(false);
  const save      = () => { setUser(draft); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const set = (key: keyof UserDetails) => (val: string) => setDraft((d) => ({ ...d, [key]: val }));

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your personal profile and security settings.
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

      {/* Avatar + name banner */}
      <div className="bg-white rounded-2xl border border-border p-6 flex items-center gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center overflow-hidden border-2 border-border">
            {avatar
              ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              : <span className="text-white text-xl font-bold">{initials}</span>
            }
          </div>
        </div>

        {/* Upload controls — only in edit mode */}
        {editing ? (
          <div className="flex items-center gap-4 flex-1">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleAvatarFile(f); }}
              onClick={() => fileRef.current?.click()}
              className={`flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20"
              }`}
            >
              <Upload className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-sm font-medium text-foreground">Click or drag to upload</p>
              <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG up to 2MB · Square recommended</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarFile(f); }} />
            </div>
            {avatar && (
              <button onClick={() => setAvatar(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold text-foreground">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-muted-foreground">{user.jobTitle} · {user.department}</p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              <Shield className="w-3 h-3" /> Trustee
            </span>
          </div>
        )}
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name"  value={editing ? draft.firstName  : user.firstName}  onChange={set("firstName")}  placeholder="First name"  disabled={!editing} />
          <Field label="Last Name"   value={editing ? draft.lastName   : user.lastName}   onChange={set("lastName")}   placeholder="Last name"   disabled={!editing} />
          <Field label="Job Title"   value={editing ? draft.jobTitle   : user.jobTitle}   onChange={set("jobTitle")}   placeholder="Your role"   disabled={!editing} />
          <Field label="Department"  value={editing ? draft.department : user.department} onChange={set("department")} placeholder="Department"   disabled={!editing} />
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Contact Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address" value={editing ? draft.email : user.email} onChange={set("email")} type="email" placeholder="you@example.com" disabled={!editing} />
          <Field label="Phone Number"  value={editing ? draft.phone : user.phone} onChange={set("phone")} type="tel"   placeholder="+61 4XX XXX XXX" disabled={!editing} />
        </div>
      </div>

      {/* Password */}
      <PasswordSection />

      {/* Account info — read only */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Account Info</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">Read only</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Role",           value: "Trustee" },
            { label: "Account",        value: "KFC Foundation" },
            { label: "Member since",   value: "12 Jan 2025" },
            { label: "Last login",     value: "8 Apr 2026, 9:02 AM" },
            { label: "2FA",            value: "Not enabled" },
            { label: "Session",        value: "Active" },
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
