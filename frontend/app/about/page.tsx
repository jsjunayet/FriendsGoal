import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { AboutPageClient } from "./AboutPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("about");
}

export default function AboutPage() {
  return <AboutPageClient />;
}
