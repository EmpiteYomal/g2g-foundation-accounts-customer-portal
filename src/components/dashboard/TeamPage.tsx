"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  User,
  Mail,
  CheckCircle2,
  Clock,
  Crown,
  Plus,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "trustee" | "admin" | "viewer";
type MemberStatus = "active" | "invited";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  joinedDate: string;
  lastActive?: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Jane Smith",   email: "jane@kfc.com.au",     role: "trustee", status: "active",  joinedDate: "12 Jan 2025", lastActive: "Today"      },
  { id: "m2", name: "Michael Chen", email: "m.chen@kfc.com.au",   role: "trustee", status: "active",  joinedDate: "12 Jan 2025", lastActive: "2 Apr 2026" },
  { id: "m3", name: "Sarah Nguyen", email: "s.nguyen@kfc.com.au", role: "admin",   status: "active",  joinedDate: "3 Mar 2025",  lastActive: "7 Apr 2026" },
  { id: "m4", name: "Tom Barker",   email: "t.barker@kfc.com.au", role: "viewer",  status: "active",  joinedDate: "15 Jun 2025", lastActive: "1 Apr 2026" },
  { id: "m5", name: "Priya Sharma", email: "p.sharma@kfc.com.au", role: "viewer",  status: "invited", joinedDate: "6 Apr 2026"                            },
];

const roleConfig: Record<Role, { label: string; cls: string; icon: React.ElementType }> = {
  trustee: { label: "Trustee", icon: Crown,      cls: "text-amber-800 bg-amber-50 border-amber-200" },
  admin:   { label: "Admin",   icon: ShieldCheck, cls: "text-blue-800  bg-blue-50  border-blue-200"  },
  viewer:  { label: "Viewer",  icon: User,        cls: "text-gray-700  bg-gray-50  border-gray-200"  },
};

const statusConfig: Record<MemberStatus, { label: string; icon: React.ElementType; cls: string }> = {
  active:  { label: "Active",  icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  invited: { label: "Invited", icon: Clock,        cls: "text-amber-700  bg-amber-50  border-amber-200"     },
};

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (m: Omit<TeamMember, "id">) => void }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState<Role>("viewer");
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim())  return setError("Name is required.");
    if (!email.trim() || !email.includes("@")) return setError("Valid email is required.");
    onInvite({ name: name.trim(), email: email.trim(), role, status: "invited", joinedDate: "8 Apr 2026" });
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
            <h2 className="text-lg font-bold text-foreground">Invite member</h2>
            <p className="text-sm text-muted-foreground mt-0.5">They'll receive an email to join the account.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="inv-name">Full name</Label>
            <Input id="inv-name" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Alex Johnson" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-email">Email address</Label>
            <Input id="inv-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="e.g. alex@kfc.com.au" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([r, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                      role === r ? `${cfg.cls} border-current` : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cfg.label}
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

// ─── Edit Role Modal ──────────────────────────────────────────────────────────

function EditRoleModal({ member, onClose, onSave }: { member: TeamMember; onClose: () => void; onSave: (id: string, role: Role) => void }) {
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
          <h2 className="text-lg font-bold text-foreground">Edit role</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">Changing role for <strong>{member.name}</strong></p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([r, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button key={r} onClick={() => setRole(r)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                    role === r ? `${cfg.cls} border-current` : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cfg.label}
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

// ─── Remove Confirm Modal ─────────────────────────────────────────────────────

function RemoveModal({ member, onClose, onConfirm }: { member: TeamMember; onClose: () => void; onConfirm: (id: string) => void }) {
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
            <h2 className="text-base font-bold text-foreground">Remove member?</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              <strong>{member.name}</strong> will lose all access to this Foundation Account.
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
  member: TeamMember;
  index: number;
  onEdit: (m: TeamMember) => void;
  onRemove: (m: TeamMember) => void;
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
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary">{initials}</span>
      </div>

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
        </div>
      </div>

      {/* Joined */}
      <div className="hidden md:block text-right flex-shrink-0">
        <p className="text-xs text-muted-foreground">Joined</p>
        <p className="text-xs font-medium text-foreground">{member.joinedDate}</p>
      </div>

      {/* Last active */}
      {member.lastActive && (
        <div className="hidden lg:block text-right flex-shrink-0">
          <p className="text-xs text-muted-foreground">Last active</p>
          <p className="text-xs font-medium text-foreground">{member.lastActive}</p>
        </div>
      )}

      {/* Role badge */}
      <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${role.cls}`}>
        <RoleIcon className="w-3 h-3" />
        {role.label}
      </span>

      {/* Status badge */}
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${status.cls}`}>
        <StatusIcon className="w-3 h-3" />
        {status.label}
      </span>

      {/* Actions */}
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

export function TeamPage() {
  const [members,    setMembers]    = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [inviting,   setInviting]   = useState(false);
  const [editing,    setEditing]    = useState<TeamMember | null>(null);
  const [removing,   setRemoving]   = useState<TeamMember | null>(null);

  const trustees = members.filter((m) => m.role === "trustee");
  const others   = members.filter((m) => m.role !== "trustee");

  const handleInvite = (data: Omit<TeamMember, "id">) => {
    setMembers((prev) => [...prev, { ...data, id: `m${Date.now()}` }]);
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
            <h1 className="text-2xl font-bold text-foreground">Team & Trustees</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              People with access to your KFC Foundation Account.
            </p>
          </div>
          <Button onClick={() => setInviting(true)} className="rounded-xl gap-2 h-9 text-sm">
            <Plus className="w-4 h-4" /> Invite Member
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Members",  value: String(members.length),                                       sub: "With account access" },
            { label: "Trustees",       value: String(trustees.length),                                      sub: "Can approve givings" },
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

        {/* Trustees */}
        {trustees.length > 0 && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Trustees</h2>
                <p className="text-xs text-muted-foreground">Review and approve all giving requests before submission to G2G.</p>
              </div>
            </div>
            <div className="divide-y divide-border/60">
              <AnimatePresence>
                {trustees.map((m, i) => (
                  <MemberRow key={m.id} member={m} index={i} onEdit={setEditing} onRemove={setRemoving} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Team members */}
        {others.length > 0 && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Team Members</h2>
            </div>
            <div className="divide-y divide-border/60">
              <AnimatePresence>
                {others.map((m, i) => (
                  <MemberRow key={m.id} member={m} index={i} onEdit={setEditing} onRemove={setRemoving} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Role legend */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Role Permissions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([role, cfg]) => {
              const Icon = cfg.icon;
              const permissions: Record<Role, string[]> = {
                trustee: ["View dashboard", "Approve givings", "Manage charities", "View all reports"],
                admin:   ["View dashboard", "Submit givings", "Manage charities", "View all reports"],
                viewer:  ["View dashboard", "View reports"],
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
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
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
        {editing  && <EditRoleModal member={editing} onClose={() => setEditing(null)} onSave={handleEditRole} />}
        {removing && <RemoveModal member={removing} onClose={() => setRemoving(null)} onConfirm={handleRemove} />}
      </AnimatePresence>
    </>
  );
}
