"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";

// Routes where the Navbar should be hidden
const HIDDEN_ON: RegExp[] = [
  /^\/notice\/.+/, // /notice/[slug] — individual notice detail pages
  /^\/login$/,     // login page
  /^\/dashboard/,  // dashboard routes
  /^\/admin/,      // admin routes
  /^\/notifications/, // notifications routes
];

export function ConditionalNavbar() {
  const pathname = usePathname();
  const hidden = HIDDEN_ON.some((pattern) => pattern.test(pathname));
  if (hidden) return null;
  return <Navbar />;
}
