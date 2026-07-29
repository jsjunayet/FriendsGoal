"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { useTranslation } from "@/context/LanguageContext";

import "swiper/css";
import "swiper/css/pagination";

// ─── All gallery images ────────────────────────────────────────────────────────

const GALLERY_SLIDES = [
  {
    src: "/images/hero/hero-2.png",
    title: "Strategic Financial Workshop",
    titleBn: "কৌশলগত আর্থিক কর্মশালা",
    subtitle: "Members collaborating on long-term investment models",
    subtitleBn: "দীর্ঘমেয়াদী বিনিয়োগ মডেল নিয়ে সদস্যদের যৌথ পর্যালোচনা",
  },
  {
    src: "/images/hero/hero-1.png",
    title: "Annual Community Assembly",
    titleBn: "বার্ষিক সাধারণ সমাবেশ",
    subtitle: "Transparent democratic board reporting",
    subtitleBn: "স্বচ্ছ ও গণতান্ত্রিক পর্ষদ প্রতিবেদন উপস্থাপনা",
  },
  {
    src: "/images/about/about-1.png",
    title: "Mutual Fund Project Review",
    titleBn: "মিউচুয়াল ফান্ড প্রকল্প পর্যালোচনা",
    subtitle: "Interest-free savings allocation & distribution",
    subtitleBn: "সুদমুক্ত সঞ্চয় তহবিল বন্টন ও সুষম ব্যবস্থাপনা",
  },
  {
    src: "/images/hero/hero-3.png",
    title: "Unity & Support Gathering",
    titleBn: "ঐক্য ও পারস্পরিক সহায়তা সমাবেশ",
    subtitle: "Strengthening community bonds nationwide",
    subtitleBn: "সারাদেশে সম্প্রদায়ের বন্ধন সুদৃঢ়করণ",
  },
  {
    src: "/images/hero/hero-5.png",
    title: "Youth Empowerment Initiative",
    titleBn: "যুব ক্ষমতায়ন উদ্যোগ",
    subtitle: "Building self-reliant lives through shared vision",
    subtitleBn: "ভাগ করা দৃষ্টিভঙ্গির মাধ্যমে স্বনির্ভর জীবন গঠন",
  },
  {
    src: "/images/hero/hero-2.png",
    title: "Savings Milestone Celebration",
    titleBn: "সঞ্চয় মাইলফলক উদযাপন",
    subtitle: "Recognising members who reached key savings targets",
    subtitleBn: "লক্ষ্যমাত্রা অর্জনকারী সদস্যদের স্বীকৃতি প্রদান",
  },
  {
    src: "/images/hero/hero-1.png",
    title: "Leadership Training Session",
    titleBn: "নেতৃত্ব প্রশিক্ষণ অধিবেশন",
    subtitle: "Equipping council members with governance skills",
    subtitleBn: "পর্ষদ সদস্যদের পরিচালনা দক্ষতা উন্নয়ন",
  },
  {
    src: "/images/about/about-1.png",
    title: "Community Outreach Programme",
    titleBn: "সমাজসেবামূলক আউটরিচ কর্মসূচি",
    subtitle: "Extending our mission beyond membership",
    subtitleBn: "সদস্যপদের বাইরেও আমাদের লক্ষ্য সম্প্রসারণ",
  },
  {
    src: "/images/hero/hero-3.png",
    title: "Quarterly Finance Review",
    titleBn: "ত্রৈমাসিক আর্থিক পর্যালোচনা",
    subtitle: "Full transparency in every taka accounted",
    subtitleBn: "প্রতিটি টাকার পূর্ণ স্বচ্ছ হিসাব নিরীক্ষণ",
  },
  {
    src: "/images/hero/hero-5.png",
    title: "New Member Orientation",
    titleBn: "নতুন সদস্য পরিচিতি অনুষ্ঠান",
    subtitle: "Welcoming the newest faces of Friends Goal",
    subtitleBn: "ফ্রেন্ডস গোলের নবাগত সদস্যদের স্বাগত জানানো",
  },
  {
    src: "/images/hero/hero-2.png",
    title: "Investment Planning Seminar",
    titleBn: "বিনিয়োগ পরিকল্পনা সেমিনার",
    subtitle: "Charting collective growth strategies",
    subtitleBn: "সম্মিলিত প্রবৃদ্ধির কৌশল নির্ধারণ",
  },
  {
    src: "/images/hero/hero-1.png",
    title: "Eid Celebration Gathering",
    titleBn: "ঈদ উদযাপন সমাবেশ",
    subtitle: "Celebrating togetherness and shared values",
    subtitleBn: "ঐক্য ও ভাগ করা মূল্যবোধ উদযাপন",
  },
];

// ─── Page count — how many images to show per Load More click ─────────────────
const PAGE_SIZE = 6;

// ─── Grid view (gallery page only) ───────────────────────────────────────────

