import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PendingDisbursementsPage } from "@/components/dashboard/PendingDisbursementsPage";

export const metadata = {
  title: "Pending Disbursements — Good2Give Foundation Accounts",
};

export default function DisbursementsPage() {
  return (
    <DashboardLayout>
      <PendingDisbursementsPage />
    </DashboardLayout>
  );
}
