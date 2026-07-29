"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserX,
  Gavel,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

interface PolicySectionItem {
  num: string;    // Bangla digits  e.g. "৯.১"
  numEn: string;  // English digits e.g. "9.1"
  title: string;
  titleBn?: string;
  text: string;
  textBn?: string;
}

interface PolicyCategory {
  id: string;
  label: string;
  labelBn: string;
  icon: React.ReactNode;
  headerTitle: string;
  headerTitleBn: string;
  sections: PolicySectionItem[];
  moreSections?: PolicySectionItem[];
}

const POLICY_DATA: PolicyCategory[] = [
  {
    id: "board",
    label: "Board of Directors Policy",
    labelBn: "পরিচালনা পর্ষদ নীতিমালা",
    icon: <Users className="w-4 h-4" />,
    headerTitle: "Board of Directors Policy",
    headerTitleBn: "পরিচালনা পর্ষদ নীতিমালা",
    sections: [
      {
        num: "৯.১",
        numEn: "9.1",
        title: "Election in accordance with the organization's constitution:",
        titleBn: "সংগঠনের সংবিধান অনুযায়ী নির্বাচন:",
        text: "The method for constituting the governing body is stipulated in the constitution. This can be through direct voting, nomination, or a selection committee.",
        textBn: "পরিচালনা পর্ষদ গঠনের পদ্ধতি সংবিধানে উল্লেখ রয়েছে। এটি প্রত্যক্ষ ভোট, মনোনয়ন বা নির্বাচন কমিটির মাধ্যমে হতে পারে।",
      },
      {
        num: "৯.২",
        numEn: "9.2",
        title: "Number of Members:",
        titleBn: "সদস্য সংখ্যা:",
        text: "The number of members of the council is generally stipulated in the constitution. For example, it could range from 1 to 100, or be 101, 103, 105, 107, 109, or 111.",
        textBn: "কাউন্সিলের সদস্য সংখ্যা সাধারণত সংবিধানে নির্ধারণ করা হয়। যেমন ১ থেকে ১০০, বা ১০১, ১০৩, ১০৫, ১০৭, ১০৯ বা ১১১ জন হতে পারে।",
      },
      {
        num: "৯.৩",
        numEn: "9.3",
        title: "Eligibility:",
        titleBn: "যোগ্যতা:",
        text: "Membership eligibility is determined in accordance with the constitution or the organization's rules—for example, age, experience, shareholder status (if applicable), etc.",
        textBn: "সদস্যপদ লাভের যোগ্যতা সংবিধান বা সংগঠনের নিয়ম অনুযায়ী নির্ধারিত হয়—যেমন বয়স, অভিজ্ঞতা, শেয়ারহোল্ডার স্ট্যাটাস ইত্যাদি।",
      },
    ],
    moreSections: [
      {
        num: "৯.৪",
        numEn: "9.4",
        title: "Term of Office:",
        titleBn: "কার্যকাল:",
        text: "Board members serve a 3-year term, renewable once upon democratic vote by council members.",
        textBn: "পর্ষদের সদস্যরা ৩ বছরের মেয়াদে দায়িত্ব পালন করেন, যা সদস্যদের গণতান্ত্রিক ভোটের মাধ্যমে একবার নবায়নযোগ্য।",
      },
      {
        num: "৯.৫",
        numEn: "9.5",
        title: "Meeting Frequency:",
        titleBn: "সভার সময়সূচী:",
        text: "The Board shall convene at least once every quarter to review financial reports and strategic investments.",
        textBn: "আর্থিক প্রতিবেদন এবং কৌশলগত বিনিয়োগ পর্যালোচনা করতে পর্ষদ প্রতি ত্রৈমাসিকে অন্তত একবার সভা আহ্বান করবে।",
      },
    ],
  },
  {
    id: "cancellation",
    label: "Membership Cancellation Policy",
    labelBn: "সদস্যপদ বাতিল নীতিমালা",
    icon: <UserX className="w-4 h-4" />,
    headerTitle: "Membership Cancellation Policy",
    headerTitleBn: "সদস্যপদ বাতিল নীতিমালা",
    sections: [
      {
        num: "১০.১",
        numEn: "10.1",
        title: "Voluntary Withdrawal:",
        titleBn: "স্বেচ্ছায় প্রত্যাহার:",
        text: "Any member may withdraw from the organization by submitting a written notice 30 days prior to withdrawal.",
        textBn: "যেকোনো সদস্য প্রত্যাহারের ৩০ দিন আগে লিখিত নোটিশ জমা দিয়ে সংগঠন থেকে প্রত্যাহার করতে পারেন।",
      },
      {
        num: "১০.২",
        numEn: "10.2",
        title: "Fund Refund Terms:",
        titleBn: "তহবিল ফেরতের শর্তাবলী:",
        text: "Accumulated monthly savings will be refunded in full without interest deductions within 60 business days of cancellation approval.",
        textBn: "সঞ্চিত মাসিক সঞ্চয় কোনো সুদ বা অন্যায্য কর্তন ছাড়াই ৬০ কার্যদিবসের মধ্যে পূর্ণ ফেরত দেওয়া হবে।",
      },
      {
        num: "১০.৩",
        numEn: "10.3",
        title: "Non-Compliance Review:",
        titleBn: "নিয়ম লঙ্ঘনের পর্যালোচনা:",
        text: "Failure to contribute monthly savings for 3 consecutive months without prior notice will trigger automatic council review.",
        textBn: "পূর্ববর্তী নোটিশ ছাড়া টানা ৩ মাস সঞ্চয় প্রদান করতে ব্যর্থ হলে স্বয়ংকীয়ভাবে কাউন্সিল পর্যালোচনা শুরু হবে।",
      },
    ],
  },
  {
    id: "offense",
    label: "Offense & Conduct Policy",
    labelBn: "অপরাধ ও আচরণ নীতিমালা",
    icon: <Gavel className="w-4 h-4" />,
    headerTitle: "Offense & Conduct Policy",
    headerTitleBn: "অপরাধ ও আচরণ নীতিমালা",
    sections: [
      {
        num: "১১.১",
        numEn: "11.1",
        title: "Code of Ethics:",
        titleBn: "নৈতিকতা আচরণবিধি:",
        text: "All members must adhere to principles of honesty, mutual respect, and strict non-interest financial operations.",
        textBn: "সকল সদস্যকে সততা, পারস্পরিক শ্রদ্ধা এবং কঠোর সুদমুক্ত আর্থিক কার্যক্রমের নীতি মেনে চলতে হবে।",
      },
      {
        num: "১১.২",
        numEn: "11.2",
        title: "Disciplinary Process:",
        titleBn: "শৃঙ্খলামূলক প্রক্রিয়া:",
        text: "Violations of organizational rules will be referred to the Executive Council for formal inquiry and resolution.",
        textBn: "সাংগঠনিক নিয়মের যেকোনো লঙ্ঘন আনুষ্ঠানিক তদন্তের জন্য নির্বাহী কাউন্সিলে পাঠানো হবে।",
      },
    ],
  },
  {
    id: "benefit",
    label: "Death Benefit Grant Policy",
    labelBn: "মৃত্যু সুবিধা অনুদান নীতিমালা",
    icon: <HeartHandshake className="w-4 h-4" />,
    headerTitle: "Death Benefit Grant Policy",
    headerTitleBn: "মৃত্যু সুবিধা অনুদান নীতিমালা",
    sections: [
      {
        num: "১২.১",
        numEn: "12.1",
        title: "Emergency Bereavement Support:",
        titleBn: "জরুরি শোক সহায়তা:",
        text: "In the event of a member's passing, the organization grants an immediate benevolent support fund to the designated family beneficiary.",
        textBn: "কোনো সদস্যের প্রয়াণে, সংগঠনটি মনোনীত পারিবারিক সুবিধাভোগীকে অবিলম্বে আর্থিক সহায়তা প্রদান করে।",
      },
      {
        num: "১২.২",
        numEn: "12.2",
        title: "Savings Transfer:",
        titleBn: "সঞ্চয় হস্তান্তর:",
        text: "The deceased member's total accumulated savings balance will be transferred to their legally registered nominee.",
        textBn: "প্রয়াত সদস্যের মোট সঞ্চিত সঞ্চয় ব্যালেন্স তাদের আইনগতভাবে নিবন্ধিত নমিনির কাছে হস্তান্তর করা হবে।",
      },
    ],
  },
];

