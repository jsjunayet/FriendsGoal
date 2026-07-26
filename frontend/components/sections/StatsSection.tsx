"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import { useTranslation } from "@/context/LanguageContext";

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  const STATS_DATA = [
    { value: 111, suffix: "+", labelKey: "stats_members" as const },
    { value: 70, suffix: "+", labelKey: "stats_projects" as const },
    { value: 3, suffix: "+", labelKey: "stats_years" as const },
  ];

  return (
    <section
      ref={containerRef}
      className="w-full bg-white py-16 sm:py-20 border-y border-[#E5E5E5] overflow-hidden"
      aria-label="Key Statistics"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-center items-center"
        >
          {STATS_DATA.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center justify-center py-2"
            >
              <div className="flex items-baseline justify-center">
                <span className="font-extrabold text-[#262626] text-[52px] sm:text-[60px] lg:text-[68px] leading-none tracking-tight">
                  {isInView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      useEasing
                      delay={i * 0.15}
                    />
                  ) : (
                    "0"
                  )}
                </span>
                <span className="font-extrabold text-[#262626] text-[44px] sm:text-[52px] lg:text-[60px] leading-none ml-0.5">
                  {stat.suffix}
                </span>
              </div>

              <p className="mt-3.5 text-[13px] font-bold tracking-[0.22em] text-[#666666] uppercase">
                {t(stat.labelKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
