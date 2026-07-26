"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/auth/BrandLogo";

export function LoginBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[50%] xl:w-[54%] relative flex-col overflow-hidden">
      {/* Background photo */}
      <Image
        src="/images/hero/hero-4.png"
        alt="Friends Goal community"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/72 via-[#1A1A1A]/38 to-transparent" />

      {/* Logo */}
      <div className="relative z-10 p-8 sm:p-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <BrandLogo />
          <span className="font-bold text-white text-[17px] tracking-tight">
            Friends Goal
          </span>
        </Link>
      </div>

      {/* Bottom glass card */}
      <div className="relative z-10 mt-auto p-8 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[28px] p-7 sm:p-8 max-w-[420px]"
        >
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#1FDE64] uppercase block mb-4">
            ESTABLISHED 2024
          </span>
          <h2 className="font-serif text-white text-[26px] sm:text-[32px] font-bold leading-[1.2] mb-4">
            Designed for<br />
            High-Performance<br />
            Teams
          </h2>
          <p className="text-white/70 text-[14px] italic">
            &ldquo;Working together, growing together — Inshallah.&rdquo;
          </p>
        </motion.div>
      </div>
    </div>
  );
}
