"use client";

import { motion } from "framer-motion";
import { Eye, Rocket } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export function VisionMissionSection() {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-white py-8 sm:py-12 pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          {/* ── Vision Card (Light) ────────────────────────────────────────── */}
          <div
            className="
              rounded-[28px] p-8 sm:p-10
              bg-secondary
              flex flex-col justify-between items-start gap-6
              shadow-sm hover:shadow-md transition-shadow duration-300
            "
          >
            <div className="flex flex-col items-start gap-5">
              {/* Eye icon in circle */}
              <div className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#2B5A27] shadow-xs">
                <Eye className="w-5 h-5 text-[#2B5A27]" />
              </div>

              {/* Serif Title */}
              <h3 className="font-serif text-[26px] sm:text-[30px] font-bold text-[#262626]">
                {t("vision_title")}
              </h3>

              {/* Text */}
              <p className="text-[#666666] text-[16px] leading-[1.65]">
                {t("vision_text")}
              </p>
            </div>
          </div>

          {/* ── Mission Card (Dark) ───────────────────────────────────────── */}
          <div
            className="
              rounded-[28px] p-8 sm:p-10
              bg-[#191C1B] text-white
              flex flex-col justify-between items-start gap-6
              shadow-md hover:shadow-lg transition-shadow duration-300
            "
          >
            <div className="flex flex-col items-start gap-5 w-full">
              {/* Rocket icon in circle */}
              <div className="w-12 h-12 rounded-full bg-[#262626] border border-white/10 flex items-center justify-center text-[#1FDE64] shadow-xs">
                <Rocket className="w-5 h-5 text-[#1FDE64]" />
              </div>

              {/* Serif Title */}
              <h3 className="font-serif text-[26px] sm:text-[30px] font-bold text-white">
                {t("mission_title")}
              </h3>

              {/* Text */}
              <p className="text-gray-300 text-[16px] leading-[1.65]">
                {t("mission_text")}
              </p>
            </div>

            {/* Footer badge */}
            <div className="w-full pt-4 border-t border-white/10 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#1FDE64]" />
              <span className="text-[12px] font-bold tracking-[0.2em] text-[#1FDE64] uppercase">
                {t("mission_badge")}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
