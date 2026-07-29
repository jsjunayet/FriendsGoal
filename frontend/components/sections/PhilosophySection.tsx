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

export function PhilosophySection() {
  const { lang } = useTranslation();
  const isBn = lang === "bn";

  return (
    <section
      className="w-full bg-white py-14 sm:py-20 lg:py-28"
      aria-labelledby="philosophy-heading"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 xl:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:items-start gap-10 lg:gap-16"
        >

          {/* ── LEFT — text ──────────────────────────────────────────────── */}
          <div className="flex flex-col items-start">

            {/* Tag — teal-green, tracked, uppercase */}
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#2B7A3D] uppercase mb-4">
              {isBn ? "আমাদের দর্শন" : "OUR PHILOSOPHY"}
            </span>

            {/* Heading — dark, serif, bold */}
            <h2
              id="philosophy-heading"
              className="font-serif text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-[#111111] leading-[1.2]"
            >
              {isBn
                ? "একটি স্বনির্ভর আর্থিক সম্প্রদায় গড়ে তোলা"
                : "Building a Self-Reliant Financial Community"}
            </h2>

            {/* Para 1 */}
            <p className="mt-6 text-[15px] leading-[1.8] text-[#444444]">
              {isBn
                ? "ফ্রেন্ডস গোল একটি স্ব-উন্নয়নমূলক অর্থনৈতিক সংগঠন যা বিশ্বাস, পারস্পরিক সহায়তা এবং সুদমুক্ত প্রবৃদ্ধির ভিত্তিতে প্রতিষ্ঠিত। আমরা বিশ্বাস করি যে আর্থিক স্বাধীনতা সবচেয়ে ভালোভাবে অর্জন করা যায় যখন আমরা একসাথে চলি, আমাদের শক্তি ও সম্পদ একত্রিত করে এমন একটি নিরাপত্তা জাল তৈরি করি যা শতাংশের চেয়ে মানুষকে মূল্য দেয়।"
                : "Friends Goal is a self-development economic organization built on the bedrock of trust, mutual support, and interest-free growth. We believe that financial freedom is best achieved when we walk together, pooling our strengths and resources to create a safety net that values people over percentages."}
            </p>

            {/* Para 2 */}
            <p className="mt-4 text-[15px] leading-[1.8] text-[#444444]">
              {isBn
                ? "আমাদের উদ্দেশ্য হলো সদস্যদের পদ্ধতিগত সঞ্চয় ও স্বচ্ছ ব্যবস্থাপনার মাধ্যমে স্বনির্ভর জীবন গড়তে সক্ষম করা। শোষণমূলক সুদের বোঝা দূর করে এবং জবাবদিহিতার সংস্কৃতি গড়ে তুলে, আমরা আমাদের সদস্যদের সত্যিকারের গুরুত্বপূর্ণ বিষয়ে মনোনিবেশ করতে সুযোগ দিই: নিজেদের এবং পরিবারের জন্য টেকসই অগ্রগতি।"
                : "Our purpose is to enable members to build self-reliant lives through systematic savings and transparent management. By removing the burden of predatory interest and fostering a culture of accountability, we allow our members to focus on what truly matters: sustainable progress for themselves and their families."}
            </p>

            {/* Stats — dark green values, gray labels, green underline */}
            <dl className="mt-10 flex items-start gap-10 sm:gap-14 border-t border-[#E5E5E5] pt-8 w-full">
              <div className="flex flex-col items-start">
                <dt className="text-[34px] sm:text-[40px] font-bold leading-none text-[#1A5C30]">
                  100%
                </dt>
                <dd className="mt-2 pb-2 text-[11px] font-bold tracking-[0.18em] text-[#666666] uppercase">
                  {isBn ? "সুদমুক্ত" : "INTEREST FREE"}
                </dd>
                <span className="h-[2px] w-8 bg-[#1FDE64]" aria-hidden="true" />
              </div>
              <div className="flex flex-col items-start">
                <dt className="text-[34px] sm:text-[40px] font-bold leading-none text-[#1A5C30]">
                  {isBn ? "বিশ্বাস" : "Trust"}
                </dt>
                <dd className="mt-2 pb-2 text-[11px] font-bold tracking-[0.18em] text-[#666666] uppercase">
                  {isBn ? "আমাদের মুদ্রা" : "OUR CURRENCY"}
                </dd>
                <span className="h-[2px] w-8 bg-[#1FDE64]" aria-hidden="true" />
              </div>
            </dl>
          </div>

          {/* ── RIGHT — image with card overlapping from below ───────────── */}
          <div className="w-full flex flex-col">

            {/* Image container — overflow-hidden clips image cleanly */}
            <div className="relative w-full h-[290px] sm:h-[390px] lg:h-[430px] rounded-[24px] sm:rounded-[28px] overflow-hidden">
              <Image
                src="/images/about/about-2-team.png"
                alt="Friends Goal team members collaborating"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>

            {/* Floating card — negative margin pulls it up over image bottom */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="
                relative z-10
                -mt-[80px] left-0 sm:ml-5
                w-[68%] max-w-[270px]
                rounded-[18px] bg-[#FAFAF8]
                sm:-left-20
                px-5 py-4
                shadow-[0_8px_32px_rgba(0,0,0,0.12)]
              "
            >
              {/* Icon + title row */}
              <div className="flex items-center gap-2.5">
                {/* Solid dark-green shield icon — matches reference exactly */}
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#1A5C30]" strokeWidth={2} />
                </div>
                <h3 className="text-[13.5px] font-bold text-[#111111] leading-tight">
                  {isBn ? "যাচাইকৃত সিস্টেম" : "Verified System"}
                </h3>
              </div>

              {/* Description — plain gray text, matches reference */}
              <p className="mt-2.5 text-[12px] leading-[1.65] text-[#555555]">
                {isBn
                  ? "স্বচ্ছ পরিচালনা মডেল নিশ্চিত করে যে প্রতিটি সদস্যের অবদান নিরাপদ ও কার্যকর।"
                  : "Transparent governance model ensures every member's contribution is secure and impactful."}
              </p>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </section>
  );
}