export function PolicyViewerSection() {
  const { lang, t } = useTranslation();
  const isBn = lang === "bn";
  const [activeTab, setActiveTab] = useState<string>("board");
  const [expanded, setExpanded] = useState<boolean>(false);

  const currentCategory =
    POLICY_DATA.find((c) => c.id === activeTab) || POLICY_DATA[0];

  const headerTitle = isBn ? currentCategory.headerTitleBn : currentCategory.headerTitle;
  const navText = isBn ? "ন্যাভিগেশন" : "NAVIGATION";
  const quoteText = isBn
    ? "“স্বচ্ছতার জন্য সমস্ত সিদ্ধান্ত পর্ষদের কার্যা বিবরণীতে আনুষ্ঠানিক প্রস্তাব হিসেবে নথিবদ্ধ করা হয়।”"
    : "“Decisions are recorded as formal resolutions in the board minutes for transparency.”";

  return (
    <section className="w-full py-16 sm:py-24 bg-white" aria-label="Policies Viewer">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── LEFT COLUMN: Navigation Tabs & Quote Box (4 Cols) ────────── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#666666] uppercase block">
                {navText}
              </span>

              {/* Tab Buttons List */}
              <div className="flex flex-col gap-2">
                {POLICY_DATA.map((cat) => {
                  const isActive = activeTab === cat.id;
                  const catLabel = isBn ? cat.labelBn : cat.label;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(cat.id);
                        setExpanded(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3.5 rounded-full text-[14px] font-semibold
                        transition-all duration-200 cursor-pointer text-left
                        ${
                          isActive
                            ? "bg-[#1FDE64] text-white shadow-md"
                            : "bg-transparent text-[#555555] hover:bg-[#FAFAFA] hover:text-[#1A1A1A]"
                        }
                      `}
                    >
                      <span className={isActive ? "text-white" : "text-[#2B5A27]"}>
                        {cat.icon}
                      </span>
                      <span>{catLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quote Callout Box */}
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-[24px] p-6 text-center mt-4">
              <p className="font-serif italic font-bold text-[15px] sm:text-[16px] text-[#2B5A27] leading-relaxed">
                {quoteText}
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Active Policy Content Card (8 Cols) ────────── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1FDE64] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                {currentCategory.icon}
              </div>
              <h2 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#2B5A27]">
                {headerTitle}
              </h2>
            </div>

            {/* Main Policy Card Container */}
            <div className="bg-white rounded-[28px] border border-[#E5E5E5] p-6 sm:p-8 shadow-xs space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCategory.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Initial Sections */}
                  {currentCategory.sections.map((sec) => {
                    const secNum = isBn ? sec.num : sec.numEn;
                    const secTitle = isBn && sec.titleBn ? sec.titleBn : sec.title;
                    const secText = isBn && sec.textBn ? sec.textBn : sec.text;
                    return (
                      <div key={sec.num} className="space-y-2">
                        <h3 className="font-bold text-[16px] sm:text-[17px] text-[#1A1A1A] leading-snug">
                          {secNum}. {secTitle}
                        </h3>
                        <div className="flex items-start gap-2.5 pl-1">
                          <span className="w-2 h-2 rounded-full bg-[#1FDE64] flex-shrink-0 mt-2" />
                          <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
                            {secText}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Expanded Sections — animated independently, outside the tab-switch AnimatePresence */}
                  {currentCategory.moreSections && (
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          key="more-sections"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6 pt-2 border-t border-[#E5E5E5] overflow-hidden"
                        >
                          {currentCategory.moreSections.map((sec) => {
                            const secNum = isBn ? sec.num : sec.numEn;
                            const secTitle = isBn && sec.titleBn ? sec.titleBn : sec.title;
                            const secText = isBn && sec.textBn ? sec.textBn : sec.text;
                            return (
                              <div key={sec.num} className="space-y-2">
                                <h3 className="font-bold text-[16px] sm:text-[17px] text-[#1A1A1A] leading-snug">
                                  {secNum}. {secTitle}
                                </h3>
                                <div className="flex items-start gap-2.5 pl-1">
                                  <span className="w-2 h-2 rounded-full bg-[#1FDE64] flex-shrink-0 mt-2" />
                                  <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
                                    {secText}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Load More / Show Less Button */}
              {currentCategory.moreSections && (
                <div className="pt-4 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="
                      inline-flex items-center justify-center gap-2
                      h-[42px] px-7 rounded-full
                      bg-white border border-[#E5E5E5] text-[#1A1A1A]
                      text-[13px] font-bold tracking-wider uppercase
                      hover:bg-[#FAFAFA] transition-colors duration-200
                      cursor-pointer shadow-xs
                    "
                  >
                    <span>{expanded ? t("load_less") : t("load_more")}</span>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4 text-[#1A1A1A]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#1A1A1A]" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
