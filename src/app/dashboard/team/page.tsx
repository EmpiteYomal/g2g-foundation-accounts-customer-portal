import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TeamPage } from "@/components/dashboard/TeamPage";

export const metadata = {
  title: "Team & Trustees — Good2Give Foundation Accounts",
};

export default function TeamRoutePage() {
  return (
    <DashboardLayout>
      <TeamPage />
    </DashboardLayout>
  );
}
