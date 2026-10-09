"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import { useTranslation } from "@/context/LanguageContext";
import type { NewsArticle } from "@/types";
import { getSingleNoticeApi, type NoticeItem } from "@/lib/noticeApi";
import { getLocalizedText } from "@/lib/i18nHelpers";
import { NoticeDetailSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";

export interface NoticePreviewData {
  categoryText: string;
  titleText: string;
  dateText: string;
  images: string[];
  htmlContent: string;
  agendaHighlights: Array<{ num: number; title: string; text: string }>;
}

interface NoticeDetailClientProps {
  article?: NewsArticle;
  idOrSlug?: string;
  previewData?: NoticePreviewData;
}



// ─── Image Slider ─────────────────────────────────────────────────────────────
interface ImageSliderProps {
  images: string[];
  title: string;
  onOpenLightbox: (index: number) => void;
}

function ImageSlider({ images, title, onOpenLightbox }: ImageSliderProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setActive(next);
  }, []);

  const prev = useCallback(() => {
    goTo((active - 1 + images.length) % images.length, -1);
  }, [active, images.length, goTo]);

  const next = useCallback(() => {
    goTo((active + 1) % images.length, 1);
  }, [active, images.length, goTo]);

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => next(), 4000);
    return () => clearInterval(timer);
  }, [next, images.length]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Slide frame */}
      <div className="relative w-full h-[260px] sm:h-[420px] md:h-[480px] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 group">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.32, 0, 0.67, 0] }}
            className="absolute inset-0"
          >
            <Image
              src={images[active] || "/images/news/news-1.svg"}
              alt={`${title} — image ${active + 1}`}
              fill
              priority={active === 0}
              loading={active === 0 ? "eager" : "lazy"}
              unoptimized={images[active]?.endsWith(".svg")}
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-cover w-full h-full"
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="
                absolute left-3 top-1/2 -translate-y-1/2 z-20
                w-9 h-9 rounded-full
                bg-black/40 hover:bg-black/60 backdrop-blur-sm
                text-white flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                focus-visible:opacity-100 cursor-pointer
              "
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="
                absolute right-3 top-1/2 -translate-y-1/2 z-20
                w-9 h-9 rounded-full
                bg-black/40 hover:bg-black/60 backdrop-blur-sm
                text-white flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                focus-visible:opacity-100 cursor-pointer
              "
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom fullscreen hint */}
        <button
          type="button"
          onClick={() => onOpenLightbox(active)}
          aria-label="View full image"
          className="
            absolute bottom-3 right-3 z-20
            w-8 h-8 rounded-full
            bg-black/40 hover:bg-black/70 backdrop-blur-sm
            text-white flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer
          "
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Slide counter badge */}
        {images.length > 1 && (
          <span className="absolute top-3 left-3 z-20 bg-black/50 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Dynamic Pagination Dot Indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Image navigation">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => goTo(i, i > active ? 1 : -1)}
              className="p-1 focus:outline-none cursor-pointer"
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={`block h-2 rounded-full transition-colors duration-200 ${
                  i === active
                    ? "w-6 bg-emerald-600 dark:bg-emerald-500"
                    : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  images: string[];
  startIndex: number;
  title: string;
  onClose: () => void;
}

function Lightbox({ images, startIndex, title, onClose }: LightboxProps) {
  const [active, setActive] = useState(startIndex);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setActive(next);
  }, []);

  const prev = useCallback(() => goTo((active - 1 + images.length) % images.length, -1), [active, images.length, goTo]);
  const next = useCallback(() => goTo((active + 1) % images.length, 1), [active, images.length, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-[900px] max-h-[90vh] flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative w-full h-[55vw] max-h-[70vh] min-h-[260px] rounded-2xl overflow-hidden bg-black">
          <Image
            src={images[active] || "/images/news/news-1.svg"}
            alt={`${title} — image ${active + 1}`}
            fill
            priority
            unoptimized={images[active]?.endsWith(".svg")}
            sizes="(max-width: 900px) 100vw, 900px"
            className="object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Notice Detail Component ─────────────────────────────────────────────
export function NoticeDetailClient({ article, idOrSlug, previewData }: NoticeDetailClientProps) {
  const { lang } = useTranslation();
  const isBn = lang === "bn";

  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(!!idOrSlug && !previewData);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!idOrSlug || previewData) return;
    setLoading(true);
    getSingleNoticeApi(idOrSlug)
      .then((data) => {
        if (data) setNotice(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [idOrSlug, previewData]);

  const backText = isBn ? "← ফিরে যান" : "← Back";

  // Category
  const categoryTagText = previewData
    ? previewData.categoryText
    : notice?.category
    ? getLocalizedText(notice.category, lang)
    : "OFFICIAL NOTICE";

  // Title
  const titleText = previewData
    ? previewData.titleText
    : notice
    ? getLocalizedText(notice.title, lang)
    : article
    ? isBn && article.titleBn
      ? article.titleBn
      : article.title
    : "";

  // Date
  const rawDate = notice?.publishedDate || notice?.createdAt || article?.date;
  const dateText = previewData
    ? previewData.dateText
    : rawDate
    ? new Date(rawDate).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Agenda List
  const agendaList = previewData
    ? previewData.agendaHighlights
    : notice?.agendaHighlights && notice.agendaHighlights.length > 0
    ? notice.agendaHighlights.map((ag, idx) => ({
        num: ag.num || idx + 1,
        title: getLocalizedText(ag.title, lang),
        text: getLocalizedText(ag.text, lang),
      }))
    : [];

  // Images
  const rawImages = previewData
    ? previewData.images
    : notice
    ? notice.images
    : article?.images || (article?.image ? [article.image] : []);
  const images: string[] =
    rawImages && rawImages.length > 0 ? rawImages : [];

  // Content body
  const rawContent = previewData
    ? previewData.htmlContent
    : notice
    ? getLocalizedText(notice.content, lang) || getLocalizedText(notice.description, lang)
    : "";

  // Clean sanitized HTML
  const sanitizedHtml = DOMPurify.sanitize(rawContent);

  if (loading) {
    return <NoticeDetailSkeleton />;
  }

  if (!notice && !article && !previewData) {
    return (
      <div className="flex-1 w-full max-w-[780px] mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center">
        <EmptyState
          title="Notice Not Found"
          titleBn="নোটিশটি পাওয়া যায়নি"
          description="The requested notice or announcement could not be found."
          descriptionBn="অনুরোধকৃত নোটিশ বা ঘোষণাটি খুঁজে পাওয়া যায়নি বা অপসারণ করা হয়েছে।"
          actionButton={
            <Link
              href="/notice"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00B074] text-white rounded-xl text-sm font-semibold hover:bg-[#009663] transition-colors"
            >
              {backText}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 w-full max-w-[780px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        {/* Top Back Link */}
        {!previewData && (
          <Link
            href="/notice"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            {backText}
          </Link>
        )}

        {/* Header & Meta Info */}
        <div className="flex flex-col items-center text-center gap-3">
          {/* Category Badge */}
          <span className="text-xs font-semibold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
            {categoryTagText}
          </span>

          {/* Main Notice Title */}
          <h1 className="font-serif text-3xl md:text-4xl text-center font-bold text-gray-900 dark:text-white leading-tight my-2">
            {titleText}
          </h1>

          {/* Date Metadata */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <time>{dateText}</time>
          </div>
        </div>

        {/* Hero Image Carousel Slider */}
        <ImageSlider
          images={images}
          title={titleText}
          onOpenLightbox={(i) => setLightboxIndex(i)}
        />

        {/* Article Content Body with Dropcap and TipTap Tailwind Prose styles */}
        <div className="w-full space-y-6">
          <div
            className="prose prose-emerald max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg dark:prose-invert first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-gray-900 dark:first-letter:text-white"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />

          {/* Agenda Highlights Component (Styled Card) */}
          {agendaList && agendaList.length > 0 && (
            <div className="bg-slate-50/80 dark:bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 my-8 shadow-2xs">
              <h2 className="font-serif font-bold text-2xl text-emerald-900 dark:text-emerald-400 mb-6">
                {isBn ? "এজেন্ডা হাইলাইট" : "Agenda Highlights"}
              </h2>
              <div className="space-y-4">
                {agendaList.map((item, idx) => (
                  <div key={item.num || idx} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm flex items-center justify-center mt-0.5 border border-emerald-200 dark:border-emerald-800">
                      {item.num || idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-base">{item.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            startIndex={lightboxIndex}
            title={titleText}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
