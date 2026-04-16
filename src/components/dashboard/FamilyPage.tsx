"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  CheckCircle2,
  Clock,
  Heart,
  Eye,
  Plus,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "co-holder" | "viewer";
type MemberStatus = "active" | "invited";

type FamilyMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  relationship: string;
  status: MemberStatus;
  joinedDate: string;
  lastActive?: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: FamilyMember[] = [
  { id: "f1", name: "Tom Smith",    email: "tom.smith@gmail.com",   role: "co-holder", relationship: "Spouse",  status: "active",  joinedDate: "12 Jan 2025", lastActive: "Today"      },
  { id: "f2", name: "Emily Smith",  email: "emily.s@gmail.com",     role: "viewer",    relationship: "Daughter",status: "active",  joinedDate: "3 Mar 2025",  lastActive: "7 Apr 2026" },
  { id: "f3", name: "Oliver Smith", email: "o.smith@outlook.com",   role: "viewer",    relationship: "Son",     status: "invited", joinedDate: "6 Apr 2026"                            },
];

const roleConfig: Record<Role, { label: string; cls: string; icon: React.ElementType; desc: string }> = {
  "co-holder": { label: "Co-Holder", icon: Heart,  cls: "text-rose-800 bg-rose-50 border-rose-200",  desc: "Full access — can view and submit givings" },
  "viewer":    { label: "Viewer",    icon: Eye,     cls: "text-gray-700 bg-gray-50 border-gray-200",  desc: "Can view dashboard and reports only" },
};

