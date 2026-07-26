"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  children,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className={cn(
        "font-bold text-gray-900 leading-tight",
        "text-[1.75rem] sm:text-[2rem] md:text-[2.25rem] lg:text-[2.5rem]",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {children}
    </motion.h2>
  );
}
