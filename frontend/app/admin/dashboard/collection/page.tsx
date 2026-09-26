import type { Metadata } from "next";
import { MoneyCollectionView } from "@/components/operation/MoneyCollectionView";

export const metadata: Metadata = {
  title: "Money Collection | Friends Goal Admin",
  description: "Record and manage member payments.",
};

export default function AdminCollectionPage() {
  return <MoneyCollectionView />;
}
