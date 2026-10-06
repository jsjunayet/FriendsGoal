"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronDown, Image as ImageIcon, X, ZoomIn } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { useTranslation } from "@/context/LanguageContext";
import { getGalleryItemsApi, type GalleryItem } from "@/lib/galleryApi";
import { getLocalizedText, getImageList, hasValidImage } from "@/lib/i18nHelpers";
import { EmptyState } from "@/components/ui/EmptyState";

import "swiper/css";
import "swiper/css/pagination";

const PAGE_SIZE = 6;

// ─── Lightbox Modal Component ──────────────────────────────────────────────────
interface LightboxModalProps {
  items: Array<{ title: string; subtitle: string; image: string }>;
  startIndex: number;
  onClose: () => void;
}

function GalleryLightboxModal({ items, startIndex, onClose }: LightboxModalProps) {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeItem = items[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md"
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-white/80 max-w-[1100px]">
        <span className="text-xs font-semibold tracking-wider">
          {current + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Frame */}
      <div className="relative w-full max-w-[1000px] h-[65vh] sm:h-[75vh] flex items-center justify-center">
        {activeItem && (
          <Image
            src={activeItem.image}
            alt={activeItem.title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        )}

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-xs cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-xs cursor-pointer transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Title & Subtitle Caption */}
      <div className="text-center max-w-[640px] pb-2">
        <h4 className="text-white text-sm sm:text-base font-bold line-clamp-1">{activeItem?.title}</h4>
        {activeItem?.subtitle && (
          <p className="text-white/60 text-xs sm:text-sm mt-0.5 line-clamp-1">{activeItem.subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Grid view (gallery page only) ───────────────────────────────────────────
function GalleryGrid() {
  const { lang, t } = useTranslation();
  const isBn = lang === "bn";
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getGalleryItemsApi(selectedCategory === "all" ? undefined : selectedCategory)
      .then((data) => {
        setItems(data || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const visibleSlides = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const categories = [
    { key: "all", labelEn: "All Photos", labelBn: "সকল ছবি" },
    { key: "event", labelEn: "Events", labelBn: "অনুষ্ঠান" },
    { key: "workshop", labelEn: "Workshops", labelBn: "কর্মশালা" },
    { key: "assembly", labelEn: "Assemblies", labelBn: "সমাবেশ" },
  ];

  // Map to flat items for Lightbox
  const lightboxItems = items.map((slide) => {
    const title = getLocalizedText(slide.title, lang, "Gallery Event");
    const subtitle = getLocalizedText(slide.subtitle, lang, "");
    const images = getImageList(slide.images);
    return {
      title,
      subtitle,
      image: hasValidImage(images) ? images[0] : "/images/hero/hero-1.png",
    };
  });

  return (
    <section className="w-full bg-[#262626] text-white py-16 sm:py-24 lg:py-28" aria-label="Photo Gallery">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#00B074] text-white shadow-sm"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {isBn ? cat.labelBn : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-[#00B074] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">{isBn ? "গ্যালারি ছবি লোড হচ্ছে..." : "Loading photo gallery..."}</p>
          </div>
        ) : items.length > 0 ? (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <AnimatePresence initial={false}>
              {visibleSlides.map((slide, index) => {
                const slideTitle = getLocalizedText(slide.title, lang, "Gallery Event");
                const slideSubtitle = getLocalizedText(slide.subtitle, lang, "");
                const images = getImageList(slide.images);
                const hasImg = hasValidImage(images);
                const primaryImg = hasImg ? images[0] : null;

                return (
                  <motion.div
                    key={slide._id || slideTitle + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: (index % PAGE_SIZE) * 0.05 }}
                    onClick={() => setLightboxIndex(index)}
                    className="relative aspect-[4/3] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/10 shadow-lg bg-[#333] group cursor-pointer"
                  >
                    {hasImg && primaryImg ? (
                      <Image
                        src={primaryImg}
                        alt={slideTitle}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index < PAGE_SIZE ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#333] via-[#222] to-[#00B074]/20 p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3 border border-white/10">
                          <ImageIcon className="w-6 h-6 text-[#00B074]" />
                        </div>
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Friends Goal Gallery</p>
                      </div>
                    )}

                    {/* Category Badge Pill on Image */}
                    {slide.category && (
                      <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-xs text-[#00B074] text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase border border-[#00B074]/30 z-10">
                        {slide.category}
                      </div>
                    )}

                    {/* Zoom Icon overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Gradient overlay & caption */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 text-left z-10">
                      <h3 className="font-bold text-[16px] sm:text-[18px] text-white leading-snug line-clamp-1">
                        {slideTitle}
                      </h3>
                      {slideSubtitle && (
                        <p className="text-[12px] sm:text-[13px] text-gray-300 mt-1 leading-snug line-clamp-2">
                          {slideSubtitle}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            title="No photo gallery items found"
            titleBn="গ্যালারিতে কোনো ছবি পাওয়া যায়নি"
            subtext="Add photo gallery items from CMS Dashboard."
            subtextBn="সিএমএস ড্যাশবোর্ড থেকে নতুন ছবি যুক্ত করুন।"
          />
        )}

        {/* Load More button */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full bg-white text-[#262626] text-[14px] font-semibold tracking-tight hover:bg-[#00B074] hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
            >
              {t("gallery_see_more")}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightboxModal
            items={lightboxItems}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Slider view (homepage only) ─────────────────────────────────────────────
function GallerySlider() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const { lang, t } = useTranslation();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getGalleryItemsApi()
      .then((data) => {
        setItems(data || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const lightboxItems = items.map((slide) => {
    const title = getLocalizedText(slide.title, lang, "Gallery Event");
    const subtitle = getLocalizedText(slide.subtitle, lang, "");
    const images = getImageList(slide.images);
    return {
      title,
      subtitle,
      image: hasValidImage(images) ? images[0] : "/images/hero/hero-1.png",
    };
  });

  return (
    <section id="gallery" className="w-full bg-[#262626] text-white py-16 sm:py-24 lg:py-28 overflow-hidden relative" aria-label="Photo Gallery">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-start"
        >
          {/* Tag */}
          <span className="text-[13px] font-bold tracking-[0.2em] text-[#00B074] uppercase mb-3">
            {t("gallery_tag")}
          </span>

          {/* Heading */}
          <h2 className="font-serif text-[34px] sm:text-[42px] font-bold text-white leading-tight">
            {t("gallery_heading")}
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-gray-300 text-[16px] max-w-[580px]">
            {t("gallery_subtitle")}
          </p>

          {/* Carousel or Loading state */}
          {loading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#00B074] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-gray-400 text-xs">Loading photos...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="mt-10 sm:mt-14 w-full relative">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous slide"
                className="hidden sm:flex absolute -left-4 sm:-left-6 top-[45%] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all duration-200 shadow-lg cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <Swiper
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Autoplay, Pagination, Navigation]}
                loop={items.length > 3}
                autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                className="w-full pb-14"
              >
                {items.map((slide, index) => {
                  const slideTitle = getLocalizedText(slide.title, lang, "Gallery Event");
                  const slideSubtitle = getLocalizedText(slide.subtitle, lang, "");
                  const images = getImageList(slide.images);
                  const hasImg = hasValidImage(images);
                  const primaryImg = hasImg ? images[0] : null;

                  return (
                    <SwiperSlide key={slide._id || slideTitle + index}>
                      <div
                        onClick={() => setLightboxIndex(index)}
                        className="relative aspect-[4/3] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/10 shadow-lg bg-[#262626] group cursor-pointer"
                      >
                        {hasImg && primaryImg ? (
                          <Image
                            src={primaryImg}
                            alt={slideTitle}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index === 0}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#333] via-[#222] to-[#00B074]/20 p-6 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3 border border-white/10">
                              <ImageIcon className="w-6 h-6 text-[#00B074]" />
                            </div>
                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Friends Goal Gallery</p>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-left">
                          <h3 className="font-bold text-[18px] text-white leading-snug line-clamp-1">
                            {slideTitle}
                          </h3>
                          {slideSubtitle && (
                            <p className="text-[13px] text-gray-300 mt-1 leading-snug font-normal line-clamp-2">
                              {slideSubtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next slide"
                className="hidden sm:flex absolute -right-4 sm:-right-6 top-[45%] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all duration-200 shadow-lg cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <EmptyState
              title="No gallery photos found"
              titleBn="কোনো গ্যালারি ছবি পাওয়া যায়নি"
              subtext="Add photo sets from CMS Dashboard."
              subtextBn="সিএমএস ড্যাশবোর্ড থেকে ছবি সেট যুক্ত করুন।"
            />
          )}

          <div className="mt-4 w-full flex justify-center">
            <a
              href="/gallery"
              className="inline-flex items-center justify-center h-[48px] px-8 rounded-full bg-white text-[#262626] text-[15px] font-semibold tracking-tight hover:bg-[#00B074] hover:text-white transition-all duration-200 shadow-sm"
            >
              {t("gallery_see_more")}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightboxModal
            items={lightboxItems}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export function GallerySection({ isPage = false }: { isPage?: boolean }) {
  return isPage ? <GalleryGrid /> : <GallerySlider />;
}

