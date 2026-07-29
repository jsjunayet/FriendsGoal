"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants/site";
import { useTranslation } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import type { NavItem } from "@/types";
import type { TranslationKey } from "@/lib/translations";
import {
  NAV_LABEL_KEYS,
  DROPDOWN_LABEL_KEYS,
  DROPDOWN_ICONS,
} from "@/components/navigation/navUtils";

// ─── Mobile accordion dropdown ────────────────────────────────────────────────

interface MobileDropdownItemProps {
  item: NavItem;
  activeSection: string;
  onClose: () => void;
}

function MobileDropdownItem({ item, activeSection, onClose }: MobileDropdownItemProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const label = NAV_LABEL_KEYS[item.href] ? t(NAV_LABEL_KEYS[item.href]) : item.label;
  const isActive =
    pathname === item.href ||
    pathname.startsWith(item.href + "/") ||
    (item.dropdown ?? []).some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    ) ||
    activeSection === item.href.replace("#", "");

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
          isActive
            ? "bg-[#f0fff8] text-[#1FDE64]"
            : "text-gray-700 hover:bg-gray-50 hover:text-[#1FDE64]"
        )}
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-3 mt-0.5 border-l-2 border-[#1FDE64]/40 pl-3 flex flex-col gap-0.5 pb-1">
              {item.dropdown!.map((child, i) => (
                <Link
                  key={i}
                  href={child.href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-[#f0fff8] hover:text-[#1FDE64] transition-colors"
                >
                  <span className="text-[#1FDE64]">{DROPDOWN_ICONS[child.label]}</span>
                  {t(DROPDOWN_LABEL_KEYS[child.label] ?? (child.label as TranslationKey))}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mobile menu drawer ───────────────────────────────────────────────────────

interface NavMobileMenuProps {
  activeSection: string;
  onClose: () => void;
}

export function NavMobileMenu({ activeSection, onClose }: NavMobileMenuProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[998] lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over drawer */}
      <motion.div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 bottom-0 w-[280px] max-w-[90vw] bg-white z-[999] shadow-2xl flex flex-col lg:hidden"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1FDE64] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2.5C10 2.5 4.5 6.5 4.5 11.5C4.5 14.54 7.19 17 10 17C12.81 17 15.5 14.54 15.5 11.5C15.5 6.5 10 2.5 10 2.5Z" fill="#262626" />
                <circle cx="10" cy="11.5" r="2.8" fill="#1FDE64" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-[15px] tracking-tight">Friends Goal</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links — scrollable */}
        <nav
          className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-0.5"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item, i) => {
            if (item.dropdown?.length) {
              return (
                <MobileDropdownItem
                  key={item.href}
                  item={item}
                  activeSection={activeSection}
                  onClose={onClose}
                />
              );
            }

            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              activeSection === item.href.replace("#", "");

            const label = NAV_LABEL_KEYS[item.href]
              ? t(NAV_LABEL_KEYS[item.href])
              : item.label;

            return (
              <Link
                key={item.href + i}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-colors",
                  isActive
                    ? "bg-[#f0fff8] text-[#1FDE64] font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#1FDE64]"
                )}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FDE64] flex-shrink-0" />
                )}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 pt-3 pb-5 border-t border-gray-100 flex-shrink-0 flex flex-col gap-3">
          <LanguageToggle variant="stacked" />
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center justify-center w-full h-12 rounded-xl bg-[#1FDE64] text-[#262626] text-[15px] font-bold hover:bg-[#18C957] transition-colors shadow-md"
          >
            {t("nav_login")}
          </Link>
        </div>
      </motion.div>
    </>
  );
}
