import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SupportPage } from "@/components/dashboard/SupportPage";

export const metadata = {
  title: "Help & Support — Good2Give Foundation Accounts",
};

export default function SupportRoutePage() {
  return (
    <DashboardLayout>
      <SupportPage />
    </DashboardLayout>
  );
}
