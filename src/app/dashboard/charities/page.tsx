import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyCharitiesPage } from "@/components/dashboard/MyCharitiesPage";

export const metadata = {
  title: "My Charities — Good2Give Foundation Accounts",
};

export default function CharitiesPage() {
  return (
    <DashboardLayout>
      <MyCharitiesPage />
    </DashboardLayout>
  );
}
