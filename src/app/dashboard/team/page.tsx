"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TeamPage } from "@/components/dashboard/TeamPage";
import { FamilyPage } from "@/components/dashboard/FamilyPage";

export default function TeamRoutePage() {
  const [accountType, setAccountType] = useState<"org" | "person">("org");

  useEffect(() => {
    const stored = localStorage.getItem("accountType");
    if (stored === "person") setAccountType("person");
  }, []);

  return (
    <DashboardLayout>
      {accountType === "person" ? <FamilyPage /> : <TeamPage />}
    </DashboardLayout>
  );
}
