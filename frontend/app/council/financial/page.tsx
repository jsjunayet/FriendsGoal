import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { FinancialCouncilPageClient } from "./FinancialCouncilPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("financial");
}

export default function FinancialCouncilPage() {
  return <FinancialCouncilPageClient />;
}
