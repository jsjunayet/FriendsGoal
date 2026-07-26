"use client";

import { useTranslation } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/translations";

interface LanguageToggleProps {
  className?: string;
  /** compact = pill with two options side-by-side (desktop navbar) */
  variant?: "pill" | "stacked";
}

export function LanguageToggle({
  className,
  variant = "pill",
}: LanguageToggleProps) {
  const { lang, setLang } = useTranslation();

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5 select-none",
          className
        )}
        role="group"
        aria-label="Language selector"
      >
        {(["en", "bn"] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={cn(
              "px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer",
              lang === l
                ? "bg-[#27a065] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {l === "en" ? "EN" : "বাং"}
          </button>
        ))}
      </div>
    );
  }

  // stacked variant — for mobile drawer
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label="Language selector"
    >
      <span className="text-[12px] font-bold tracking-widest uppercase text-gray-400">
        LANG
      </span>
      <div className="flex items-center gap-1">
        {(["en", "bn"] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={cn(
              "w-10 h-8 rounded-lg text-[12px] font-bold uppercase transition-all duration-200 cursor-pointer",
              lang === l
                ? "bg-[#27a065] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {l === "en" ? "EN" : "বাং"}
          </button>
        ))}
      </div>
    </div>
  );
}
