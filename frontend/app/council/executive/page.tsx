import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { ExecutiveCouncilPageClient } from "./ExecutiveCouncilPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("executive");
}

export default function ExecutiveCouncilPage() {
  return <ExecutiveCouncilPageClient />;
}
