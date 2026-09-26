"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Users,
  Users2,
  AlertTriangle,
  Receipt,
  Bell,
  MoreHorizontal,
  ArrowRight,
  Menu,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { NotificationPopover } from "./NotificationPopover";

// ─── Static Mock Data ────────────────────────────────────────────────────────

const KPI_STATS = [
  {
    id: "total_amounts",
    title: "Total Amounts",
    value: "$2.45M",
    icon: Wallet,
    iconBg: "bg-[#EAF8F1] text-[#00B074]",
    isAlert: false,
  },
  {
    id: "profits",
    title: "Profits",
    value: "$840k",
    icon: TrendingUp,
    iconBg: "bg-[#EAF8F1] text-[#00B074]",
    isAlert: false,
  },
  {
    id: "members_received",
    title: "Members Received",
    value: "$1.15M",
    icon: Users,
    iconBg: "bg-[#EAF8F1] text-[#00B074]",
    isAlert: false,
  },
  {
    id: "others_received",
    title: "others Received",
    value: "$1.15M",
    icon: Users2,
    iconBg: "bg-[#EAF8F1] text-[#00B074]",
    isAlert: false,
  },
  {
    id: "due_amounts",
    title: "Due Amounts",
    value: "$2.45M",
    icon: AlertTriangle,
    iconBg: "bg-[#FEE2E2] text-[#DC2626]",
    isAlert: true,
  },
  {
    id: "expense_amounts",
    title: "Expense Amounts",
    value: "$2.45M",
    icon: Receipt,
    iconBg: "bg-[#FEE2E2] text-[#DC2626]",
    isAlert: true,
  },
];

const MONTHLY_COLLECTION_DATA = [
  { month: "Jan", amount: 180000 },
  { month: "Feb", amount: 290000 },
  { month: "Mar", amount: 130000 },
  { month: "Apr", amount: 395000 },
  { month: "May", amount: 220000 },
  { month: "Jun", amount: 395000 },
  { month: "Jul", amount: 340000 },
  { month: "Aug", amount: 215000 },
  { month: "Sep", amount: 310000 },
  { month: "Oct", amount: 495900, isCurrent: true },
  { month: "Nov", amount: 375000 },
  { month: "Dec", amount: 275000 },
];

const PERFORMANCE_DATA = [
  { name: "Recieve", value: 76, color: "#00875A" },
  { name: "Profit", value: 15, color: "#10B981" },
  { name: "Expense", value: 9, color: "#EF4444" },
];

const MEMBER_DUE_LIST = [
  { id: "001", name: "MD. Yousuf Mozomder", amount: "$45,200.00" },
  { id: "001", name: "MD. Yousuf Mozomder", amount: "$45,200.00" },
  { id: "001", name: "MD. Yousuf Mozomder", amount: "$45,200.00" },
  { id: "001", name: "MD. Yousuf Mozomder", amount: "$45,200.00" },
  { id: "001", name: "MD. Yousuf Mozomder", amount: "$45,200.00" },
  { id: "001", name: "MD. Yousuf Mozomder", amount: "$45,200.00" },
  { id: "001", name: "MD. Yousuf Mozomder", amount: "$45,200.00" },
];

interface FinancialAnalyticsViewProps {
  onToggleMobileSidebar?: () => void;
}

// ─── Custom Floating Badge on Oct Bar ────────────────────────────────────────

const renderCustomBarLabel = (props: any) => {
  const { x, y, width, value, index } = props;
  const isOct = MONTHLY_COLLECTION_DATA[index]?.isCurrent;

  if (!isOct) return null;

  const badgeWidth = 62;
  const badgeHeight = 22;
  const badgeX = x + width / 2 - badgeWidth / 2;
  const badgeY = y - badgeHeight - 8;

  return (
    <g>
      {/* Tooltip Background Pill */}
      <rect
        x={badgeX}
        y={badgeY}
        width={badgeWidth}
        height={badgeHeight}
        rx={4}
        ry={4}
        fill="#F3F4F6"
        stroke="#E5E7EB"
        strokeWidth={1}
      />
      {/* Downward pointer triangle */}
      <polygon
        points={`${badgeX + badgeWidth / 2 - 4},${badgeY + badgeHeight} ${badgeX + badgeWidth / 2 + 4},${badgeY + badgeHeight} ${badgeX + badgeWidth / 2},${badgeY + badgeHeight + 4}`}
        fill="#F3F4F6"
      />
      {/* Badge Text */}
      <text
        x={badgeX + badgeWidth / 2}
        y={badgeY + 15}
        fill="#1F2937"
        textAnchor="middle"
        fontSize={11}
        fontWeight="600"
        fontFamily="sans-serif"
      >
        {value}
      </text>
    </g>
  );
};

