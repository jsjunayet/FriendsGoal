import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { MembersPageClient } from "./MembersPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("members");
}

export default function MembersPage() {
  return <MembersPageClient />;
}
