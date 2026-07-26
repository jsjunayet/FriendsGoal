"use client";

import { motion } from "framer-motion";
import { SectionLabel, SectionHeading, SectionSubheading } from "@/components/shared";
import {
  FINANCIAL_CARDS,
  SAVINGS_BREAKDOWN,
  SAVINGS_GRAND_TOTAL,
} from "@/constants/site";
import type { FinancialCard } from "@/types";
import { cn } from "@/lib/utils";

// ─── Fee Card ──────────────────────────────────────────────────────────────────
function FeeCard({ card, index }: { card: FinancialCard; index: number }) {
  const isDark = card.variant === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "rounded-2xl p-6 sm:p-7 flex flex-col gap-3 relative overflow-hidden",
        isDark
          ? "bg-[#183d28] text-white"
          : "bg-[#f5fdf8] border border-[#d1f0e0] text-gray-900"
      )}
    >
      {/* Decorative circle */}
      <div
        className={cn(
          "absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10",
          isDark ? "bg-white" : "bg-[#27a065]"
        )}
      />

      {/* Label */}
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-widest",
          isDark ? "text-[#7ed4aa]" : "text-[#27a065]"
        )}
      >
        {card.label}
      </p>

      {/* Value */}
      <div className="flex items-end gap-1.5">
        <span
          className={cn(
            "font-extrabold leading-none text-[2.6rem] sm:text-[3rem]",
            isDark ? "text-white" : "text-[#183d28]"
          )}
        >
          {card.value}
        </span>
        <span
          className={cn(
            "font-bold text-lg sm:text-xl pb-1",
            isDark ? "text-[#7ed4aa]" : "text-[#27a065]"
          )}
        >
          {card.unit}
        </span>
      </div>

      {/* Description */}
      <p
        className={cn(
          "text-sm leading-relaxed",
          isDark ? "text-[#a8d8bc]" : "text-gray-500"
        )}
      >
        {card.description}
      </p>
    </motion.div>
  );
}

// ─── Savings Breakdown Table ───────────────────────────────────────────────────
function SavingsBreakdownTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: 0.35 }}
      className="mt-8 rounded-2xl border border-gray-200 overflow-hidden bg-white"
    >
      {/* Table header */}
      <div className="px-5 sm:px-7 py-4 border-b border-gray-100 bg-gray-50/60">
        <p className="font-semibold text-gray-800 text-sm sm:text-[15px]">
          • Total Savings Breakdown Over 11 Years — 111 Members
        </p>
      </div>

      {/* Rows */}
      {SAVINGS_BREAKDOWN.map((row, i) => (
        <div
          key={row.id}
          className={cn(
            "px-5 sm:px-7 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6",
            i < SAVINGS_BREAKDOWN.length - 1 && "border-b border-gray-100"
          )}
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm sm:text-[15px]">
              {row.title}
            </p>
            <div className="mt-1 space-y-0.5">
              {row.formula.split("\n").map((line, li) => (
                <p key={li} className="text-xs text-gray-400 font-mono">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="sm:text-right flex-shrink-0">
            <p className="font-bold text-gray-900 text-base sm:text-lg">
              {row.total}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 max-w-[220px] sm:ml-auto">
              {row.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Grand total */}
      <div className="px-5 sm:px-7 py-5 sm:py-6 bg-[#f0faf4] border-t-2 border-[#27a065] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
        <div className="flex-1">
          <p className="font-bold text-[#183d28] text-sm sm:text-base">
            {SAVINGS_GRAND_TOTAL.label}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {SAVINGS_GRAND_TOTAL.sublabel}
          </p>
          <p className="text-xs text-gray-400 font-mono mt-1">
            {SAVINGS_GRAND_TOTAL.formula}
          </p>
        </div>
        <div className="sm:text-right flex-shrink-0">
          <p className="font-extrabold text-[#27a065] text-xl sm:text-2xl">
            {SAVINGS_GRAND_TOTAL.total}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 max-w-[240px] sm:ml-auto">
            {SAVINGS_GRAND_TOTAL.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Policy Section ────────────────────────────────────────────────────────────
export function PolicySection() {
  return (
    <section
      id="policy"
      className="w-full bg-gray-50/70 py-16 sm:py-20 lg:py-28"
      aria-label="Financial Plan"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-10 sm:mb-12">
          <SectionLabel>Policy</SectionLabel>
          <SectionHeading>Our Financial Plan</SectionHeading>
          <SectionSubheading>
            Every Friends Goal member is required to maintain monthly
            installments and an annual fee for a period of 11 years.
          </SectionSubheading>
        </div>

        {/* Fee cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FINANCIAL_CARDS.map((card, i) => (
            <FeeCard key={card.label} card={card} index={i} />
          ))}
        </div>

        {/* Savings breakdown */}
        <SavingsBreakdownTable />

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-xs text-gray-400 text-center leading-relaxed"
        >
          * The above figures are based on full participation of all 111 members.
          Investment returns are not included in this calculation.
        </motion.p>
      </div>
    </section>
  );
}
