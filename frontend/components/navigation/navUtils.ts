import { Users, DollarSign } from "lucide-react";
import type { NavItem } from "@/types";
import type { TranslationKey } from "@/lib/translations";
import React from "react";

// ─── Translation key maps ─────────────────────────────────────────────────────

export const NAV_LABEL_KEYS: Record<string, TranslationKey> = {
  "/policy": "nav_policy",
  "/council/executive": "nav_councils",
  "/members": "nav_members",
  "/about": "nav_about",
  "/gallery": "nav_gallery",
  "/notice": "nav_notice",
  "/faq": "nav_faq",
};

export const DROPDOWN_LABEL_KEYS: Record<string, TranslationKey> = {
  "Executive Council": "nav_executive_council",
  "Financial Council": "nav_financial_council",
};

export const DROPDOWN_DESC_KEYS: Record<string, TranslationKey> = {
  "Executive Council": "nav_exec_desc",
  "Financial Council": "nav_fin_desc",
};

// ─── Dropdown icons ───────────────────────────────────────────────────────────

export const DROPDOWN_ICONS: Record<string, React.ReactNode> = {
  "Executive Council": React.createElement(Users, { className: "w-4 h-4" }),
  "Financial Council": React.createElement(DollarSign, { className: "w-4 h-4" }),
};

// ─── Active route helper ──────────────────────────────────────────────────────

export function getNavActive(
  item: NavItem,
  pathname: string,
  activeSection: string
): boolean {
  if (item.href.startsWith("#")) {
    return pathname === "/" && activeSection === item.href.slice(1);
  }
  if (item.dropdown?.length) {
    return item.dropdown.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );
  }
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