const statusConfig: Record<MemberStatus, { label: string; icon: React.ElementType; cls: string }> = {
  active:  { label: "Active",  icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  invited: { label: "Invited", icon: Clock,        cls: "text-amber-700  bg-amber-50  border-amber-200"     },
};

const RELATIONSHIPS = ["Spouse / Partner", "Parent", "Child", "Sibling", "Other"];

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ onClose, onInvite }: {
  onClose: () => void;
  onInvite: (m: Omit<FamilyMember, "id">) => void;
}) {
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [role,         setRole]         = useState<Role>("viewer");
  const [relationship, setRelationship] = useState("");
  const [error,        setError]        = useState("");

  const submit = () => {
    if (!name.trim())  return setError("Name is required.");
    if (!email.trim() || !email.includes("@")) return setError("Valid email is required.");
    if (!relationship) return setError("Please select a relationship.");
    onInvite({ name: name.trim(), email: email.trim(), role, relationship, status: "invited", joinedDate: "8 Apr 2026" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }} transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Add a person</h2>
            <p className="text-sm text-muted-foreground mt-0.5">They&apos;ll receive an email invitation.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="inv-name">Full name</Label>
            <Input id="inv-name" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Alex Smith" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-email">Email address</Label>
            <Input id="inv-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="e.g. alex@gmail.com" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-rel">Relationship</Label>
            <select
              id="inv-rel"
              value={relationship}
              onChange={(e) => { setRelationship(e.target.value); setError(""); }}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select relationship</option>
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Access level</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([r, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                      role === r ? `${cfg.cls} border-current` : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-semibold">{cfg.label}</span>
                    <span className="opacity-70 font-normal leading-tight">{cfg.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={submit} className="flex-1 rounded-xl">Send Invite</Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ member, onClose, onSave }: {
  member: FamilyMember;
  onClose: () => void;
  onSave: (id: string, role: Role) => void;
}) {
  const [role, setRole] = useState<Role>(member.role);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }} transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Edit access</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-3">Changing access for <strong>{member.name}</strong></p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([r, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button key={r} onClick={() => setRole(r)}
                  className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                    role === r ? `${cfg.cls} border-current` : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={() => { onSave(member.id, role); onClose(); }} className="flex-1 rounded-xl">Save</Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Remove Modal ─────────────────────────────────────────────────────────────

function RemoveModal({ member, onClose, onConfirm }: {
  member: FamilyMember;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }} transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Remove person?</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              <strong>{member.name}</strong> will lose all access to your Foundation Account.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={() => { onConfirm(member.id); onClose(); }}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white">
            Remove
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Member Row ───────────────────────────────────────────────────────────────

function MemberRow({ member, index, onEdit, onRemove }: {
  member: FamilyMember;
  index: number;
  onEdit: (m: FamilyMember) => void;
  onRemove: (m: FamilyMember) => void;
}) {
  const role   = roleConfig[member.role];
  const status = statusConfig[member.status];
  const RoleIcon   = role.icon;
  const StatusIcon = status.icon;
  const initials = member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
    >
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary">{initials}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
          <span className="hidden sm:inline text-xs text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">{member.relationship}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
        </div>
      </div>

      <div className="hidden md:block text-right flex-shrink-0">
        <p className="text-xs text-muted-foreground">Joined</p>
        <p className="text-xs font-medium text-foreground">{member.joinedDate}</p>
      </div>

      {member.lastActive && (
        <div className="hidden lg:block text-right flex-shrink-0">
          <p className="text-xs text-muted-foreground">Last active</p>
          <p className="text-xs font-medium text-foreground">{member.lastActive}</p>
        </div>
      )}

      <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${role.cls}`}>
        <RoleIcon className="w-3 h-3" />
        {role.label}
      </span>

      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${status.cls}`}>
        <StatusIcon className="w-3 h-3" />
        {status.label}
      </span>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(member)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onRemove(member)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function FamilyPage() {
  const [members,  setMembers]  = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [inviting, setInviting] = useState(false);
  const [editing,  setEditing]  = useState<FamilyMember | null>(null);
  const [removing, setRemoving] = useState<FamilyMember | null>(null);

  const coHolders = members.filter((m) => m.role === "co-holder");
  const viewers   = members.filter((m) => m.role === "viewer");

  const handleInvite = (data: Omit<FamilyMember, "id">) => {
    setMembers((prev) => [...prev, { ...data, id: `f${Date.now()}` }]);
  };

  const handleEditRole = (id: string, role: Role) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, role } : m));
  };

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Family &amp; Friends</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              People with access to your personal Foundation Account.
            </p>
          </div>
          <Button onClick={() => setInviting(true)} className="rounded-xl gap-2 h-9 text-sm">
            <Plus className="w-4 h-4" /> Add Person
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total People",   value: String(members.length),                                       sub: "With account access" },
            { label: "Co-Holders",     value: String(coHolders.length),                                     sub: "Full access" },
            { label: "Active",         value: String(members.filter((m) => m.status === "active").length),  sub: "Currently active" },
            { label: "Pending Invite", value: String(members.filter((m) => m.status === "invited").length), sub: "Awaiting acceptance" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl border border-border px-5 py-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Co-Holders */}
        {coHolders.length > 0 && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Co-Holders</h2>
                <p className="text-xs text-muted-foreground">Full access to view and submit givings on this account.</p>
              </div>
            </div>
            <div className="divide-y divide-border/60">
              <AnimatePresence>
                {coHolders.map((m, i) => (
                  <MemberRow key={m.id} member={m} index={i} onEdit={setEditing} onRemove={setRemoving} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Viewers */}
        {viewers.length > 0 && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Viewers</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Can view the account dashboard and reports.</p>
            </div>
            <div className="divide-y divide-border/60">
              <AnimatePresence>
                {viewers.map((m, i) => (
                  <MemberRow key={m.id} member={m} index={i} onEdit={setEditing} onRemove={setRemoving} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Access level legend */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Access Levels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([role, cfg]) => {
              const Icon = cfg.icon;
              const permissions: Record<Role, string[]> = {
                "co-holder": ["View dashboard & balance", "Submit giving requests", "Manage charities", "View all reports"],
                "viewer":    ["View dashboard & balance", "View reports"],
              };
              return (
                <div key={role} className={`rounded-xl border p-4 ${cfg.cls}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4" />
                    <p className="text-sm font-semibold">{cfg.label}</p>
                  </div>
                  <ul className="space-y-1">
                    {permissions[role].map((p) => (
                      <li key={p} className="text-xs flex items-center gap-1.5 opacity-80">
                        <User className="w-3 h-3 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {inviting && <InviteModal onClose={() => setInviting(false)} onInvite={handleInvite} />}
        {editing  && <EditModal member={editing} onClose={() => setEditing(null)} onSave={handleEditRole} />}
        {removing && <RemoveModal member={removing} onClose={() => setRemoving(null)} onConfirm={handleRemove} />}
      </AnimatePresence>
    </>
  );
}
