"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  titleLine1: string;
  titleLine2?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({
  breadcrumbs = [{ label: "HOME", href: "/" }, { label: "OUR STORY" }],
  titleLine1,
  titleLine2,
  description,
  className = "",
  children,
}: PageHeroProps) {
  return (
    <section
      id="home"
      className="relative w-full pt-12 pb-12 sm:pt-20 sm:pb-20 md:pt-32 md:pb-32 overflow-hidden bg-[linear-gradient(180deg,var(--color-figma-linear-start)_0%,var(--color-figma-linear-end)_100%)]"    >
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
        {/* Breadcrumb Row */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[12px] sm:text-[13px] font-bold tracking-[0.18em] uppercase mb-4 text-[#666666]"
          >
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={item.label + index} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#2B5A27] stroke-[3]" />
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="hover:text-[#2B5A27] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-[#2B5A27]" : ""}>
                      {item.label}
                    </span>
                  )}
                </span>
              );
            })}
          </motion.nav>
        )}

        {/* 2-Line Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="font-serif text-[#262626] text-[36px] sm:text-[48px] md:text-[56px] leading-[1.12] tracking-tight">
            <span className="block font-bold">{titleLine1}</span>
            {titleLine2 && (
              <span className="block italic font-normal text-[36px] sm:text-[48px] md:text-[56px]">
                {titleLine2}
              </span>
            )}
          </h1>
        </motion.div>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-[#666666] text-[15px] sm:text-[17px] leading-[1.65] max-w-[620px] font-normal"
          >
            {description}
          </motion.p>
        )}

        {/* Custom Extra Sub-Content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
