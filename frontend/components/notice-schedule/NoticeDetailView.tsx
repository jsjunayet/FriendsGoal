"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { fetchNoticeScheduleByIdApi, NoticeScheduleType } from "@/lib/noticeScheduleApi";

interface NoticeDetailViewProps {
  noticeId: string;
}

export function NoticeDetailView({ noticeId }: NoticeDetailViewProps) {
  const router = useRouter();

  const { data: notice, isLoading, isError } = useQuery({
    queryKey: ["notice-schedule", noticeId],
    queryFn: () => fetchNoticeScheduleByIdApi(noticeId),
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00B074]" />
        <p className="text-xs text-gray-500 mt-2 font-medium">
          Loading notice details...
        </p>
      </div>
    );
  }

  if (isError || !notice) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-xs">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Notice Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            The notice you are looking for may have been archived or deleted.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00B074] text-white rounded-xl text-xs font-bold hover:bg-[#009663] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: NoticeScheduleType) => {
    switch (type) {
      case "Fee Reminder":
        return <DollarSign className="w-3.5 h-3.5 text-[#D97706]" />;
      case "Meeting":
        return <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />;
      case "Invitation":
        return <Mail className="w-3.5 h-3.5 text-[#9333EA]" />;
      case "Important Notice":
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />;
    }
  };

  const getTypeBadgeStyle = (type: NoticeScheduleType) => {
    switch (type) {
      case "Fee Reminder":
        return "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]";
      case "Meeting":
        return "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]";
      case "Invitation":
        return "bg-[#F3E8FF] text-[#9333EA] border border-[#E9D5FF]";
      case "Important Notice":
      default:
        return "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]";
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F7F4]/60 flex flex-col items-center">
      {/* ─── Top Brand Header matching Screenshot 2 ───────────────────────── */}
      <div className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1FDE64] flex items-center justify-center shadow-xs">
              <span className="text-white text-base font-black">✱</span>
            </div>
            <span className="font-serif font-bold text-gray-900 text-[18px] tracking-tight">
              Friends Goal
            </span>
          </Link>

          {/* < Back to dashboard Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
            <span>Back to dashboard</span>
          </button>
        </div>
      </div>

      {/* ─── Main Content Container matching Screenshot 2 ─────────────────── */}
      <div className="w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">
        {/* Notice Type Pill */}
        <div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${getTypeBadgeStyle(
              notice.type
            )}`}
          >
            {getTypeIcon(notice.type)}
            <span>{notice.type}</span>
          </span>
        </div>

        {/* Notice Title & Subtitle matching Screenshot 2 */}
        <div>
          <h1 className="font-serif text-[26px] sm:text-[32px] font-bold text-gray-900 leading-tight">
            {notice.title}
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Published by {notice.author || "Friends Goal administration"} for{" "}
            {notice.audience?.toLowerCase() || "all members"}.
          </p>
        </div>

        {/* Notice Card Container matching Screenshot 2 */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
          {/* Message Section */}
          <div className="p-6 sm:p-8">
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              MESSAGE
            </span>
            <p className="text-[15px] sm:text-[16px] text-gray-800 leading-relaxed font-serif">
              {notice.message || notice.agenda || "No message body provided."}
            </p>
          </div>

          {/* Divider & Bottom Meta Section */}
          <div className="border-t border-gray-100 bg-[#FAFAFA]/50 p-6 sm:p-8">
            {notice.type === "Fee Reminder" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    PAYMENT DUE
                  </span>
                  <div className="font-serif text-[18px] sm:text-[20px] font-bold text-gray-900">
                    {notice.dueDate || "Oct 15, 2026"}
                  </div>
                </div>

                <div className="sm:border-l sm:border-gray-200 sm:pl-8">
                  <span className="block text-[11px] font-bold text-[#A16207] uppercase tracking-wider mb-1.5">
                    AMOUNT DUE
                  </span>
                  <div className="font-serif text-[26px] sm:text-[28px] font-bold text-gray-900 leading-none">
                    ${(Number(notice.feeAmount) || 0).toFixed(2)}
                  </div>
                  <span className="text-xs text-[#D97706] font-semibold mt-1.5 block">
                    {notice.paymentStatus || "Payment is pending"}
                  </span>
                </div>
              </div>
            ) : notice.type === "Meeting" || notice.type === "Invitation" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    EVENT DATE & TIME
                  </span>
                  <div className="font-serif text-[18px] font-bold text-gray-900">
                    {notice.eventDate}{notice.time ? ` at ${notice.time}` : ""}
                  </div>
                </div>

                <div className="sm:border-l sm:border-gray-200 sm:pl-8">
                  <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    LOCATION
                  </span>
                  <div className="font-serif text-[18px] font-bold text-gray-900">
                    {notice.location || "Friends Goal Center"}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  PUBLISHED DATE
                </span>
                <div className="font-serif text-[18px] font-bold text-gray-900">
                  {notice.createdAt
                    ? new Date(notice.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Administration Footer Pill matching Screenshot 2 */}
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-white border border-gray-200 text-xs text-gray-600 shadow-2xs">
          <div className="w-5 h-5 rounded-full bg-[#1FDE64]/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-3 h-3 text-[#1E8A5A]" />
          </div>
          <span>
            This notice was published directly by the Friends Goal administration. Contact an administrator if you need clarification.
          </span>
        </div>
      </div>
    </div>
  );
}
