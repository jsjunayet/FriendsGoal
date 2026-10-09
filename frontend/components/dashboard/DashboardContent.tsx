"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Cake,
  Droplets,
  Droplet,
  IdCard,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Receipt,
  Banknote,
  History,
  ArrowUpRight,
  Wallet,
  UserPlus,
  Hourglass,
  HandHeart,
  ChevronRight,
  ChevronLeft,
  CircleDollarSign,
  Mail,
  Bell,
  FileSpreadsheet,
  Globe,
  X,
  Check,
  Copy,
  Eye,
  ExternalLink,
} from "lucide-react";
import { fetchMemberProfitBalanceApi } from "@/lib/disbursementApi";
import { RequestWithdrawalModal } from "./RequestWithdrawalModal";
import { PaymentHistoryModal } from "./PaymentHistoryModal";
import { useMemberDashboard } from "@/lib/hooks/useMemberDashboard";
import { printMemberProfilePdf } from "@/lib/memberProfilePdfGenerator";
import { MemberDashboardSkeleton } from "@/components/ui/Skeletons";
import { fetchAnalyticsOverview, IAnalyticsOverview } from "@/lib/analyticsApi";
import { fetchNoticeSchedulesApi, INoticeScheduleItem } from "@/lib/noticeScheduleApi";
import { fetchGoogleFormsApi, IGoogleFormItem, cleanGoogleFormEmbedUrl } from "@/lib/googleFormApi";

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function StatBar({
  label,
  value,
  color,
  pct,
}: {
  label: string;
  value: string;
  color: "green" | "red" | "blue";
  pct: number;
}) {
  const track =
    color === "green"
      ? "bg-[#1FDE64]"
      : color === "red"
        ? "bg-[#FF4545]"
        : "bg-[#3B82F6]";
  const trackBg =
    color === "green"
      ? "bg-[#E8FFF2]"
      : color === "red"
        ? "bg-[#FFF0F0]"
        : "bg-[#EFF6FF]";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold tracking-[0.16em] text-[#888888] uppercase">
        {label}
      </span>
      <span
        className={`text-[28px] font-bold tracking-tight ${color === "red" ? "text-[#FF4545]" : "text-[#1A1A1A]"
          }`}
      >
        {value}
      </span>
      <div className={`w-full h-1.5 rounded-full ${trackBg}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full ${track}`}
        />
      </div>
    </div>
  );
}

// ─── Overview Stat Card ───────────────────────────────────────────────────────
function OverviewCard({
  label,
  value,
  sub,
  variant,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  variant: "dark" | "green" | "light";
  icon?: React.ReactNode;
}) {
  if (variant === "dark") {
    return (
      <div className="relative bg-[#1A1A1A] rounded-[24px] p-7 overflow-hidden flex flex-col gap-2">
        {/* faint watermark icon */}
        {icon && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.06] text-white scale-[3.5]">
            {icon}
          </div>
        )}
        <span className="text-[12px] font-bold tracking-[0.16em] text-white/50 uppercase">
          {label}
        </span>
        <span className="text-[38px] sm:text-[44px] font-bold text-white tracking-tight leading-none">
          {value}
        </span>
        {sub && <span className="text-[13px] text-white/50 mt-1">{sub}</span>}
      </div>
    );
  }

  if (variant === "green") {
    return (
      <div className="bg-[#2B5A27] rounded-[24px] p-7 flex flex-col gap-2">
        <span className="text-[12px] font-bold tracking-[0.16em] text-white/60 uppercase">
          {label}
        </span>
        <span className="text-[38px] sm:text-[44px] font-bold text-white tracking-tight leading-none">
          {value}
        </span>
        {sub && (
          <span className="text-[13px] text-white/70 leading-snug mt-1">
            {sub}
          </span>
        )}
      </div>
    );
  }

  // light
  return (
    <div className="bg-[#F6FFED] border border-[#D4F5D2] rounded-[20px] p-5 flex flex-col gap-1">
      <span className="text-[11px] font-bold tracking-[0.16em] text-[#2B5A27] uppercase">
        {label}
      </span>
      <span className="text-[22px] font-bold text-[#1A1A1A]">{value}</span>
      {sub && <span className="text-[12px] text-[#555555]">{sub}</span>}
    </div>
  );
}

