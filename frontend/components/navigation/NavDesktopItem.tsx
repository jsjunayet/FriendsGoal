"use client";

import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import type { NavItem, NavDropdownItem } from "@/types";
import type { TranslationKey } from "@/lib/translations";
import {
  NAV_LABEL_KEYS,
  DROPDOWN_LABEL_KEYS,
  DROPDOWN_DESC_KEYS,
  DROPDOWN_ICONS,
} from "@/components/navigation/navUtils";

// ─── Animation variants ───────────────────────────────────────────────────────

const dropdownVariants = {
  hidden:  { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.12, ease: "easeIn" } },
};

// ─── Desktop dropdown panel ───────────────────────────────────────────────────

interface DesktopDropdownProps {
  items: NavDropdownItem[];
  isOpen: boolean;
}

function DesktopDropdown({ items, isOpen }: DesktopDropdownProps) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 min-w-[220px]"
          role="menu"
          aria-label="Committee submenu"
        >
          {/* Arrow pointer */}
          <div
            aria-hidden="true"
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-gray-150 shadow-sm"
          />
          {/* Panel */}
          <div className="relative bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden py-1.5">
            {items.map((item, i) => (
              <Link
                key={item.href + i}
                href={item.href}
                role="menuitem"
                className="group flex items-start gap-3 px-4 py-3 hover:bg-[#f0fff8] transition-colors duration-150 focus-visible:outline-none focus-visible:bg-[#f0fff8]"
              >
                <span className="mt-0.5 w-7 h-7 rounded-lg bg-[#f0fff8] group-hover:bg-[#1FDE64] flex items-center justify-center flex-shrink-0 transition-colors duration-150 text-[#1FDE64] group-hover:text-[#262626]">
                  {DROPDOWN_ICONS[item.label]}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[13.5px] font-semibold text-gray-800 group-hover:text-[#1a1a1a] transition-colors leading-tight">
                    {t(DROPDOWN_LABEL_KEYS[item.label] ?? (item.label as TranslationKey))}
                  </span>
                  {item.description && (
                    <span className="text-[11.5px] text-gray-400 leading-snug">
                      {t(DROPDOWN_DESC_KEYS[item.label] ?? (item.description as TranslationKey))}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Desktop nav item ─────────────────────────────────────────────────────────

interface DesktopNavItemProps {
  item: NavItem;
  isActive: boolean;
}

export function DesktopNavItem({ item, isActive }: DesktopNavItemProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasDropdown = Boolean(item.dropdown?.length);
  const { t } = useTranslation();
  const label = NAV_LABEL_KEYS[item.href] ? t(NAV_LABEL_KEYS[item.href]) : item.label;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!hasDropdown) {
    return (
      <Link
        href={item.href}
        className={cn(
          "relative text-[13.5px] font-medium transition-colors duration-200 py-1 whitespace-nowrap",
          isActive ? "text-[#1FDE64]" : "text-gray-700 hover:text-[#1FDE64]"
        )}
      >
        {label}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#1FDE64] rounded-full"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex items-center gap-1 text-[13.5px] font-medium transition-colors duration-200 py-1 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:text-[#1FDE64]",
          isActive || open ? "text-[#1FDE64]" : "text-gray-700 hover:text-[#1FDE64]"
        )}
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
        {(isActive || open) && (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#1FDE64] rounded-full"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      <DesktopDropdown items={item.dropdown!} isOpen={open} />
    </div>
  );
}
