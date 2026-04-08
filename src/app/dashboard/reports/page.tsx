import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ReportsPage } from "@/components/dashboard/ReportsPage";

export const metadata = {
  title: "Reports — Good2Give Foundation Accounts",
};

export default function ReportsRoutePage() {
  return (
    <DashboardLayout>
      <ReportsPage />
    </DashboardLayout>
  );
}
