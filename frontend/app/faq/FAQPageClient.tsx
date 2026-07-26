"use client";

import { PageHero } from "@/components/PageHero";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { useTranslation } from "@/context/LanguageContext";

const FAQ_ITEMS_EN: FAQItem[] = [
  { id: "faq-1", question: "How do I become a member?", answer: "To join Friends Goal, you need to be referred by an existing member. Once referred, you can apply through our portal and pay a one-time registration fee of BDT 200. Membership is subject to approval by the executive committee to ensure alignment with our community values." },
  { id: "faq-2", question: "What happens if I miss a monthly installment?", answer: "If you miss a monthly installment, the council will notify you within the first 5 business days. You have a 15-day grace period to make up the payment. Consecutive missed installments may result in a formal review by the Executive Council." },
  { id: "faq-3", question: "Is the saving scheme Shariah-compliant?", answer: "Yes. The Friends Goal savings initiative operates on a 100% interest-free model in alignment with Islamic finance principles. All investment decisions are reviewed by a designated Shariah compliance officer to ensure no riba (interest) is involved." },
  { id: "faq-4", question: "How is the annual fee utilized?", answer: "The annual fee covers operational costs including administrative support, digital infrastructure, legal compliance, and emergency fund reserves. A full financial report is published to all active members at the end of each fiscal year." },
  { id: "faq-5", question: "Can I withdraw my savings before the investment term ends?", answer: "Early withdrawal is permitted in specific circumstances such as medical emergencies or a formally submitted resignation. The request must be submitted to the Financial Council and is typically processed within 30–60 business days." },
  { id: "faq-6", question: "How are investment decisions made?", answer: "All investment proposals are evaluated by the Financial Council and presented at the quarterly general meeting. Members vote on major investment decisions, and outcomes are formally recorded in the board minutes for full transparency." },
  { id: "faq-7", question: "What is the Death Benefit Grant?", answer: "In the unfortunate event of a member's passing, Friends Goal provides an immediate benevolent support grant to the designated beneficiary. The full accumulated savings balance is also transferred to the legally registered nominee." },
  { id: "faq-8", question: "How do I update my personal information?", answer: "Members can submit a personal information update request via the member portal. Changes require verification by the Secretary and are processed within 7 business days." },
];

const FAQ_ITEMS_BN: FAQItem[] = [
  { id: "faq-1", question: "আমি কিভাবে সদস্য হতে পারি?", answer: "ফ্রেন্ডস গোলে যোগ দিতে, আপনাকে একজন বিদ্যমান সদস্য দ্বারা রেফার করতে হবে। রেফার হওয়ার পর, আপনি আমাদের পোর্টালের মাধ্যমে আবেদন করতে পারবেন এবং একবারের জন্য ২০০ টাকা নিবন্ধন ফি প্রদান করতে পারবেন।" },
  { id: "faq-2", question: "মাসিক কিস্তি মিস হলে কী হবে?", answer: "আপনি মাসিক কিস্তি মিস করলে, কাউন্সিল প্রথম ৫ কার্যদিবসের মধ্যে আপনাকে জানাবে। পেমেন্ট পূরণ করতে আপনার ১৫ দিনের গ্রেস পিরিয়ড রয়েছে।" },
  { id: "faq-3", question: "সঞ্চয় প্রকল্পটি কি শরিয়াহ-সম্মত?", answer: "হ্যাঁ। ফ্রেন্ডস গোল সঞ্চয় উদ্যোগটি ইসলামী অর্থায়নের নীতি অনুসরণ করে ১০০% সুদমুক্ত মডেলে পরিচালিত হয়।" },
  { id: "faq-4", question: "বার্ষিক ফি কীভাবে ব্যবহার করা হয়?", answer: "বার্ষিক ফি প্রশাসনিক সহায়তা, ডিজিটাল অবকাঠামো, আইনি সম্মতি এবং জরুরি তহবিল রিজার্ভ সহ পরিচালনামূলক খরচ বহন করে।" },
  { id: "faq-5", question: "বিনিয়োগের মেয়াদ শেষ হওয়ার আগে কি আমি সঞ্চয় তুলে নিতে পারি?", answer: "চিকিৎসা জরুরি অবস্থা বা আনুষ্ঠানিকভাবে জমা দেওয়া পদত্যাগের মতো নির্দিষ্ট পরিস্থিতিতে আগাম প্রত্যাহার অনুমোদিত।" },
  { id: "faq-6", question: "বিনিয়োগ সিদ্ধান্ত কিভাবে নেওয়া হয়?", answer: "সমস্ত বিনিয়োগ প্রস্তাব আর্থিক কাউন্সিল দ্বারা মূল্যায়ন করা হয় এবং ত্রৈমাসিক সাধারণ সভায় উপস্থাপন করা হয়।" },
  { id: "faq-7", question: "মৃত্যু সুবিধা অনুদান কী?", answer: "কোনো সদস্যের মৃত্যুর অনাকাঙ্ক্ষিত ঘটনায়, ফ্রেন্ডস গোল মনোনীত সুবিধাভোগীকে অবিলম্বে দাতব্য সহায়তা অনুদান প্রদান করে।" },
  { id: "faq-8", question: "আমি কিভাবে আমার ব্যক্তিগত তথ্য আপডেট করব?", answer: "সদস্যরা সদস্য পোর্টালের মাধ্যমে ব্যক্তিগত তথ্য আপডেটের অনুরোধ জমা দিতে পারবেন। পরিবর্তনগুলোর জন্য সচিবের যাচাইকরণ প্রয়োজন এবং ৭ কার্যদিবসের মধ্যে প্রক্রিয়া করা হয়।" },
];

export function FAQPageClient() {
  const { t, lang } = useTranslation();
  const faqItems = lang === "bn" ? FAQ_ITEMS_BN : FAQ_ITEMS_EN;
  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("faq_page_crumb") },
        ]}
        titleLine1={t("faq_page_title")}
        description={t("faq_page_desc")}
      />
      <section className="w-full py-12 sm:py-20 bg-white" aria-label="FAQ Accordion">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8">
          <FAQAccordion items={faqItems} />
        </div>
      </section>
    </div>
  );
}
