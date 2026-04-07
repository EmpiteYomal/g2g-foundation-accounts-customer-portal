"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowUpFromLine,
  GitBranch,
  Heart,
  FileText,
  Settings,
  HelpCircle,
  X,
  TrendingUp,
  Bell,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    section: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/impact", label: "Impact Report", icon: TrendingUp },
    ],
  },
  {
    section: "Giving",
    items: [
      { href: "/dashboard/transactions", label: "Transactions", icon: ArrowUpFromLine, badge: "12" },
      { href: "/dashboard/rules", label: "Giving Rules", icon: GitBranch },
      { href: "/dashboard/approvals", label: "Approvals", icon: Heart, badge: "3" },
    ],
  },
  {
    section: "Organisation",
    items: [
      { href: "/dashboard/charities", label: "Charities", icon: Heart },
      { href: "/dashboard/team", label: "Team & Trustees", icon: Users },
      { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
      { href: "/dashboard/reports", label: "Reports", icon: FileText },
    ],
  },
];

const bottomItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Help & Support", icon: HelpCircle },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const NavContent = () => (
    <nav className="flex flex-col h-full py-4">
      {/* Logo */}
      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">G</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Good2Give</p>
            <p className="text-white/50 text-[10px] leading-tight">Foundation Accounts</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Account pill */}
      <div className="mx-3 mb-5 px-3 py-2.5 rounded-xl bg-white/8 border border-white/10">
        <p className="text-white/50 text-[10px] font-medium uppercase tracking-wider mb-0.5">Current Account</p>
        <p className="text-white text-sm font-semibold leading-tight truncate">KFC Australia Pty Ltd</p>
        <p className="text-white/40 text-xs">ABN 51 004 220 518</p>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5">
        {navItems.map((group) => (
          <div key={group.section}>
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-2 mb-1.5">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all group",
                      isActive
                        ? "bg-white/12 text-white"
                        : "text-white/55 hover:text-white hover:bg-white/8"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-white/40 group-hover:text-white/70"
                    )} />
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-primary/80 text-white text-[10px] font-semibold min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom items */}
      <div className="px-3 mt-4 pt-4 border-t border-white/10 space-y-0.5">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all group"
          >
            <item.icon className="w-4 h-4 flex-shrink-0 text-white/35 group-hover:text-white/60 transition-colors" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* User */}
      <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-white/6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">JS</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate">Jane Smith</p>
          <p className="text-white/40 text-[10px] truncate">Trustee · jane@kfc.com.au</p>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1917] transform transition-transform duration-300 lg:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-60 bg-[#1C1917] flex-col flex-shrink-0">
        <NavContent />
      </div>
    </>
  );
}
