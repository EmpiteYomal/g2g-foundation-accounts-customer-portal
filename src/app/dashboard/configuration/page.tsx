import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ConfigurationPage } from "@/components/dashboard/ConfigurationPage";

export const metadata = {
  title: "Configuration — Good2Give Foundation Accounts",
};

export default function ConfigPage() {
  return (
    <DashboardLayout>
      <ConfigurationPage />
    </DashboardLayout>
  );
}
