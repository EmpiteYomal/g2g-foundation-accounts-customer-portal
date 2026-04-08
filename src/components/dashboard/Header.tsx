"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ChevronDown, HandCoins, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATIONS = [
  { id: 1, icon: AlertCircle,   color: "text-amber-600",   bg: "bg-amber-50",   title: "Approval required",        body: "GIVING-221 is awaiting your approval.",              time: "Just now",    unread: true  },
  { id: 2, icon: CheckCircle2,  color: "text-emerald-600", bg: "bg-emerald-50", title: "Giving processed",          body: "GIVING-198 has been fully distributed to charities.", time: "2h ago",      unread: true  },
  { id: 3, icon: HandCoins,     color: "text-blue-600",    bg: "bg-blue-50",    title: "Funds received",            body: "AUD 2,990.00 deposited into your Foundation Account.",time: "Yesterday",   unread: true  },
  { id: 4, icon: Info,          color: "text-violet-600",  bg: "bg-violet-50",  title: "New team member joined",    body: "Priya Sharma accepted your invitation.",              time: "2 days ago",  unread: false },
  { id: 5, icon: CheckCircle2,  color: "text-emerald-600", bg: "bg-emerald-50", title: "Report ready",              body: "Your Q1 2026 Giving Summary is ready to download.",  time: "3 days ago",  unread: false },
];

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white border-b border-border px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Current account — left side */}
      <div className="hidden lg:flex items-center gap-2.5 px-1 py-1">
        <img src="/kfcau.webp" alt="KFC Australia" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">KFC Australia Pty Ltd</p>
          <p className="text-xs text-muted-foreground leading-tight">ABN 51 004 220 518</p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Pending approvals callout */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2 rounded-xl h-9 text-sm border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-950 hover:border-amber-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          3 pending approvals
        </Button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/60 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="text-xs font-semibold bg-primary text-white px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary font-medium hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="divide-y divide-border/60 max-h-96 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
                        className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-muted/30 ${n.unread ? "bg-primary/5" : ""}`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${n.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-semibold text-foreground ${n.unread ? "" : "font-medium"}`}>{n.title}</p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">{n.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                        </div>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">You're all caught up</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-muted/60 transition-colors outline-none">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-primary text-white text-xs font-bold">
                  JS
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-foreground leading-tight">Jane Smith</p>
                <p className="text-xs text-muted-foreground leading-tight">Trustee</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <p className="font-semibold text-foreground">Jane Smith</p>
                <p className="text-xs text-muted-foreground">jane@kfc.com.au</p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href="/dashboard/account">Account Settings</a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
