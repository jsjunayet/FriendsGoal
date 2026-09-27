import type { Metadata } from "next";
import ModificationHistoryView from "@/components/dashboard/ModificationHistoryView";

export const metadata: Metadata = {
  title: "Modification History | Friends Goal Admin",
  description: "Full audit log of admin actions across the system.",
};

export default function ModificationHistoryAliasPage() {
  return (
    <div className="p-6 md:p-8">
      <ModificationHistoryView />
    </div>
  );
}
