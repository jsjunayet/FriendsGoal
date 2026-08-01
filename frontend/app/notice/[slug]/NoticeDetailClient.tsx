"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/context/LanguageContext";
import type { NewsArticle } from "@/types";
import { h1 } from "framer-motion/client";

interface NoticeDetailClientProps {
  article: NewsArticle;
}

const AGENDA_BN = [
  { num: 1, title: "বার্ষিক কর্মক্ষমতা পর্যালোচনা", text: "২০২৫ সালের প্রভাব মেট্রিক্স এবং আর্থিক বিবরণীর বিশদ বিবরণ।" },
  { num: 2, title: "পর্ষদ নির্বাচন", text: "নেতৃত্ব কাউন্সিলে তিনটি শূন্য পদের জন্য মনোনয়ন ও ভোটাভুটি।" },
  { num: 3, title: "উপ-আইন সংশোধন", text: "ডিজিটাল গভর্ন্যান্স কাঠামোতে প্রস্তাবিত পরিবর্তন পর্যালোচনা।" },
];

const AGENDA_EN = [
  { num: 1, title: "Annual Performance Review", text: "Detailed walkthrough of the 2025 impact metrics and financial statements." },
  { num: 2, title: "Board Elections", text: "Nomination and voting for three upcoming vacancies in the leadership council." },
  { num: 3, title: "Bylaw Amendments", text: "Reviewing proposed changes to the digital governance framework." },
];

// ─── Image Slider ─────────────────────────────────────────────────────────────
interface ImageSliderProps {
  images: string[];
  title: string;
  onOpenLightbox: (index: number) => void;
}

