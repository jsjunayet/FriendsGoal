"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import { useTranslation } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ContactSection() {
  const { lang } = useTranslation();
  const isBn = lang === "bn";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      id="contact-section"
      className="w-full py-16 sm:py-24 bg-[#F5F5F5] overflow-hidden"
      aria-label="Get In Touch"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start"
        >

          {/* ── Left Column ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-start pt-2">

            {/* Tag */}
            <span className="text-[12px] font-bold tracking-[0.18em] text-[#2B7A3D] uppercase mb-4 block">
              {isBn ? "যোগাযোগ করুন" : "GET IN TOUCH"}
            </span>

            {/* Heading */}
            <h2 className="font-serif text-[32px] sm:text-[38px] font-bold text-[#1A1A1A] leading-[1.2]">
              {isBn ? (
                <>চলুন একসাথে<br />ভবিষ্যৎ গড়ি।</>
              ) : (
                <>Let&apos;s build your<br />future together.</>
              )}
            </h2>

            {/* Description */}
            <p className="mt-5 text-[#555555] text-[15px] leading-relaxed max-w-[420px]">
              {isBn
                ? "আমাদের উদ্যোগ বা সদস্যপদ সম্পর্কে কোনো প্রশ্ন আছে? আমাদের দল আপনার আর্থিক স্বনির্ভরতার পথে সহায়তা করতে প্রস্তুত।"
                : "Have questions about our initiatives or how to become a member? Our team is here to support your journey towards financial self-reliance."}
            </p>

            {/* Contact items */}
            <div className="mt-10 flex flex-col gap-7">

              {/* Headquarters */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                  <MapPin className="w-4 h-4 text-[#555555]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] leading-tight">
                    {isBn ? "আমাদের সদর দফতর" : "Our Headquarters"}
                  </p>
                  <p className="text-[13.5px] text-[#555555] mt-1 leading-snug">
                    {SITE_CONFIG.address}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                  <Mail className="w-4 h-4 text-[#555555]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] leading-tight">
                    {isBn ? "ইমেইল সাপোর্ট" : "Email Support"}
                  </p>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-[13.5px] text-[#555555] hover:text-[#1A1A1A] mt-1 block transition-colors"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                  <Phone className="w-4 h-4 text-[#555555]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] leading-tight">
                    {isBn ? "সরাসরি লাইন" : "Direct Line"}
                  </p>
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="text-[13.5px] text-[#555555] hover:text-[#1A1A1A] mt-1 block transition-colors"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Form card ──────────────────────────────────── */}
          <div className="w-full bg-white rounded-[20px] p-8 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#F0FFF6] border border-[#1FDE64] flex items-center justify-center text-[#2B5A27] text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-serif font-bold text-[22px] text-[#1A1A1A]">
                  {isBn ? "বার্তা পাঠানো সফল!" : "Message Sent Successfully!"}
                </h3>
                <p className="text-[14px] text-[#555555] max-w-[300px]">
                  {isBn
                    ? "যোগাযোগের জন্য ধন্যবাদ। আমরা শীঘ্রই সাড়া দেব।"
                    : "Thank you for reaching out. Our team will get back to you shortly."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* FULL NAME */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-[0.16em] text-[#1A1A1A] uppercase">
                    {isBn ? "পূর্ণ নাম" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isBn ? "আপনার নাম লিখুন" : "Jane Doe"}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#BBBBBB]"
                  />
                </div>

                {/* EMAIL ADDRESS */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-[0.16em] text-[#1A1A1A] uppercase">
                    {isBn ? "ইমেইল ঠিকানা" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={isBn ? "আপনার ইমেইল" : "jane@example.com"}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#BBBBBB]"
                  />
                </div>

                {/* SUBJECT */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-[0.16em] text-[#1A1A1A] uppercase">
                    {isBn ? "বিষয়" : "Subject"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isBn ? "সদস্যপদ অনুসন্ধান" : "Membership Inquiry"}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#BBBBBB]"
                  />
                </div>

                {/* MESSAGE */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-[0.16em] text-[#1A1A1A] uppercase">
                    {isBn ? "বার্তা" : "Message"}
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder={isBn ? "আমরা কীভাবে সাহায্য করতে পারি?" : "How can we help you?"}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors resize-none placeholder:text-[#BBBBBB]"
                  />
                </div>

                {/* Submit button — dark pill matching the image */}
                <button
                  type="submit"
                  className="
                    mt-1 inline-flex items-center justify-center gap-2
                    w-full h-[52px] rounded-full
                    bg-[#1A1A1A] text-white
                    text-[15px] font-semibold
                    hover:bg-black transition-all duration-200 cursor-pointer
                  "
                >
                  {isBn ? "বার্তা পাঠান" : "Send Message"}
                  {/* Arrow icon matching the image */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
