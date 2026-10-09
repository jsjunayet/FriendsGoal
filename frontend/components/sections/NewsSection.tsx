"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "@/components/cards/NewsCard";
import { useTranslation } from "@/context/LanguageContext";
import { getNoticesApi, type NoticeItem } from "@/lib/noticeApi";
import { NoticeGridSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export function NewsSection() {
  const { t } = useTranslation();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticesApi()
      .then((data) => {
        if (data && data.length > 0) {
          setNotices(data);
        } else {
          setNotices([]);
        }
      })
      .catch(() => {
        setNotices([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="notice"
      className="w-full bg-[#FAFAFA] py-16 sm:py-24 lg:py-28 border-t border-[#E5E5E5] overflow-hidden"
      aria-label="News & Stories"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Tag */}
          <span className="text-[13px] font-bold tracking-[0.2em] text-[#666666] uppercase mb-2 block">
            {t("news_tag")}
          </span>

          {/* Row with Title & View All */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <h2 className="font-serif text-[34px] sm:text-[42px] font-bold text-[#262626] leading-tight">
                {t("news_heading")}
              </h2>
              <p className="mt-2 text-[#666666] text-[16px] max-w-[580px]">
                {t("news_description")}
              </p>
            </div>

            <Link
              href="/notices"
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#262626] hover:text-[#1FDE64] transition-colors duration-200 flex-shrink-0"
            >
              <span>{t("news_view_all")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 News Cards Grid / Skeleton Fallback / Empty State */}
          {loading ? (
            <NoticeGridSkeleton count={3} />
          ) : notices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {notices.slice(0, 3).map((notice, i) => (
                <NewsCard key={notice._id} notice={notice} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No notices yet"
              titleBn="এখনো কোনো নোটিশ নেই"
              description="All official notices and announcements will appear here once published."
              descriptionBn="প্রকাশিত হলে সমস্ত আনুষ্ঠানিক নোটিশ ও ঘোষণা এখানে প্রদর্শিত হবে।"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
