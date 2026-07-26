"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Send } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ContactSection() {
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
      className="w-full py-16 sm:py-24 bg-[#FAFAFA] border-t border-[#E5E5E5] overflow-hidden"
      aria-label="Get In Touch"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
        >
          {/* Left Column: Contact Info */}
          <div className="flex flex-col items-start">
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#2B5A27] uppercase mb-3 block">
              GET IN TOUCH
            </span>

            <h2 className="font-serif text-[32px] sm:text-[40px] font-bold text-[#1A1A1A] leading-tight">
              Let&apos;s build your
              <br />
              future together.
            </h2>

            <p className="mt-4 text-[#555555] text-[16px] leading-relaxed max-w-[480px]">
              Have questions about our initiatives or how to become a member? Our team is here to support
              your journey towards financial self-reliance.
            </p>

            {/* 3 Detail Cards */}
            <div className="mt-8 space-y-5 w-full max-w-[460px]">
              {/* Item 1: Headquarters */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#F6FFED] border border-[#1FDE64] flex items-center justify-center text-[#2B5A27] flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#2B5A27]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-[14px]">
                    Our Headquarters
                  </h4>
                  <p className="text-[13px] text-[#555555] mt-0.5 leading-snug">
                    Sudirman Central Business District, Level 28 Tower A, Jakarta
                  </p>
                </div>
              </div>

              {/* Item 2: Email Support */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#F6FFED] border border-[#1FDE64] flex items-center justify-center text-[#2B5A27] flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-[#2B5A27]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-[14px]">
                    Email Support
                  </h4>
                  <a
                    href="mailto:support@friendsgoal.org"
                    className="text-[13px] text-[#2B5A27] font-semibold hover:underline mt-0.5 block"
                  >
                    support@friendsgoal.org
                  </a>
                </div>
              </div>

              {/* Item 3: Direct Line */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#F6FFED] border border-[#1FDE64] flex items-center justify-center text-[#2B5A27] flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#2B5A27]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-[14px]">
                    Direct Line
                  </h4>
                  <a
                    href="tel:+622155501234"
                    className="text-[13px] text-[#2B5A27] font-semibold hover:underline mt-0.5 block"
                  >
                    +62 21 5550 1234
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full bg-white rounded-[32px] p-8 sm:p-10 border border-[#E5E5E5] shadow-sm">
            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#F6FFED] border border-[#1FDE64] flex items-center justify-center text-[#2B5A27]">
                  ✓
                </div>
                <h3 className="font-serif font-bold text-[22px] text-[#1A1A1A]">
                  Message Sent Successfully!
                </h3>
                <p className="text-[14px] text-[#555555] max-w-[320px]">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* FULL NAME */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-[0.15em] text-[#1A1A1A] uppercase">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full bg-[#F5F5F5] border border-transparent focus:border-[#1FDE64] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all"
                  />
                </div>

                {/* EMAIL ADDRESS */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-[0.15em] text-[#1A1A1A] uppercase">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-[#F5F5F5] border border-transparent focus:border-[#1FDE64] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all"
                  />
                </div>

                {/* SUBJECT */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-[0.15em] text-[#1A1A1A] uppercase">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Membership Inquiry"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-[#F5F5F5] border border-transparent focus:border-[#1FDE64] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all"
                  />
                </div>

                {/* MESSAGE */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-[0.15em] text-[#1A1A1A] uppercase">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-[#F5F5F5] border border-transparent focus:border-[#1FDE64] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="
                    mt-2 inline-flex items-center justify-center gap-2
                    w-full h-[48px] rounded-full
                    bg-[#262626] text-white
                    text-[15px] font-semibold tracking-tight
                    hover:bg-black transition-all duration-200 shadow-sm cursor-pointer
                  "
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
