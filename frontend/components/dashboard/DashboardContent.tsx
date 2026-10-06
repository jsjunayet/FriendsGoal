"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { fetchMemberProfitBalanceApi } from "@/lib/disbursementApi";
import { RequestWithdrawalModal } from "./RequestWithdrawalModal";
import { PaymentHistoryModal } from "./PaymentHistoryModal";
import { useMemberDashboard } from "@/lib/hooks/useMemberDashboard";

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
  console.log("summary", summary);
  console.log("profitBalance", profitBalance);
  console.log("refetchSummary", refetchSummary);
  console.log("isLoading", isLoading);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);

  const totalDepositVal = summary?.totalDeposit ?? 0;
  const dueAmountVal = summary?.dueAmount ?? 0;
  const myProfitVal = profitBalance ?? summary?.profitBalance ?? 0;
  const memberName = summary?.fullName || "Member";
  const memberCode = summary?.memberCode || "N/A";
  const memberId = summary?.memberId || "N/A";

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
                { icon: <MapPin className="w-3.5 h-3.5" />, text: [summary?.thana, summary?.district].filter(Boolean).join(", ") || "Rajapur, Patuakhali" },
                { icon: <Cake className="w-3.5 h-3.5" />, text: summary?.dateOfBirth || "01 Dec 1993" },
                { icon: <Droplet className="w-3.5 h-3.5" />, text: summary?.bloodGroup ? (summary.bloodGroup.includes("(") ? summary.bloodGroup : `${summary.bloodGroup} (Positive)`) : "O+ (Positive)" },
                { icon: <IdCard className="w-3.5 h-3.5" />, text: memberCode ? (memberCode.startsWith("ID-") ? memberCode : `ID-${memberCode}`) : "ID-002" },
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
      />

      {/* Divider */}
      <div className="border-t border-[#E5E5E5]" />

      {/* Upcoming Schedule Table */}
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-[#2B5A27]" />
          <h4 className="font-bold text-[14px] text-[#1A1A1A] uppercase tracking-[0.12em]">
            Upcoming Schedule
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                {["Description", "Due Date", "Amount", "Status"].map((col) => (
                  <th
                    key={col}
                    className="pb-3 pr-6 text-[11px] font-bold tracking-[0.14em] text-[#888888] uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#888888] text-[13px]">
                    No recent or upcoming schedule found.
                  </td>
                </tr>
              ) : (
                scheduleList.map((row: any, idx: number) => {
                  const isPaid = row.status === "Paid";
                  const isDue = row.status === "Due";
                  const statusColor = isPaid
                    ? "text-[#00B074] bg-[#EAF8F1] border-[#00B074]/30"
                    : isDue
                      ? "text-[#F59E0B] bg-[#FFFBEB] border-[#FDE68A]"
                      : "text-[#3B82F6] bg-[#EFF6FF] border-[#BFDBFE]";

                  return (
                    <tr
                      key={row.receiptNo || idx}
                      className="border-b border-[#F9F9F9] hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="py-4 pr-6 font-medium text-[#1A1A1A]">
                        {row.month || "Monthly Collection"}
                      </td>
                      <td className="py-4 pr-6 text-[#555555]">
                        {row.paymentDate || "15th of month"}
                      </td>
                      <td className="py-4 pr-6 font-semibold text-[#1A1A1A]">
                        ৳{(Number(row?.amount) || 0).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center h-[26px] px-3 rounded-full text-[11px] font-bold border ${statusColor}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Friends Goal Overview Section ───────────────────────────────────────────
function OverviewSection() {
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
                $3,436,736
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
                $88,860
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
              $504,546
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
                Outstanding Growth
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
              <span className="font-serif text-[20px] font-bold text-[#1A1A1A]">$2,972,000</span>
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
              <span className="font-serif text-[20px] font-bold text-[#1A1A1A]">$500,000</span>
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
              <span className="font-serif text-[20px] font-bold text-[#1A1A1A]">$49,050</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardContent() {
  const { summary, isError, isLoading } = useMemberDashboard();

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1FDE64]"></div>
      </div>
    );
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

      {/* Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <OverviewSection />
      </motion.div>
    </div>
  );
}
