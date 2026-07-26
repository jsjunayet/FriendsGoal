"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NewsArticle } from "@/types";
import { useTranslation } from "@/context/LanguageContext";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

function isSvg(src?: string) {
  return src?.endsWith(".svg") ?? false;
}

export function NewsCard({ article, index }: NewsCardProps) {
  const { lang, t } = useTranslation();
  const authorParts = article.author.toUpperCase().split(" ");
  const shortAuthor = `${authorParts[0]} ${authorParts[authorParts.length - 1]}`;

  const noticeBadgeText = lang === "bn" ? "নোটিশ" : "NOTICE";
  const byText = lang === "bn" ? "এডমিন দ্বারা" : `BY ${shortAuthor}`;
  const readMoreText = t("news_read_more");
  const titleText = lang === "bn" && article.titleBn ? article.titleBn : article.title;

  const imgSrc = article.image || "/images/hero/hero-2.png";
  // First card is above the fold — preload it and load eagerly to fix LCP warning
  const isAboveFold = index === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-[24px] overflow-hidden border border-[#E5E5E5] flex flex-col shadow-xs hover:shadow-md transition-shadow duration-300"
    >
      {/* Image with NOTICE badge */}
      <div className="relative w-full h-[210px] sm:h-[220px] bg-[#EEF2F0] overflow-hidden">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          priority={isAboveFold}
          loading={isAboveFold ? "eager" : "lazy"}
          unoptimized={isSvg(imgSrc)}
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* NOTICE Badge */}
        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-sm text-[#262626] text-[10px] font-bold tracking-[0.14em] px-3 py-1 rounded-full shadow-xs border border-gray-100 uppercase">
          {noticeBadgeText}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col gap-2.5 flex-1 bg-white">
        {/* Date & Author */}
        <p className="text-[11px] font-bold tracking-[0.12em] text-[#888888] uppercase">
          {article.date.toUpperCase()} &bull; {byText}
        </p>

        {/* Title */}
        <h3 className="font-bold text-[#262626] text-[16px] sm:text-[17px] leading-snug flex-1 line-clamp-2">
          {titleText}
        </h3>

        {/* Read More Link */}
        <Link
          href={`/notice/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-[#262626] text-[14px] font-bold hover:text-[#2B5A27] hover:gap-3 transition-all duration-200 mt-1"
        >
          <span>{readMoreText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}
