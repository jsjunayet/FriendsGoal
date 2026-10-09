"use client";

import { UserSearch } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

interface EmptyStateProps {
  title?: string;
  titleBn?: string;
  subtext?: string;
  subtextBn?: string;
  description?: string;
  descriptionBn?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  titleBn,
  subtext,
  subtextBn,
  description,
  descriptionBn,
  icon,
  actionButton,
  className = "",
}: EmptyStateProps) {
  const { lang } = useTranslation();
  const isBn = lang === "bn";

  const resolvedSubtext = description || subtext;
  const resolvedSubtextBn = descriptionBn || subtextBn;

  const displayTitle = isBn
    ? titleBn || title || "কোনো তথ্য পাওয়া যায়নি"
    : title || "No data found";

  const displaySubtext = isBn
    ? resolvedSubtextBn || resolvedSubtext || "নিয়মিত আপডেট চেক করুন"
    : resolvedSubtext || "Check back later for updates";

  return (
    <div
      className={`w-full py-16 px-6 rounded-3xl border border-gray-200/80 bg-gradient-to-b from-gray-50/50 to-emerald-50/30 flex flex-col items-center justify-center text-center shadow-xs ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-[#00B074] shadow-sm mb-4">
        {icon || <UserSearch className="w-8 h-8 text-[#00B074]" />}
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
        {displayTitle}
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-md leading-relaxed">
        {displaySubtext}
      </p>
      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
}
