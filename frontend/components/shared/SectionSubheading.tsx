"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionSubheadingProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function SectionSubheading({
  children,
  className,
  align = "center",
}: SectionSubheadingProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        "text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl",
        align === "center" && "text-center mx-auto",
        align === "left" && "text-left",
        className
      )}
    >
      {children}
    </motion.p>
  );
}