function GalleryGrid() {
  const { lang, t } = useTranslation();
  const isBn = lang === "bn";
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleSlides = GALLERY_SLIDES.slice(0, visibleCount);
  const hasMore = visibleCount < GALLERY_SLIDES.length;

  return (
    <section
      className="w-full bg-[#262626] text-white py-16 sm:py-24 lg:py-28"
      aria-label="Photo Gallery"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence initial={false}>
            {visibleSlides.map((slide, index) => {
              const slideTitle = isBn ? slide.titleBn : slide.title;
              const slideSubtitle = isBn ? slide.subtitleBn : slide.subtitle;
              return (
                <motion.div
                  key={slide.title + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index % PAGE_SIZE * 0.05 }}
                  className="relative h-[260px] sm:h-[320px] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/10 shadow-lg bg-[#333] group"
                >
                  <Image
                    src={slide.src}
                    alt={slideTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index < PAGE_SIZE ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay & caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-left">
                    <h3 className="font-bold text-[16px] sm:text-[18px] text-white leading-snug">
                      {slideTitle}
                    </h3>
                    <p className="text-[12px] sm:text-[13px] text-gray-300 mt-1 leading-snug">
                      {slideSubtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load More button */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="
                inline-flex items-center justify-center gap-2
                h-[48px] px-8 rounded-full
                bg-white text-[#262626]
                text-[14px] font-semibold tracking-tight
                hover:bg-[#1FDE64] hover:text-white
                transition-all duration-200 shadow-sm cursor-pointer
              "
            >
              {t("gallery_see_more")}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* All loaded message */}
        {!hasMore && GALLERY_SLIDES.length > PAGE_SIZE && (
          <p className="mt-10 text-center text-gray-400 text-[13px]">
            {isBn ? "সব ছবি দেখানো হয়েছে" : "All photos loaded"}
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Slider view (homepage only) ─────────────────────────────────────────────

function GallerySlider() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const { lang, t } = useTranslation();
  const isBn = lang === "bn";

  return (
    <section
      id="gallery"
      className="w-full bg-[#262626] text-white py-16 sm:py-24 lg:py-28 overflow-hidden relative"
      aria-label="Photo Gallery"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-start"
        >
          {/* Tag */}
          <span className="text-[13px] font-bold tracking-[0.2em] text-[#1FDE64] uppercase mb-3">
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

          {/* Carousel */}
          <div className="mt-10 sm:mt-14 w-full relative">
            {/* Left arrow */}
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
              className="
                hidden sm:flex
                absolute -left-4 sm:-left-6 top-[45%] -translate-y-1/2 z-30
                w-10 h-10 sm:w-12 sm:h-12 rounded-full
                bg-white/15 hover:bg-white/30 backdrop-blur-md
                border border-white/20 text-white
                items-center justify-center
                transition-all duration-200 shadow-lg cursor-pointer
                focus-visible:outline-2 focus-visible:outline-[#1FDE64]
              "
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <Swiper
              onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
              modules={[Autoplay, Pagination, Navigation]}
              loop={true}
              autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="w-full pb-14"
            >
              {GALLERY_SLIDES.map((slide, index) => {
                const slideTitle = isBn ? slide.titleBn : slide.title;
                const slideSubtitle = isBn ? slide.subtitleBn : slide.subtitle;
                return (
                  <SwiperSlide key={slide.title + index}>
                    <div className="relative h-[280px] sm:h-[360px] md:h-[420px] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/10 shadow-lg bg-[#262626] group">
                      <Image
                        src={slide.src}
                        alt={slideTitle}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        unoptimized={slide.src.endsWith(".svg")}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-left">
                        <h3 className="font-bold text-[18px] text-white leading-snug">
                          {slideTitle}
                        </h3>
                        <p className="text-[13px] text-gray-300 mt-1 leading-snug font-normal">
                          {slideSubtitle}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Right arrow */}
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
              className="
                hidden sm:flex
                absolute -right-4 sm:-right-6 top-[45%] -translate-y-1/2 z-30
                w-10 h-10 sm:w-12 sm:h-12 rounded-full
                bg-white/15 hover:bg-white/30 backdrop-blur-md
                border border-white/20 text-white
                items-center justify-center
                transition-all duration-200 shadow-lg cursor-pointer
                focus-visible:outline-2 focus-visible:outline-[#1FDE64]
              "
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* See More link */}
          <div className="mt-4 w-full flex justify-center">
            <a
              href="/gallery"
              className="
                inline-flex items-center justify-center
                h-[48px] px-8 rounded-full
                bg-white text-[#262626]
                text-[15px] font-semibold tracking-tight
                hover:bg-[#1FDE64] hover:text-white
                transition-all duration-200 shadow-sm
              "
            >
              {t("gallery_see_more")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export function GallerySection({ isPage = false }: { isPage?: boolean }) {
  return isPage ? <GalleryGrid /> : <GallerySlider />;
}
