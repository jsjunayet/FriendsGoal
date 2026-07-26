"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const principles = [
  {
    value: "100%",
    label: "INTEREST FREE",
  },
  {
    value: "Trust",
    label: "OUR CURRENCY",
  },
];

export function PhilosophySection() {
  const { t } = useTranslation();

  return (
    <section
      className="w-full bg-white py-16 sm:py-24 lg:py-32"
      aria-labelledby="financial-community-heading"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 xl:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16"
        >
          {/* Left Column: Content Section */}
          <div className="flex flex-col items-start lg:col-span-7">
            <header className="flex w-full flex-col items-start gap-3">
              <span className="text-xs font-bold tracking-[0.2em] text-[#2B5A27] uppercase">
                {t("about_tag")}
              </span>

              <h2
                id="financial-community-heading"
                className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-[42px] leading-tight"
              >
                {t("about_heading")}
              </h2>
            </header>

            {/* Paragraphs */}
            <div className="mt-6 flex w-full flex-col gap-4 text-base leading-relaxed text-[#555555]">
              <p>{t("about_para1")}</p>
              <p>{t("about_para2")}</p>
            </div>

            {/* Principles / Stats Section (Figma Exact Match) */}
            <dl className="mt-10 flex w-full items-start gap-12 border-t border-black/10 pt-8 sm:gap-16">
              {principles.map((principle) => (
                <div key={principle.label} className="flex flex-col items-start">
                  <dt className=" text-3xl font-bold leading-none text-[#1A1A1A] sm:text-4xl">
                    {principle.value}
                  </dt>
                  <dd className="mt-2 pb-2 text-xs font-bold tracking-[0.18em] text-[#555555] uppercase">
                    {principle.label}
                  </dd>
                  {/* Bottom Accent Green Line */}
                  <span
                    className="h-0.5 w-8 bg-[#1FDE64]"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </dl>
          </div>

          {/* Right Column: Image & Floating Badge Card */}
          <div className="flex w-full flex-col items-start lg:col-span-5">
            {/* Image Container */}
            <div className="relative h-[380px] w-full overflow-hidden rounded-[40px] sm:h-[480px]">
              <Image
                src="/images/about/about-2.svg"
                alt="Friends Goal members working together"
                fill
                sizes="(max-width: 1024px) 100vw, 430px"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>

            {/* Floating Glassmorphism Overlay Card */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 -mt-12 bottom-20 right-20 ml-4 sm:ml-6 w-[88%] max-w-[300px] rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1FDE64] bg-[#F6FFED] text-[#2B5A27]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  Verified System
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#555555]">
                Transparent governance model ensures every member&apos;s
                contribution is secure and impactful.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}