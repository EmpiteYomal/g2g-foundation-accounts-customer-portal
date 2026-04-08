import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AccountSettingsPage } from "@/components/dashboard/AccountSettingsPage";

export const metadata = {
  title: "Account Settings — Good2Give Foundation Accounts",
};

export default function AccountRoutePage() {
  return (
    <DashboardLayout>
      <AccountSettingsPage />
    </DashboardLayout>
  );
}
