"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Droplets,
  IdCard,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Receipt,
  Banknote,
  History,
  ArrowUpRight,
} from "lucide-react";
import { fetchMemberProfitBalanceApi } from "@/lib/disbursementApi";
import { RequestWithdrawalModal } from "./RequestWithdrawalModal";
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
        className={`text-[28px] font-bold tracking-tight ${
          color === "red" ? "text-[#FF4545]" : "text-[#1A1A1A]"
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
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const totalDepositVal = summary?.totalDeposit ?? 30450;
  const dueAmountVal = summary?.dueAmount ?? 1000;
  const myProfitVal = profitBalance ?? summary?.profitBalance ?? 4554;
  const memberName = summary?.fullName || "MD BELAL HOSSAIN";
  const memberCode = summary?.memberCode || "002";
  const memberId = summary?.memberId || "mem-002";

  const scheduleList =
    summary?.activePaymentSchedule && summary.activePaymentSchedule.length > 0
      ? summary.activePaymentSchedule
      : [
          {
            receiptNo: "REC-2026-09",
            month: "September 2026 Monthly Due",
            amount: dueAmountVal > 0 ? dueAmountVal : 1200,
            status: dueAmountVal > 0 ? "Due" : "Paid",
            paymentDate: "15 Sept 2026",
          },
          {
            receiptNo: "REC-2026-08",
            month: "August 2026 Monthly Collection",
            amount: 1200,
            status: "Paid",
            paymentDate: "12 Aug 2026",
          },
        ];

  return (
    <div className="bg-white rounded-[28px] border border-[#E5E5E5] shadow-xs overflow-hidden">
      {/* Top: member info + stats */}
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-0">

        {/* Left: profile card — same design as DirectoryMemberCard */}
        <div className="p-3 border-b sm:border-b-0 sm:border-r border-[#F0F0F0] flex flex-col gap-0 bg-white">
          {/* Portrait image with gap on all sides */}
          <div className="relative w-full aspect-[4/5] rounded-[14px] overflow-hidden bg-[#F0F0F0]">
            <Image
              src="/images/about/about-1.png"
              alt={memberName}
              fill
              className="object-cover object-top rounded-[14px]"
            />
          </div>

          {/* Identity info below image */}
          <div className="pt-3 pb-1 px-1 flex flex-col gap-2">
            <div>
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#888888] uppercase block">
                {summary?.role === "admin" || summary?.role === "superAdmin" ? "ADMIN" : "MEMBER"}
              </span>
              <h2 className="font-bold text-[#1A1A1A] text-[14px] uppercase leading-tight tracking-[0.06em] mt-0.5">
                {memberName}
              </h2>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#F0F0F0]" />

            {/* 2×2 details */}
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 pb-1 text-[11px] text-[#555555]">
              {[
                { icon: <MapPin className="w-3 h-3" />,    text: "Rajapur, Patuakhali" },
                { icon: <Calendar className="w-3 h-3" />,  text: "01 Dec 1993" },
                { icon: <Droplets className="w-3 h-3" />,  text: "O+ (Positive)" },
                { icon: <IdCard className="w-3 h-3" />,    text: `ID-${memberCode}` },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[#1FDE64] flex-shrink-0">{icon}</span>
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
                onClick={() => setIsWithdrawModalOpen(true)}
                className="inline-flex items-center gap-1.5 h-[36px] px-3.5 rounded-full bg-[#1A1A1A] text-white text-[12px] font-bold tracking-wide whitespace-nowrap hover:bg-[#333333] transition-colors cursor-pointer flex-shrink-0 shadow-2xs"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-[#1FDE64]" />
                Request Withdrawal
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-[36px] px-4 rounded-full bg-[#1FDE64] text-[#1A1A1A] text-[12px] font-bold tracking-wide whitespace-nowrap hover:bg-[#18c957] transition-colors cursor-pointer flex-shrink-0"
              >
                <History className="w-3.5 h-3.5" />
                Payment History
              </button>
            </div>
          </div>

          {/* Stat bars 3-col: MY PROFIT bound directly to member.profitBalance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            <StatBar
              label="Total Deposit"
              value={`৳${(Number(totalDepositVal) || 0).toLocaleString("en-US")}`}
              color="green"
              pct={78}
            />
            <StatBar
              label="Due Amount"
              value={`৳${(Number(dueAmountVal) || 0).toLocaleString("en-US")}`}
              color="red"
              pct={Number(dueAmountVal) > 0 ? 15 : 0}
            />
            <StatBar
              label="My Profit"
              value={`৳${(Number(myProfitVal) || 0).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}`}
              color="blue"
              pct={42}
            />
          </div>
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
              {scheduleList.map((row: any, idx: number) => {
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
              })}
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
    <div className="flex flex-col gap-6">
      <h2 className="font-serif text-[26px] sm:text-[30px] font-bold text-[#1A1A1A]">
        Friends Goal Overview
      </h2>

      {/* Main 2-col big cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <OverviewCard
          label="Total Balance"
          value="$3,436,736"
          variant="dark"
          icon={<Banknote />}
        />
        <div className="flex flex-col gap-5">
          <OverviewCard
            label="Monthly Expense"
            value="$88,860"
            sub="Generated 45% successfully growth"
            variant="green"
          />
          {/* Status badge pill */}
          <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-[20px] px-5 py-3.5">
            <div className="w-8 h-8 rounded-full bg-[#1FDE64] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-[#1A1A1A]" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase block">
                STATUS
              </span>
              <span className="text-[14px] font-bold text-white">
                Outstanding Growth
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Profit full-width dark card */}
      <OverviewCard
        label="Total Net Profit"
        value="$504,546"
        variant="dark"
        icon={<TrendingUp />}
      />

      {/* Bottom 3 mini stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Users className="w-5 h-5" />,
            label: "Members Received",
            value: "$2,972,000",
            iconBg: "bg-[#1FDE64]/15 text-[#2B5A27]",
          },
          {
            icon: <TrendingDown className="w-5 h-5" />,
            label: "Members Due",
            value: "$500,000",
            iconBg: "bg-[#FF4545]/10 text-[#FF4545]",
          },
          {
            icon: <Receipt className="w-5 h-5" />,
            label: "Others Received",
            value: "$49,050",
            iconBg: "bg-[#3B82F6]/10 text-[#3B82F6]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#E5E5E5] rounded-[20px] p-5 flex items-center gap-4 shadow-xs"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
            >
              {s.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wide block">
                {s.label}
              </span>
              <span className="text-[18px] font-bold text-[#1A1A1A]">{s.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardContent() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="font-serif text-[#1A1A1A] text-[24px] sm:text-[30px] font-bold leading-snug">
          Welcome back, Belal. Here&rsquo;s a summary of your financial ecosystem.
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