export function FinancialAnalyticsView({ onToggleMobileSidebar }: FinancialAnalyticsViewProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(4);

  return (
    <div className="w-full flex flex-col gap-7 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ── 1. Top Header ────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight leading-tight">
              Financial Analytics
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#64748B] mt-0.5">
              Overview of collections, profits and member performance
            </p>
          </div>
        </div>

        {/* Bell Notification Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-xs relative cursor-pointer"
            aria-label="Toggle notifications"
          >
            <Bell className="w-4 h-4 text-gray-700" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          <NotificationPopover
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            onViewAll={() => setIsNotificationOpen(false)}
          />
        </div>
      </header>

      {/* ── 2. Top Stats Grid (6 KPI Cards matching Screenshot 2 & 4) ────────── */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Row 1: 4 Cards */}
          {KPI_STATS.slice(0, 4).map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-5 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#64748B]">
                    {card.title}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[26px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
                    {card.value}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Row 2: 2 Cards (Due Amounts, Expense Amounts) */}
          {KPI_STATS.slice(4, 6).map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-5 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#64748B]">
                    {card.title}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[26px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
                    {card.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. Delivery Section ──────────────────────────────────────────────── */}
      <section aria-label="Delivery and Analytics Charts" className="flex flex-col gap-3">
        <h2 className="text-[15px] font-bold text-[#0F172A] tracking-tight">
          Delivery
        </h2>

        {/* 3-Column Chart & List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* ── Column 1: Member Collection Bar Chart (5/12 cols) ─────────────── */}
          <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">
                Member Collection
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Recharts Bar Chart */}
            <div className="w-full h-[250px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MONTHLY_COLLECTION_DATA}
                  margin={{ top: 25, right: 0, left: -25, bottom: 0 }}
                  barSize={20}
                >
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    dy={5}
                  />
                  <YAxis hide domain={[0, 550000]} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, "Collection"]}
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderRadius: "8px",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#10B981" }}
                  />
                  <Bar
                    dataKey="amount"
                    radius={[6, 6, 0, 0]}
                    label={renderCustomBarLabel}
                  >
                    {MONTHLY_COLLECTION_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.month}`}
                        fill={entry.isCurrent ? "#10B981" : "#D1FAE5"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Column 2: Performance Donut Chart (3/12 cols) ─────────────────── */}
          <div className="lg:col-span-3 xl:col-span-3 bg-white rounded-2xl p-5 sm:p-6 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-2">
              Performance
            </h3>

            {/* Recharts Donut Chart */}
            <div className="relative w-full h-[190px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PERFORMANCE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {PERFORMANCE_DATA.map((entry) => (
                      <Cell key={`pie-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Red Badge inside segment as seen in screenshot */}
              <div className="absolute top-[52%] left-[26%] -translate-y-1/2 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
                10%
              </div>
            </div>

            {/* Custom Legend matching Screenshot 2 & 4 */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00875A] flex-shrink-0" />
                <span className="text-[12px] text-gray-700 font-medium">Recieve (76%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#10B981] flex-shrink-0" />
                <span className="text-[12px] text-gray-700 font-medium">Profit (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#EF4444] flex-shrink-0" />
                <span className="text-[12px] text-gray-700 font-medium">Expense (9%)</span>
              </div>
            </div>
          </div>

          {/* ── Column 3: Member Due List Card (4/12 cols) ────────────────────── */}
          <div className="lg:col-span-3 xl:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              {/* Header with Show More -> button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-[#0F172A]">
                  Member Due List
                </h3>
                <Link
                  href="/admin/dashboard/members"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00B074] hover:text-[#059669] hover:underline px-2.5 py-0.5 rounded-full border border-[#D1FAE5] bg-[#F0FDF4] transition-colors"
                >
                  Show More <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="pb-2.5 pr-2 font-semibold">ID</th>
                      <th className="pb-2.5 px-2 font-semibold">NAME</th>
                      <th className="pb-2.5 pl-2 font-semibold text-right">DUE AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/80 text-[12px]">
                    {MEMBER_DUE_LIST.map((member, idx) => (
                      <tr key={`due-member-${idx}`} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 pr-2 text-gray-500 font-medium">{member.id}</td>
                        <td className="py-2.5 px-2 text-gray-800 font-medium truncate max-w-[140px]">
                          {member.name}
                        </td>
                        <td className="py-2.5 pl-2 text-right font-semibold text-gray-900 whitespace-nowrap">
                          {member.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
