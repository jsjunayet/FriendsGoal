"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard } from "@/components/cards/NewsCard";
import { NEWS_ARTICLES } from "@/constants/site";

const ITEMS_PER_PAGE = 9;

export function NoticeFeed() {
  const totalPages = Math.ceil(NEWS_ARTICLES.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const visible = NEWS_ARTICLES.slice(start, start + ITEMS_PER_PAGE);

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full py-14 sm:py-20 bg-white" aria-label="News & Stories feed">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 flex flex-col gap-10">
        {/* Filter pill — ALL */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center h-[36px] px-5 rounded-full bg-[#1FDE64] text-white text-[13px] font-bold uppercase tracking-wider cursor-pointer"
          >
            ALL
          </button>
        </div>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visible.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 pt-4"
          >
            <button
              type="button"
              onClick={() => goTo(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#E5E5E5] text-[#555555] hover:bg-[#FAFAFA] disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goTo(p)}
                className={`w-9 h-9 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                  p === page
                    ? "bg-[#1FDE64] text-white shadow-sm"
                    : "border border-[#E5E5E5] text-[#555555] hover:bg-[#FAFAFA]"
                }`}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goTo(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#E5E5E5] text-[#555555] hover:bg-[#FAFAFA] disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
