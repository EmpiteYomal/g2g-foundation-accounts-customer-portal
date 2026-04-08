import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TransactionHistoryPage } from "@/components/dashboard/TransactionHistoryPage";

export const metadata = {
  title: "Transaction History — Good2Give Foundation Accounts",
};

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <TransactionHistoryPage />
    </DashboardLayout>
  );
}