function ImageSlider({ images, title, onOpenLightbox }: ImageSliderProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const goTo = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setActive(next);
    },
    []
  );

  const prev = useCallback(() => {
    goTo((active - 1 + images.length) % images.length, -1);
  }, [active, images.length, goTo]);

  const next = useCallback(() => {
    goTo((active + 1) % images.length, 1);
  }, [active, images.length, goTo]);

  // Auto-advance every 4 s
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => next(), 4000);
    return () => clearInterval(timer);
  }, [next, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Slide frame */}
      <div className="relative w-full h-[260px] sm:h-[400px] rounded-[24px] overflow-hidden bg-[#EEF2F0] group">
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
              src={images[active]}
              alt={`${title} — image ${active + 1}`}
              fill
              priority={active === 0}
              loading={active === 0 ? "eager" : "lazy"}
              unoptimized={images[active].endsWith(".svg")}
              sizes="(max-width: 780px) 100vw, 780px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows — only shown when multiple images */}
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
                focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white
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
                focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white
              "
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom / fullscreen hint */}
        <button
          type="button"
          onClick={() => onOpenLightbox(active)}
          aria-label="View full image"
          className="
            absolute bottom-3 right-3 z-20
            w-8 h-8 rounded-full
            bg-black/40 hover:bg-black/70 backdrop-blur-sm
            text-white flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
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

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="Image navigation">
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
                    ? "w-6 bg-[#1FDE64]"
                    : "w-2 bg-[#DDDDDD] hover:bg-[#AAAAAA]"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i, i > active ? 1 : -1)}
              aria-label={`Select image ${i + 1}`}
              className={`
                relative flex-shrink-0 w-16 h-12 rounded-[10px] overflow-hidden
                border-2 transition-all duration-200 cursor-pointer
                ${i === active ? "border-[#1FDE64] scale-105" : "border-transparent opacity-60 hover:opacity-100"}
              `}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="64px"
                unoptimized={src.endsWith(".svg")}
                className="object-cover"
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
    // Prevent body scroll while lightbox is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0, scale: 0.95 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Stop click propagation on the image area */}
      <div
        className="relative w-full max-w-[900px] max-h-[90vh] flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main image */}
        <div className="relative w-full h-[55vw] max-h-[70vh] min-h-[260px] rounded-[20px] overflow-hidden bg-[#111]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={`${title} — image ${active + 1}`}
                fill
                priority
                unoptimized={images[active].endsWith(".svg")}
                sizes="(max-width: 900px) 100vw, 900px"
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <span className="absolute top-3 left-3 bg-black/60 text-white text-[12px] font-bold px-3 py-1 rounded-full">
              {active + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 justify-center overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, i > active ? 1 : -1)}
                aria-label={`Select image ${i + 1}`}
                className={`
                  relative flex-shrink-0 w-16 h-11 rounded-[10px] overflow-hidden
                  border-2 transition-all duration-200 cursor-pointer
                  ${i === active ? "border-[#1FDE64] scale-105" : "border-white/20 opacity-50 hover:opacity-100"}
                `}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  unoptimized={src.endsWith(".svg")}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function NoticeDetailClient({ article }: NoticeDetailClientProps) {
  const { lang, t } = useTranslation();
  const isBn = lang === "bn";

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const backText = isBn ? "ফিরে যান" : "Back";
  const categoryTagText = isBn ? "আনুষ্ঠানিক নোটিশ" : "OFFICIAL NOTICE";
  const titleText = isBn && article.titleBn ? article.titleBn : article.title;
  const dateText = isBn ? "১২ অক্টোবর, ২০২৫" : "October 12, 2025";
  const agendaTitleText = isBn ? "এজেন্ডা হাইলাইট" : "Agenda Highlights";
  const agendaList = isBn ? AGENDA_BN : AGENDA_EN;

  // Build the images list: prefer article.images[], fall back to single image
  const images: string[] =
    article.images && article.images.length > 0
      ? article.images
      : article.image
      ? [article.image]
      : ["/images/news/news-1.svg"];

  return (
    <>
      <main className="flex-1 w-full max-w-[780px] mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-8">
        {/* Back link */}
        <Link
          href="/notice"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#555555] hover:text-[#2B5A27] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {backText}
        </Link>

        {/* Category tag + title + date */}
        <div className="flex flex-col items-center text-center gap-4">
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#2B5A27] uppercase">
            {categoryTagText}
          </span>
          <h1 className="font-serif text-[#1A1A1A] text-[28px] sm:text-[36px] font-bold leading-[1.2] tracking-tight max-w-[640px]">
            {titleText}
          </h1>
          <div className="flex items-center gap-2 text-[13px] text-[#888888]">
            <Calendar className="w-4 h-4 text-[#1FDE64]" />
            <time dateTime="2025-10-12">{dateText}</time>
          </div>
        </div>

        {/* Image Slider */}
        <ImageSlider
          images={images}
          title={titleText}
          onOpenLightbox={(i) => setLightboxIndex(i)}
        />

        {/* Article body */}
        <div className="flex flex-col gap-5 text-[15px] text-[#555555] leading-[1.75]">
          {isBn ? (
            <>
              <p>
                <span className="float-left text-[64px] font-serif font-bold text-[#1A1A1A] leading-[0.8] mr-3 mt-1">
                  আ
                </span>
                মরা অত্যন্ত আনন্দের সাথে ২০২৬ সালের ফ্রেন্ডস গোল বার্ষিক সাধারণ সভা (এজিএম) ঘোষণা করছি। এই সমাবেশটি স্বচ্ছতা, সামগ্রিক সিদ্ধান্ত গ্রহণ এবং বিগত বারো মাসে আমরা একসাথে অর্জিত মাইলফলকগুলো উদযাপনের প্রাথমিক ফোরাম হিসেবে কাজ করবে।
              </p>
              <p>
                আমাদের সাংগঠনিক উপ-আইন অনুসারে, সমস্ত নিবন্ধিত সদস্যদের অংশগ্রহণ করার, মূল প্রস্তাবগুলোতে ভোট দেওয়ার এবং পরিচালনা পর্ষদের সাথে সরাসরি যুক্ত হওয়ার জন্য আমন্ত্রণ জানানো হচ্ছে।
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="float-left text-[64px] font-serif font-bold text-[#1A1A1A] leading-[0.8] mr-3 mt-1">
                  W
                </span>
                e are pleased to formally announce the Friends Goal Annual General Meeting (AGM) for the year
                2026. This gathering serves as our primary forum for transparency, collective decision-making,
                and celebrating the milestones we have achieved together over the past twelve months.
              </p>
              <p>
                In accordance with our organizational bylaws, all registered members are invited to participate, vote
                on key resolutions, and engage directly with the Board of Directors. This year&rsquo;s meeting will be hosted
                in a hybrid format to ensure maximum accessibility for our global community.
              </p>
            </>
          )}

          {/* Agenda Highlights */}
          <div className="mt-4 rounded-[24px] bg-[#1A1A1A] p-6 sm:p-8">
            <h2 className="font-serif font-bold text-white text-[20px] sm:text-[22px] mb-5">
              {agendaTitleText}
            </h2>
            <div className="flex flex-col gap-4">
              {agendaList.map((item) => (
                <div key={item.num} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1FDE64] text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <p className="font-bold text-white text-[14px] sm:text-[15px]">{item.title}</p>
                    <p className="text-gray-400 text-[13px] sm:text-[14px] mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Click Here link */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/notice"
                className="inline-flex items-center gap-1.5 text-[#1FDE64] text-[14px] font-semibold hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {isBn ? "এখানে ক্লিক করুন" : "Click Here"}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox — rendered in a portal-like pattern at root level */}
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
{/* <h1>hello world</h1> */}
