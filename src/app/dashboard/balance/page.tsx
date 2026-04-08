import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AccountBalancePage } from "@/components/dashboard/AccountBalancePage";

export const metadata = {
  title: "Account Balance — Good2Give Foundation Accounts",
};

export default function BalancePage() {
  return (
    <DashboardLayout>
      <AccountBalancePage />
    </DashboardLayout>
  );
}
