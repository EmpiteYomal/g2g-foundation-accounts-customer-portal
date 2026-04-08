import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SettingsPage } from "@/components/dashboard/SettingsPage";

export const metadata = {
  title: "Settings — Good2Give Foundation Accounts",
};

export default function SettingsRoutePage() {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  );
}