// ─── Main Personal Financial Status Card ─────────────────────────────────────
function PersonalFinancialCard() {
  const { summary, profitBalance, refetchSummary, isLoading } = useMemberDashboard();
  const router = useRouter();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
  const [schedulePage, setSchedulePage] = useState(1);
  const SCHEDULE_PER_PAGE = 5;

  const totalDepositVal = summary?.totalDeposit ?? 0;
  const dueAmountVal = summary?.dueAmount ?? 0;
  const myProfitVal = profitBalance ?? summary?.profitBalance ?? 0;
  const memberName = summary?.fullName || "Member";
  const memberCode = summary?.memberCode || "N/A";
  const memberId = summary?.memberId || "N/A";

  const { data: notices = [], isLoading: isNoticesLoading } = useQuery<INoticeScheduleItem[]>({
    queryKey: ["notice-schedules", "member-feed", memberId],
    queryFn: () => fetchNoticeSchedulesApi({ memberId: memberId !== "N/A" ? memberId : undefined }),
    staleTime: 60000,
  });

  const totalSchedulePages = Math.ceil(notices.length / SCHEDULE_PER_PAGE) || 1;
  const paginatedNotices = notices.slice(
    (schedulePage - 1) * SCHEDULE_PER_PAGE,
    schedulePage * SCHEDULE_PER_PAGE
  );

  const formatScheduleDate = (dateStr?: string) => {
    if (!dateStr) return "TBD";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const scheduleList = Array.isArray(summary?.activePaymentSchedule)
    ? summary.activePaymentSchedule
    : [];

  return (
    <div className="bg-white rounded-[28px] border border-[#E5E5E5] shadow-xs overflow-hidden">
      {/* Top: member info + stats */}
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-0">

        {/* Left: profile card — same design as DirectoryMemberCard */}
        <div className="p-3 border-b sm:border-b-0 sm:border-r border-[#F0F0F0] flex flex-col gap-0 bg-white">
          {/* Portrait image with gap on all sides */}
          <div className="relative w-full aspect-[4/5] rounded-[14px] overflow-hidden bg-[#F0F0F0]">
            <Image
              src={summary?.pictureUrl || "/images/about/about-1.png"}
              alt={memberName}
              fill
              className="object-cover object-top rounded-[14px]"
            />
          </div>

          {/* Identity info below image */}
          <div className="pt-3 pb-1 px-1 flex flex-col gap-2">
            <div>
              <span className="text-[10px] font-bold tracking-[0.16em] text-[#4B5563] uppercase block">
                {summary?.role === "admin" || summary?.role === "superAdmin" ? "ADMIN" : "MEMBER"}
              </span>
              <h2 className="font-serif font-bold text-[#1A1A1A] text-[15px] uppercase leading-tight tracking-[0.01em] mt-0.5">
                {memberName}
              </h2>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#F0F0F0]" />

            {/* 2×2 details */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-2 pb-1 text-[11.5px] font-medium text-[#374151]">
              {[
                { icon: <MapPin className="w-3.5 h-3.5" />, text: [summary?.thana, summary?.district].filter(Boolean).join(", ") || "N/A" },
                { icon: <Cake className="w-3.5 h-3.5" />, text: summary?.dateOfBirth || "N/A" },
                { icon: <Droplet className="w-3.5 h-3.5" />, text: summary?.bloodGroup ? (summary.bloodGroup.includes("(") ? summary.bloodGroup : `${summary.bloodGroup} (Positive)`) : "N/A" },
                { icon: <IdCard className="w-3.5 h-3.5" />, text: memberCode && memberCode !== "N/A" ? (memberCode.startsWith("ID-") ? memberCode : `ID-${memberCode}`) : (memberId && memberId !== "N/A" ? memberId : "N/A") },
              ].map(({ icon, text }, idx) => (
                <div key={idx} className="flex items-center gap-1.5 min-w-0" title={text}>
                  <span className="text-[#00B074] flex-shrink-0">{icon}</span>
                  <span className="truncate">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: financial stats */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#1A1A1A]">
                Personal Financial Status
              </h3>
              <p className="text-[13px] text-[#888888] mt-0.5">
                Detailed breakdown of your individual contributions.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (summary) {
                    printMemberProfilePdf({
                      ...summary,
                      profitBalance: myProfitVal
                    });
                  }
                }}
                className="inline-flex items-center gap-2 h-[36px] px-4 rounded-full bg-[#2B3B26] text-white text-[12px] font-bold tracking-wide whitespace-nowrap hover:bg-[#1f2b1c] transition-colors cursor-pointer flex-shrink-0"
              >
                <IdCard className="w-3.5 h-3.5" />
                Download Profile
              </button>
              <button
                type="button"
                onClick={() => setIsPaymentHistoryModalOpen(true)}
                className="inline-flex items-center gap-2 h-[36px] px-4 rounded-full bg-[#1FDE64] text-white text-[12px] font-bold tracking-wide whitespace-nowrap hover:bg-[#18c957] transition-colors cursor-pointer flex-shrink-0"
              >
                <History className="w-3.5 h-3.5" />
                Payment History
              </button>
            </div>
          </div>

          {/* Top row: Deposit and Due Amount (2 col) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-[#F6F7F6] rounded-[16px] p-6 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#555555] uppercase mb-1">
                TOTAL DEPOSIT
              </span>
              <div className="text-[32px] font-serif text-[#2B5A27] leading-none mb-3">
                {(Number(totalDepositVal) || 0).toLocaleString("en-US")}
              </div>
              <div className="w-6 h-[3px] bg-[#87A83C] rounded-full" />
            </div>

            <div className="bg-[#F6F7F6] rounded-[16px] p-6 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#555555] uppercase mb-1">
                {Number(dueAmountVal) < 0 ? "ADVANCE PAYMENT" : "DUE AMOUNT"}
              </span>
              <div className={`text-[32px] font-serif leading-none mb-3 ${
                Number(dueAmountVal) < 0 ? "text-[#2B5A27]" : Number(dueAmountVal) > 0 ? "text-[#D62828]" : "text-[#1A1A1A]"
              }`}>
                {Number(dueAmountVal) < 0 ? "Advance ৳" + Math.abs(Number(dueAmountVal)).toLocaleString("en-US") : "৳" + (Number(dueAmountVal) || 0).toLocaleString("en-US")}
              </div>
              <div className={`w-6 h-[3px] rounded-full ${
                Number(dueAmountVal) < 0 ? "bg-[#87A83C]" : Number(dueAmountVal) > 0 ? "bg-[#D62828]" : "bg-[#888888]"
              }`} />
            </div>
          </div>

          {/* Middle row: My Profit (1 col) */}
          <div className="bg-[#F6F7F6] rounded-[16px] p-8 flex flex-col items-center justify-center text-center mt-2">
            <span className="text-[10px] font-bold tracking-[0.18em] text-[#555555] uppercase mb-1">
              MY PROFIT
            </span>
            <div className="text-[40px] font-serif text-[#1A1A1A] leading-none mb-4">
              {(Number(myProfitVal) || 0).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="w-8 h-[3px] bg-[#1FDE64] rounded-full" />
          </div>

          {/* Bottom row: Request Withdrawal Full-width button */}
          <button
            type="button"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 h-[48px] rounded-[12px] bg-[#2B3B26] text-white text-[13px] font-bold tracking-wide hover:bg-[#1f2b1c] transition-colors cursor-pointer mt-1"
          >
            <ArrowUpRight className="w-4 h-4 text-[#1FDE64]" />
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      <RequestWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableProfit={myProfitVal}
        memberId={memberId}
        onWithdrawalSuccess={() => refetchSummary()}
      />

      <PaymentHistoryModal
        isOpen={isPaymentHistoryModalOpen}
        onClose={() => setIsPaymentHistoryModalOpen(false)}
        memberId={memberId}
        defaultSchedule={scheduleList}
      />

      {/* Divider */}
      <div className="border-t border-[#E5E5E5]" />

      {/* Upcoming Schedule Feed (Screenshot 1 & 7) */}
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-6 h-6 rounded-md bg-[#2B5A27]/10 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-[#2B5A27]" />
          </div>
          <h4 className="font-bold text-[12.5px] sm:text-[13px] text-[#1A1A1A] uppercase tracking-[0.14em]">
            Upcoming Schedule
          </h4>
        </div>

        {isNoticesLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-50/80 animate-pulse rounded-2xl border border-gray-100" />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="py-8 text-center text-[#888888] text-[13px] bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            No upcoming notices or scheduled events at this time.
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#F0F0F0]">
              {paginatedNotices.map((notice) => {
                const isFeeReminder = notice.type === "Fee Reminder";
                const isMeeting = notice.type === "Meeting";
                const isInvitation = notice.type === "Invitation";

                return (
                  <div
                    key={notice._id}
                    onClick={() => router.push(`/dashboard/notice-schedule/${notice._id}`)}
                    className="py-4 hover:bg-[#F9FAFB] transition-all cursor-pointer rounded-2xl px-3 -mx-3 flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                  >
                    {/* Left: Icon + Title & Type badge */}
                    <div className="flex items-center gap-3.5 min-w-0 md:w-[40%]">
                      {isFeeReminder ? (
                        <div className="w-11 h-11 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 border border-[#FDE68A]/60 shadow-xs">
                          <CircleDollarSign className="w-5 h-5" />
                        </div>
                      ) : isMeeting ? (
                        <div className="w-11 h-11 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE]/60 shadow-xs">
                          <Calendar className="w-5 h-5" />
                        </div>
                      ) : isInvitation ? (
                        <div className="w-11 h-11 rounded-full bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0 border border-[#E9D5FF]/60 shadow-xs">
                          <Mail className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#FFE4E6] text-[#BE123C] flex items-center justify-center shrink-0 border border-[#FECDD3]/60 shadow-xs">
                          <Bell className="w-5 h-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h5 className="font-serif font-bold text-[15px] sm:text-[16px] text-[#1A1A1A] leading-snug group-hover:text-[#2B5A27] transition-colors truncate">
                          {notice.title}
                        </h5>
                        {isFeeReminder ? (
                          <span className="inline-block mt-1 text-[10px] font-semibold text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDE68A]/70">
                            Fee Reminder
                          </span>
                        ) : isMeeting ? (
                          <span className="inline-block mt-1 text-[10px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]/70">
                            Meeting
                          </span>
                        ) : isInvitation ? (
                          <span className="inline-block mt-1 text-[10px] font-semibold text-[#7E22CE] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full border border-[#E9D5FF]/70">
                            Invitation
                          </span>
                        ) : (
                          <span className="inline-block mt-1 text-[10px] font-semibold text-[#BE123C] bg-[#FFE4E6] px-2.5 py-0.5 rounded-full border border-[#FECDD3]/70">
                            Important Notice
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Date & Time */}
                    <div className="pl-14 md:pl-0 md:text-center md:w-[22%]">
                      <div className="text-[13px] font-medium text-[#1A1A1A]">
                        {formatScheduleDate(notice.eventDate || notice.dueDate || notice.createdAt)}
                      </div>
                      {notice.time && (
                        <div className="text-[11px] text-[#888888] font-medium mt-0.5">
                          {notice.time}
                        </div>
                      )}
                    </div>

                    {/* Right: Amount or Location/Agenda */}
                    <div className="pl-14 md:pl-0 md:text-right md:w-[22%]">
                      {isFeeReminder ? (
                        <div className="font-bold text-[15px] text-[#1A1A1A] font-serif">
                          {notice.feeCurrency === "USD" ? "$" : "৳"}
                          {Number(notice.feeAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                      ) : (
                        <div className="text-[12px] text-[#666666] truncate">
                          {notice.location || notice.agenda || "Friends Goal Community"}
                        </div>
                      )}
                    </div>

                    {/* Far Right: Status/Read button + Chevron */}
                    <div className="pl-14 md:pl-0 flex items-center justify-between md:justify-end gap-3 md:w-[16%]">
                      {isFeeReminder ? (
                        <span className="inline-flex items-center text-[11px] font-semibold text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-3 py-1 rounded-full whitespace-nowrap shadow-2xs">
                          {notice.paymentStatus || "Payment due"}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/notice-schedule/${notice._id}`);
                          }}
                          className="inline-flex items-center text-[11px] font-semibold text-[#374151] bg-white border border-[#E5E7EB] hover:bg-gray-100 hover:border-gray-300 px-3.5 py-1 rounded-full whitespace-nowrap shadow-2xs transition-colors cursor-pointer"
                        >
                          Read
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls (5 items per page) */}
            {totalSchedulePages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-3 border-t border-[#F0F0F0]">
                <span className="text-[12px] text-gray-500 font-medium">
                  Showing {(schedulePage - 1) * SCHEDULE_PER_PAGE + 1}–{Math.min(schedulePage * SCHEDULE_PER_PAGE, notices.length)} of {notices.length} schedules
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSchedulePage((p) => Math.max(1, p - 1))}
                    disabled={schedulePage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  {Array.from({ length: totalSchedulePages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setSchedulePage(pageNum)}
                      className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        schedulePage === pageNum
                          ? "bg-[#2B5A27] text-white shadow-xs"
                          : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSchedulePage((p) => Math.min(totalSchedulePages, p + 1))}
                    disabled={schedulePage === totalSchedulePages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Friends Goal Overview Section ───────────────────────────────────────────
function OverviewSection({ overview }: { overview: IAnalyticsOverview | null }) {
  const totalBalance = overview ? `৳${Number(overview.totalAmounts || 0).toLocaleString()}` : "৳0";
  const monthlyExpense = overview ? `৳${Number(overview.expenseAmounts || 0).toLocaleString()}` : "৳0";
  const totalNetProfit = overview ? `৳${Number(overview.profits || 0).toLocaleString()}` : "৳0";
  const statusLabel = overview && overview.profits >= 0 ? "Outstanding Growth" : "Active & Stable";
  const membersReceived = overview ? `৳${Number(overview.membersReceived || 0).toLocaleString()}` : "৳0";
  const membersDue = overview ? `৳${Number(overview.dueAmounts || 0).toLocaleString()}` : "৳0";
  const othersReceived = overview ? `৳${Number(overview.othersReceived || 0).toLocaleString()}` : "৳0";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-serif text-[26px] sm:text-[30px] font-bold text-[#1A1A1A]">
        Friends Goal Overview
      </h2>

      {/* Main Container Card */}
      <div className="bg-white rounded-[28px] border border-[#E5E5E5] p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
        {/* Top 2 Cards: Total Balance & Monthly Expense */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Total Balance */}
          <div className="bg-[#F8FAF6] border border-[#E8EFE5] rounded-[22px] p-7 flex items-center justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#666666] uppercase block mb-1">
                TOTAL BALANCE
              </span>
              <div className="text-[36px] sm:text-[44px] font-serif font-bold text-[#1A1A1A] leading-none">
                {totalBalance}
              </div>
            </div>
            {/* Wallet Watermark Icon Box */}
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E0E6DC] flex items-center justify-center text-gray-300 shadow-2xs shrink-0">
              <Wallet className="w-8 h-8 text-gray-300 stroke-[1.5]" />
            </div>
          </div>

          {/* Card 2: Monthly Expense (Dark Green) */}
          <div className="bg-[#23341F] rounded-[22px] p-7 text-white flex flex-col justify-between relative overflow-hidden shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#1FDE64] text-[#1A1A1A] flex items-center justify-center mb-3 shadow-2xs">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.18em] text-white/60 uppercase block mb-1">
                MONTHLY EXPENSE
              </span>
              <div className="text-[36px] sm:text-[42px] font-serif font-bold text-white leading-none mb-2">
                {monthlyExpense}
              </div>
              <p className="text-[12px] text-white/70 italic leading-snug">
                Operational costs for community growth
              </p>
            </div>
          </div>
        </div>

        {/* Middle Full-Width Card: Total Net Profit & Status */}
        <div className="bg-[#1A1A1A] rounded-[24px] p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden shadow-xs">
          <div>
            <span className="text-[10px] font-bold tracking-[0.18em] text-[#1FDE64] uppercase block mb-1.5">
              TOTAL NET PROFIT
            </span>
            <div className="text-[42px] sm:text-[52px] font-serif font-bold text-white leading-none">
              {totalNetProfit}
            </div>
          </div>

          {/* Status Box */}
          <div className="bg-[#282828] border border-white/10 rounded-[20px] px-6 py-4 flex items-center gap-4 min-w-[240px] self-stretch sm:self-auto">
            <div className="w-10 h-10 rounded-full bg-[#1FDE64]/20 text-[#1FDE64] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#1FDE64]" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#1FDE64] uppercase block mb-0.5">
                STATUS
              </span>
              <span className="text-[15px] font-bold text-white">
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom 3 Mini Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-white border border-[#E8EFE5] rounded-[20px] p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-[#1FDE64]/15 text-[#2B5A27] flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.14em] block mb-0.5">
                MEMBERS RECEIVED
              </span>
              <span className="font-serif text-[20px] font-bold text-[#1A1A1A]">{membersReceived}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8EFE5] rounded-[20px] p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-red-50 text-[#D62828] flex items-center justify-center shrink-0">
              <Hourglass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.14em] block mb-0.5">
                MEMBERS DUE
              </span>
              <span className="font-serif text-[20px] font-bold text-[#1A1A1A]">{membersDue}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8EFE5] rounded-[20px] p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
              <HandHeart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.14em] block mb-0.5">
                OTHERS RECEIVES
              </span>
              <span className="font-serif text-[20px] font-bold text-[#1A1A1A]">{othersReceived}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Google Forms Table & Direct In-Page Embed Viewer ────────────────────────
function MemberGoogleFormsSection() {
  const [selectedDirectForm, setSelectedDirectForm] = useState<IGoogleFormItem | null>(null);
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const FORMS_PER_PAGE = 5;

  const { data: forms = [], isLoading } = useQuery<IGoogleFormItem[]>({
    queryKey: ["google-forms", "member-dashboard-table"],
    queryFn: () => fetchGoogleFormsApi(),
    staleTime: 60000,
  });

  const totalPages = Math.ceil(forms.length / FORMS_PER_PAGE) || 1;
  const paginatedForms = forms.slice((page - 1) * FORMS_PER_PAGE, page * FORMS_PER_PAGE);

  const handleCopyLink = (id: string, url: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-[22px] p-6 shadow-xs flex flex-col gap-4">
        <div className="h-6 w-56 bg-gray-100 animate-pulse rounded-md" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (forms.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white border border-[#E5E5E5] rounded-[22px] overflow-hidden shadow-xs flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#F0F0F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2B5A27]/10 flex items-center justify-center text-[#2B5A27] shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#1A1A1A]">
                Google Forms & Surveys
              </h2>
              <p className="text-[12.5px] text-[#666666]">
                Official community registrations and surveys. Click to view or fill directly on this page.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            {forms.length} {forms.length === 1 ? "Form" : "Forms"}
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[11px] font-bold text-[#666666] uppercase tracking-[0.1em]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-6 min-w-[240px]">Title & Description</th>
                <th className="py-3.5 px-5 w-32">Status</th>
                <th className="py-3.5 px-6 min-w-[220px]">Google Form Link</th>
                <th className="py-3.5 px-6 w-36 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {paginatedForms.map((form, index) => {
                const serialNumber = (page - 1) * FORMS_PER_PAGE + index + 1;
                const isActive = form.status === "Active";

                return (
                  <tr
                    key={form._id}
                    className={`hover:bg-[#F9FAFB] transition-colors ${isActive ? "cursor-pointer" : ""}`}
                    onClick={() => {
                      if (isActive) setSelectedDirectForm(form);
                    }}
                  >
                    <td className="py-4 px-4 text-center text-xs font-semibold text-gray-400">
                      {serialNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-serif font-bold text-[15px] text-[#1A1A1A] hover:text-[#2B5A27] transition-colors line-clamp-1">
                          {form.title}
                        </span>
                        {form.description && (
                          <span className="text-[12px] text-[#666666] line-clamp-1 mt-0.5">
                            {form.description}
                          </span>
                        )}
                        {form.createdAt && (
                          <span className="text-[10.5px] text-[#999999] mt-1">
                            Published {new Date(form.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF8F1] text-[#00B074] border border-[#A7F3D0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00B074] animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div
                        className="flex items-center gap-2 max-w-[260px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          className="text-[12px] text-gray-500 truncate select-all font-mono"
                          title={cleanGoogleFormEmbedUrl(form.embedUrl)}
                        >
                          {cleanGoogleFormEmbedUrl(form.embedUrl)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(form._id, cleanGoogleFormEmbedUrl(form.embedUrl))}
                          className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                          title="Copy Form Link"
                        >
                          {copiedId === form._id ? (
                            <Check className="w-3.5 h-3.5 text-[#00B074]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => setSelectedDirectForm(form)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2B5A27] hover:bg-[#1f2b1c] text-white text-[12px] font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Fill Form</span>
                        </button>
                      ) : (
                        <span className="text-[12px] font-medium text-gray-400 italic">
                          Closed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination (5 per page) */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-t border-[#F0F0F0] bg-white">
            <span className="text-[12px] text-gray-500 font-medium">
              Showing {(page - 1) * FORMS_PER_PAGE + 1}–{Math.min(page * FORMS_PER_PAGE, forms.length)} of {forms.length} forms
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    page === pageNum
                      ? "bg-[#2B5A27] text-white shadow-xs"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Direct In-Page Form Embed Modal */}
      {selectedDirectForm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedDirectForm(null)}
        >
          <div
            className="bg-white w-full max-w-5xl rounded-[24px] shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between gap-4 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#2B5A27]/10 flex items-center justify-center text-[#2B5A27] shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[17px] sm:text-[19px] font-bold text-gray-900 truncate">
                      {selectedDirectForm.title}
                    </h3>
                    <span className="hidden sm:inline-block text-[10px] font-bold tracking-[0.14em] uppercase text-[#00B074] bg-[#EAF8F1] px-2 py-0.5 rounded-full border border-[#00B074]/30">
                      Direct In-Page View
                    </span>
                  </div>
                  {selectedDirectForm.description && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {selectedDirectForm.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={cleanGoogleFormEmbedUrl(selectedDirectForm.embedUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold transition-colors shadow-2xs"
                  title="Open directly in new tab if needed"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open in new tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedDirectForm(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close Form</span>
                </button>
              </div>
            </div>

            {/* Embedded Iframe Direct in Page */}
            <div className="flex-1 w-full bg-[#F8FAFC] overflow-y-auto min-h-[600px] max-h-[calc(92vh-80px)]">
              <iframe
                src={cleanGoogleFormEmbedUrl(selectedDirectForm.embedUrl)}
                width="100%"
                height="750px"
                title={selectedDirectForm.title}
                className="w-full min-h-[750px] border-0 bg-white"
              >
                Loading Google Form...
              </iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardContent() {
  const { summary, isError, isLoading } = useMemberDashboard();
  const [overview, setOverview] = useState<IAnalyticsOverview | null>(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const data = await fetchAnalyticsOverview();
        setOverview(data);
      } catch (err) {
        console.error("Failed to load analytics overview for member dashboard", err);
      }
    }
    loadOverview();
  }, []);

  if (isLoading) {
    return <MemberDashboardSkeleton />;
  }

  if (isError || !summary) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-8 py-20 flex flex-col items-center justify-center text-center gap-4">
        <h1 className="font-serif text-[28px] font-bold text-[#1A1A1A]">
          No Member Profile Found
        </h1>
        <p className="text-[#555555] max-w-md">
          We could not find a member profile associated with your login email. 
          If you believe this is a mistake, please check that you logged in with the correct email or contact administration.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="font-serif text-[#1A1A1A] text-[24px] sm:text-[30px] font-bold leading-snug">
          Welcome back, {summary?.fullName ? summary.fullName.split(" ")[0] : "Member"}. Here&rsquo;s a summary of your financial ecosystem.
        </h1>
      </motion.div>

      {/* Personal Financial Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PersonalFinancialCard />
      </motion.div>

      {/* Active Google Forms Section for Members */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <MemberGoogleFormsSection />
      </motion.div>

      {/* Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <OverviewSection overview={overview} />
      </motion.div>
    </div>
  );
}
