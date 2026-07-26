import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { NoticePageClient } from "./NoticePageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("notice");
}

export default function NoticePage() {
  return <NoticePageClient />;
}
