"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export function AboutSection() {
  const { t } = useTranslation();
  return (
    <section
      id="about"
      className="w-full bg-white py-16 sm:py-24 lg:py-28 overflow-hidden"
      aria-label="About Friends Goal"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* ── Left Column: Content ────────────────────────────────────────── */}
          <div className="flex flex-col items-start">
            {/* Tag */}
            <span className="text-[13px] font-bold tracking-[0.2em] text-[#666666] uppercase mb-3">
              {t("about_tag")}
            </span>

            {/* Serif Heading */}
            <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-[#262626] leading-[1.2] tracking-tight">
              {t("about_heading")}
            </h2>

            {/* Paragraphs */}
            <div className="mt-5 space-y-4 text-[#666666] text-[16px] leading-[1.6]">
              <p>{t("about_para1")}</p>
              <p>{t("about_para2")}</p>
            </div>

            {/* Checkmark List */}
            <ul className="mt-6 space-y-3.5">
              {(["about_bullet1", "about_bullet2", "about_bullet3"] as const).map((key) => (
                <li key={key} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#F6FFED] border border-[#1FDE64] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#2B5A27]" />
                  </span>
                  <span className="text-[#262626] text-[15px] font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>

            {/* Read More Button */}
            <div className="mt-8">
              <a
                href="#policy"
                className="
                  inline-flex items-center justify-center
                  h-[44px] px-8 rounded-full
                  bg-[#262626] text-white
                  text-[15px] font-semibold tracking-tight
                  hover:bg-[#1a1a1a] transition-colors duration-200
                  shadow-sm focus-visible:outline-2 focus-visible:outline-[#262626]
                "
              >
                {t("about_cta")}
              </a>
            </div>
          </div>

          {/* ── Right Column: 2 Staggered Arch Image Cards ─── */}
          {/* ── Right Column: Custom Arch Shaped Images ────────────────────────────────────────── */}
          <div className="relative flex items-center justify-center gap-4 sm:gap-6 min-h-[360px] sm:min-h-[460px] lg:min-h-[520px]">

            {/* Left Image: Top Rounded (Arch Shape) */}
            <div className="relative w-[46%] sm:w-1/2 h-[320px] sm:h-[420px] lg:h-[480px] rounded-t-[140px] sm:rounded-t-[180px] rounded-b-none overflow-hidden shadow-md flex-shrink-0">
              <Image
                src="/images/about/about-1.png"
                alt="Savings jar with succulent"
                fill
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 50vw, 360px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Right Image: Bottom Rounded (Inverted Arch Shape & Shifted Down) */}
            <div className="relative w-[46%] sm:w-1/2 h-[320px] sm:h-[420px] lg:h-[480px] translate-y-8 sm:translate-y-12 rounded-b-[140px] sm:rounded-b-[180px] rounded-t-none overflow-hidden shadow-md flex-shrink-0">
              <Image
                src="/images/about/about-2-team.png"
                alt="Team members collaborating"
                fill
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 50vw, 360px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}