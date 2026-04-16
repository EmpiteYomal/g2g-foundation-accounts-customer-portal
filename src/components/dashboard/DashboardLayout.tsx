"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export type AccountType = "org" | "person";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("org");

  useEffect(() => {
    const stored = localStorage.getItem("accountType");
    if (stored === "person") setAccountType("person");
  }, []);

  return (
    <div className="flex h-screen bg-[#FAF9F8] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} accountType={accountType} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} accountType={accountType} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
