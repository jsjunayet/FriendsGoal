"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

// ─── Hero Image Data matching Anima Pixel-Perfect Design ─────────────────────
interface HeroPillData {
  src: string;
  alt: string;
  shapeClass: string;
  isPillShape?: boolean;
}

const HERO_PILLS: HeroPillData[] = [
  {
    src: "/images/hero/hero-1.png",
    alt: "Community meeting and dynamic team workspace",
    shapeClass: "rounded-[40px]",
  },
  {
    src: "/images/hero/hero-2.png",
    alt: "Growth symbol and decorative element",
    shapeClass: "rounded-full",
    isPillShape: true,
  },
  {
    src: "/images/hero/hero-3.png",
    alt: "Hands stacked together in trust and unity",
    shapeClass: "rounded-[40px]",
  },
  {
    src: "/images/hero/hero-4.png",
    alt: "Financial sprout in fertile soil",
    shapeClass: "rounded-full",
    isPillShape: true,
  },
  {
    src: "/images/hero/hero-5.png",
    alt: "Aspirational sunset and team celebration",
    shapeClass: "rounded-[40px]",
  },
];

// ─── Continuous Marquee Banner Component ─────────────────────────────────────
export function MeetingMarqueeBanner() {
  const { t } = useTranslation();
  const msg = t("hero_marquee");
  return (
    <div className="w-full bg-[#FAFDEB] border-y border-[#E5E5E5] py-3.5 overflow-hidden select-none">
      <div className="animate-marquee-slow flex">
        {[0, 1].map((n) => (
          <div key={n} className="flex items-center gap-8 pr-8 text-[15px] font-semibold text-[#262626] whitespace-nowrap">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1FDE64] flex-shrink-0" />
            <span>{msg}</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1FDE64] flex-shrink-0" />
            <span>{msg}</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1FDE64] flex-shrink-0" />
            <span>{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Hero Section Component ─────────────────────────────────────────────
export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative w-full pt-16 sm:pt-24 md:pt-32 pb-0 overflow-hidden bg-[linear-gradient(180deg,var(--color-figma-linear-start)_0%,var(--color-figma-linear-end)_100%)]"
    >
      {/* 1. Top Right Soft Glow Circle (Secondary Color: #FAFFE6) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-267px] top-[-401px] h-[800px] w-[800px] rounded-full bg-figma-secondary blur-[60px] opacity-80"
      />

      {/* 2. Bottom Left Soft Glow Circle (Linear Gradient: #F8FAF8 -> #E9EFE7) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-199px] left-[-150px] h-[600px] w-[600px] rounded-full bg-[linear-gradient(180deg,var(--color-figma-linear-start)_0%,var(--color-figma-linear-end)_100%)] blur-[60px] opacity-80"
      />


      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 text-center flex flex-col items-center relative z-10">

        {/* Tag */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[13px] font-bold tracking-[0.25em] text-[#666666] uppercase mb-4"
        >
          {t("hero_tag")}
        </motion.p>

        {/* Serif Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif font-bold text-[#262626] text-[36px] sm:text-[48px] md:text-[58px] lg:text-[68px] leading-[1.12] tracking-tight max-w-[22ch]"
        >
          {t("hero_headline")}
        </motion.h1>

        {/* Sub-description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-[#666666] text-[16px] sm:text-[18px] leading-[1.55] max-w-[620px] font-normal"
        >
          {t("hero_description")}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <a
            href="#about"
            className="
              group inline-flex items-center gap-3
              h-[52px] px-10 rounded-full
              bg-[#1FDE64] text-[#262626]
              text-[16px] font-semibold tracking-tight
              shadow-md hover:shadow-lg transition-all duration-200
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1FDE64]
            "
          >
            <span>{t("hero_cta")}</span>
            <span className="w-8 h-8 rounded-full bg-[#262626] text-[#1FDE64] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </motion.div>

        {/* 5-Pill Image Grid (Matching Anima Height and Border-Radius) */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full mt-12 sm:mt-16"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5 items-end justify-center">
            {HERO_PILLS.map((pill, index) => (
              <div
                key={pill.src + index}
                className={[
                  "relative overflow-hidden shadow-sm bg-[#EEF2F0]",
                  pill.shapeClass,
                  // Responsive Display
                  index >= 2 ? "hidden sm:block" : "",
                  index >= 3 ? "sm:hidden md:block" : "",
                  // Anima Specific Heights & Top Padding for staggered look
                  pill.isPillShape
                    ? "h-[240px] sm:h-[340px] md:h-[420px] mb-4"
                    : "h-[280px] sm:h-[380px] md:h-[500px]",
                ].filter(Boolean).join(" ")}
              >
                <Image
                  src={pill.src}
                  alt={pill.alt}
                  fill
                  priority={index < 2}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scrolling Marquee Banner */}
      <div className="mt-16 sm:mt-20">
        <MeetingMarqueeBanner />
      </div>
    </section>
  );
}