import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateInvestmentView } from "@/components/operation/CreateInvestmentView";

export const metadata: Metadata = {
  title: "Create Investment | Friends Goal Admin",
  description: "Record new organizational investments and portfolios.",
};

export default function CreateInvestmentPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-400">Loading form...</div>
      }
    >
      <CreateInvestmentView />
    </Suspense>
  );
}
