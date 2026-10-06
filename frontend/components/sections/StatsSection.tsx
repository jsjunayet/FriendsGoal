"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import { useTranslation } from "@/context/LanguageContext";
import { getStatsApi, type StatCounterItem } from "@/lib/statsApi";
import { getLocalizedText } from "@/lib/i18nHelpers";

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { lang, t } = useTranslation();
  const [stats, setStats] = useState<StatCounterItem[]>([]);

  useEffect(() => {
    getStatsApi()
      .then((data) => {
        if (data && data.length > 0) setStats(data);
      })
      .catch(() => {});
  }, []);

  const DEFAULT_STATS = [
    { value: 111, suffix: "+", displayVal: "111+", labelText: lang === "bn" ? "সক্রিয় সদস্য" : "ACTIVE MEMBERS" },
    { value: 70, suffix: "+", displayVal: "70+", labelText: lang === "bn" ? "প্রকল্পসমূহ" : "TOTAL PROJECTS" },
    { value: 3, suffix: "+", displayVal: "3+", labelText: lang === "bn" ? "সেবার বছর" : "YEARS OF SERVICE" },
  ];

  const statList =
    stats.length > 0
      ? stats.map((s) => {
          const numMatch = s.value.match(/(\d+)(.*)/);
          const valNum = numMatch ? parseInt(numMatch[1], 10) : 0;
          const suff = numMatch ? numMatch[2] : "";
          return {
            value: valNum,
            suffix: suff,
            displayVal: s.value,
            labelText: getLocalizedText(s.label, lang, s.key).toUpperCase(),
          };
        })
      : DEFAULT_STATS;

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
          {statList.map((stat, i) => (
            <motion.div
              key={stat.labelText + i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center justify-center py-2"
            >
              <div className="flex items-baseline justify-center">
                <span className="font-extrabold text-[#262626] text-[52px] sm:text-[60px] lg:text-[68px] leading-none tracking-tight">
                  {isInView && stat.value > 0 ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      useEasing
                      delay={i * 0.15}
                    />
                  ) : (
                    stat.displayVal
                  )}
                </span>
                {stat.suffix && (
                  <span className="font-extrabold text-[#262626] text-[44px] sm:text-[52px] lg:text-[60px] leading-none ml-0.5">
                    {stat.suffix}
                  </span>
                )}
              </div>

              <p className="mt-3.5 text-[13px] font-bold tracking-[0.22em] text-[#666666] uppercase">
                {stat.labelText}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
