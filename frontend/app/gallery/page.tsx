import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { GalleryPageClient } from "./GalleryPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("gallery");
}

export default function GalleryPage() {
  return <GalleryPageClient />;
}
