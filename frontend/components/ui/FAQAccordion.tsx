"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    // Each item is its own standalone card — gap between rows, no outer wrapper
    <div className="w-full flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="w-full bg-white border border-[#E5E5E5] rounded-[14px] overflow-hidden transition-shadow duration-200 hover:shadow-sm"
          >
            {/* Row trigger */}
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left cursor-pointer group"
              aria-expanded={isOpen}
              id={`faq-btn-${item.id}`}
              aria-controls={`faq-panel-${item.id}`}
            >
              <span className="font-semibold text-[14.5px] sm:text-[15px] leading-snug text-[#1A1A1A]">
                {item.question}
              </span>

              {/* ± icon — gray circle, matching image 2 */}
              <span
                className={`
                  flex-shrink-0 w-7 h-7 rounded-full border
                  flex items-center justify-center
                  transition-all duration-200
                  ${isOpen
                    ? "bg-[#F0F0F0] border-[#D5D5D5] text-[#555555]"
                    : "bg-[#F5F5F5] border-[#E0E0E0] text-[#777777] group-hover:bg-[#EBEBEB]"
                  }
                `}
              >
                {isOpen
                  ? <Minus className="w-3.5 h-3.5" />
                  : <Plus className="w-3.5 h-3.5" />
                }
              </span>
            </button>

            {/* Answer panel */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {/* Hairline separator between question and answer */}
                  <div className="mx-5 sm:mx-6 h-px bg-[#F0F0F0]" />
                  <p className="px-5 sm:px-6 pt-3.5 pb-5 text-[13.5px] sm:text-[14px] text-[#555555] leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
