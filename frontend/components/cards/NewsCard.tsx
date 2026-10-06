"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { getLocalizedText, hasValidImage, getImageList } from "@/lib/i18nHelpers";
import type { NoticeItem } from "@/lib/noticeApi";
import type { NewsArticle } from "@/types";

interface NewsCardProps {
  article?: NewsArticle;
  notice?: NoticeItem;
  index: number;
}

export function NewsCard({ article, notice, index }: NewsCardProps) {
  const { lang } = useTranslation();

  let title = "";
  let description = "";
  let date = "";
  let author = "ADMIN";
  let slugOrId = "";
  let images: string[] = [];
  let categoryBadge = lang === "bn" ? "বিজ্ঞপ্তি" : "NOTICE";

  if (notice) {
    title = getLocalizedText(notice.title, lang);
    description = getLocalizedText(notice.description, lang);
    const rawDate = notice.publishedDate || notice.createdAt;
    date = new Date(rawDate).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    author = notice.author || "ADMIN";
    slugOrId = notice.slug || notice._id;
    images = getImageList(notice.images);
    if (notice.category) {
      categoryBadge = getLocalizedText(notice.category, lang);
    }
  } else if (article) {
    title = lang === "bn" && article.titleBn ? article.titleBn : article.title;
    description = lang === "bn" && (article as any).summaryBn ? (article as any).summaryBn : article.summary || "";
    date = article.date;
    author = article.author || "ADMIN";
    slugOrId = article.slug || String(article.id);
    images = getImageList(article.image);
  }

  const readMoreText = lang === "bn" ? "আরো দেখুন" : "Read More";
  const isAboveFold = index === 0;
  const hasImage = hasValidImage(images);
  const primaryImg = hasImage ? images[0] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-[24px] overflow-hidden border border-[#E5E5E5] flex flex-col shadow-xs hover:shadow-md transition-all duration-300 h-full"
    >
      {/* Image with Category Badge matching Image 2 */}
      <div className="relative w-full h-[210px] sm:h-[220px] bg-gray-100 overflow-hidden flex items-center justify-center">
        {hasImage && primaryImg ? (
          <Image
            src={primaryImg}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            priority={isAboveFold}
            loading={isAboveFold ? "eager" : "lazy"}
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          /* Fallback Pattern */
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-emerald-50/60">
            <div className="w-12 h-12 rounded-2xl bg-[#00B074]/15 text-[#00B074] flex items-center justify-center mb-2 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-[12px] font-bold text-gray-500 line-clamp-1 uppercase tracking-wider">
              Friends Goal Notice
            </p>
          </div>
        )}

        {/* Category Pill Badge (Light green badge on top right) */}
        <div className="absolute top-3.5 right-3.5 bg-[#EAF8E6] text-[#2D5A27] text-[10px] font-bold tracking-[0.12em] px-3 py-1 rounded-full border border-[#D4F2CC] uppercase z-10 shadow-2xs">
          {categoryBadge}
        </div>
      </div>

      {/* Content Below Image */}
      <div className="p-5 sm:p-6 flex flex-col gap-2 flex-1 bg-white justify-between">
        <div className="flex flex-col gap-2">
          {/* Date & Author */}
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#888888] uppercase line-clamp-1">
            {date.toUpperCase()} &bull; BY {author.toUpperCase()}
          </p>

          {/* Title in Serif font */}
          <h3 className="font-serif font-bold text-[#1A1A1A] text-[17px] sm:text-[18px] leading-snug line-clamp-2">
            {title}
          </h3>

          {/* Short Summary */}
          {description && (
            <p className="text-[#666666] text-[13px] line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Footer Read More Link */}
        <div className="pt-3 mt-1 border-t border-gray-100/60">
          <Link
            href={`/notice/${slugOrId}`}
            className="inline-flex items-center gap-1.5 text-[#1A1A1A] hover:text-[#2D5A27] text-[13.5px] font-bold transition-all duration-200"
          >
            <span>{readMoreText}</span>
            <ArrowRight className="w-4 h-4 text-[#2D5A27]" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

