import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateDisbursementView } from "@/components/operation/CreateDisbursementView";

export const metadata: Metadata = {
  title: "Create Disbursement | Friends Goal Admin",
  description: "Record a new profit disbursement entry.",
};

export default function CreateDisbursementPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-400">Loading form...</div>
      }
    >
      <CreateDisbursementView />
    </Suspense>
  );
}
