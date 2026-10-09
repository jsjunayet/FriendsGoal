"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  fetchPendingPopups,
  acknowledgeNotification,
  INotification,
} from "../../lib/notificationApi";
import {
  AlertCircle,
  CreditCard,
  X,
  CheckCircle2,
  Calendar,
  Smartphone,
  Building2,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useMemberDashboard } from "../../lib/hooks/useMemberDashboard";
import { useAuth } from "@/context/AuthContext";
import { io } from "socket.io-client";

export function NotificationBlocker() {
  const router = useRouter();
  const { user } = useAuth();
  const [popups, setPopups] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [showPaymentGuide, setShowPaymentGuide] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { summary } = useMemberDashboard();

  // 1. Initial Load of Pending Mandatory Popups
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setPopups([]);
      return;
    }

    const loadPopups = async () => {
      try {
        const data = await fetchPendingPopups();
        setPopups(data || []);
      } catch (err) {
        console.error("Failed to fetch pending popups:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadPopups, 300);
    return () => clearTimeout(timer);
  }, [user]);

  // 2. Real-time Socket Listener for Instant Popups (Cron alerts)
  useEffect(() => {
    if (!user) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      if (user.userId) {
        socket.emit("join-room", user.userId);
        socket.emit("join_room", user.userId);
      }
    });

    const handleIncomingPopup = (data: INotification) => {
      if (data.requiresAction && !data.isAcknowledged) {
        setPopups((prev) => {
          if (prev.some((p) => p._id === data._id)) return prev;
          return [data, ...prev];
        });
      }
    };

    socket.on("new_notification", handleIncomingPopup);
    socket.on("new-notification", handleIncomingPopup);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // 3. Consolidated Unpaid Months Calculation
  const { unpaidMonthsList, totalDueAmount, monthCount } = useMemo(() => {
    const months: string[] = [];

    popups.forEach((p) => {
      if (p.metadata?.billingMonth) {
        months.push(String(p.metadata.billingMonth));
      } else {
        // Fallback: extract from message or createdAt
        const match = p.message?.match(/for\s+<strong>([^<]+)<\/strong>/i);
        if (match && match[1]) {
          months.push(match[1]);
        } else if (p.createdAt) {
          const dateStr = new Date(p.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          months.push(dateStr);
        }
      }
    });

    const uniqueMonths = Array.from(new Set(months.filter(Boolean)));
    const count = uniqueMonths.length > 0 ? uniqueMonths.length : popups.length;

    // Use member dashboard dueAmount if available, or sum from metadata
    const dueFromSummary = Number(summary?.dueAmount || 0);
    const dueFromPopups = popups.reduce((acc, p) => acc + (Number(p.metadata?.amount) || 1000), 0);
    const finalDue = dueFromSummary > 0 ? dueFromSummary : dueFromPopups;

    return {
      unpaidMonthsList: uniqueMonths,
      totalDueAmount: finalDue,
      monthCount: Math.max(1, count),
    };
  }, [popups, summary]);

  // 4. Consolidated Single-Click Acknowledge
  const handleAcknowledgeAll = async (redirectAfter = false) => {
    if (isAcknowledging) return;
    try {
      setIsAcknowledging(true);
      // Acknowledge all pending popups at once
      await Promise.all(popups.map((p) => acknowledgeNotification(p._id).catch(() => null)));
      setPopups([]);

      if (redirectAfter) {
        toast.success("Redirecting to payment channels...");
        router.push("/dashboard");
      } else {
        toast.success("Due notification acknowledged.");
      }
    } catch (err: any) {
      console.error("Failed to acknowledge notifications:", err);
      toast.error(err?.message || "Failed to acknowledge. Please try again.");
    } finally {
      setIsAcknowledging(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  if (loading || popups.length === 0) return null;

  const formattedMonthString =
    unpaidMonthsList.length > 0
      ? unpaidMonthsList.join(", ")
      : "Current billing cycles";

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl border border-red-100 overflow-hidden relative flex flex-col my-auto animate-in zoom-in-95 duration-200">
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-[#D62828] to-[#B71C1C] px-6 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              Action Required • Monthly Due Notice
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleAcknowledgeAll(false)}
            disabled={isAcknowledging}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 flex flex-col gap-5">
          {/* Main Title & Notice */}
          <div>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#1A1A1A] leading-snug">
              Outstanding Monthly Dues
            </h2>
            <p className="text-[13.5px] text-[#4A5568] mt-2 leading-relaxed">
              You have <strong className="text-[#D62828]">{monthCount} unpaid {monthCount === 1 ? "month" : "months"}</strong> ({formattedMonthString}). Total Due:{" "}
              <strong className="text-[#D62828] font-bold text-[15px]">
                ৳ {totalDueAmount.toLocaleString()}
              </strong>
              . Please clear your dues to keep your account active.
            </p>
          </div>

          {/* Consolidated Breakdown Card */}
          <div className="bg-[#FFF8F8] border border-[#FECACA] rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-2 border-b border-[#FEE2E2] pb-3">
              <span className="text-xs font-semibold text-gray-600">
                Pending Billing Months:
              </span>
              <span className="text-xs font-bold text-[#D62828] bg-red-100 px-2 py-0.5 rounded-full">
                {monthCount} {monthCount === 1 ? "Cycle" : "Cycles"} Overdue
              </span>
            </div>

            {/* Months Badges */}
            {unpaidMonthsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 py-0.5">
                {unpaidMonthsList.map((month) => (
                  <span
                    key={month}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-[#FCA5A5] text-[#991B1B] shadow-2xs"
                  >
                    <Calendar className="w-3 h-3 text-[#DC2626]" />
                    {month}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Total Overdue Payable:
              </span>
              <span className="font-serif text-[24px] font-bold text-[#D62828]">
                ৳ {totalDueAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Expandable / Direct Payment Guide */}
          {showPaymentGuide ? (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col gap-3 text-xs text-gray-700 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#00B074]" />
                  Official Payment Channels
                </span>
                <button
                  type="button"
                  onClick={() => setShowPaymentGuide(false)}
                  className="text-gray-400 hover:text-gray-700 text-[11px] underline"
                >
                  Hide
                </button>
              </div>

              {/* bKash & Nagad */}
              <div className="p-2.5 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#E2136E]" />
                  <div>
                    <span className="font-bold block text-gray-800">bKash / Nagad (Personal)</span>
                    <span className="font-mono text-gray-600">01712-345678</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("01712345678", "bKash Number")}
                  className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                  title="Copy number"
                >
                  {copiedText === "bKash Number" ? (
                    <Check className="w-3.5 h-3.5 text-[#00B074]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Bank Transfer */}
              <div className="p-2.5 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#2B5A27]" />
                  <div>
                    <span className="font-bold block text-gray-800">Bank Asia (Account)</span>
                    <span className="font-mono text-gray-600">1234-5678-9012 (Friends Goal)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("123456789012", "Bank Account")}
                  className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                  title="Copy account"
                >
                  {copiedText === "Bank Account" ? (
                    <Check className="w-3.5 h-3.5 text-[#00B074]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-500 italic mt-0.5">
                * Include your Member Code in the payment reference. Once paid, admin will record your collection.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPaymentGuide(true)}
              className="text-left text-xs font-semibold text-[#00B074] hover:text-[#009663] hover:underline flex items-center gap-1.5 cursor-pointer w-fit"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>View bKash & Bank Payment Numbers</span>
            </button>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {/* Primary Action Button: Pay Dues Now */}
            <button
              type="button"
              onClick={() => handleAcknowledgeAll(true)}
              disabled={isAcknowledging}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#00B074] hover:bg-[#009663] text-white font-bold text-sm transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Dues Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Action: Review & Acknowledge */}
            <button
              type="button"
              onClick={() => handleAcknowledgeAll(false)}
              disabled={isAcknowledging}
              className="w-full sm:w-auto py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isAcknowledging ? "Processing..." : "Acknowledge"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
