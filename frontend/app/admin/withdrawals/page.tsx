import type { Metadata } from "next";
import WithdrawalRequestsView from "@/components/dashboard/WithdrawalRequestsView";

export const metadata: Metadata = {
  title: "Withdrawal Requests | Friends Goal Admin",
  description: "Review and respond to member profit withdrawal requests.",
};

export default function AdminWithdrawalsPage() {
  return (
    <div className="p-6 md:p-8">
      <WithdrawalRequestsView />
    </div>
  );
}
