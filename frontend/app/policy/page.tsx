import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { PolicyPageClient } from "./PolicyPageClient";


export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("policy");
}

export default function PolicyPage() {
  return <PolicyPageClient />;
}
