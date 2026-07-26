import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { FAQPageClient } from "./FAQPageClient";


export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("faq");
}

export default function FAQPage() {
  return <FAQPageClient />;
}
