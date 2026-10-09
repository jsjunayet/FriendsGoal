"use client";

import { useEffect, useState } from "react";
import {
  X,
  History,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { withdrawalApi } from "@/lib/withdrawalApi";
import type { IWithdrawalItem } from "@/lib/withdrawalApi";
import { fetchCollectionsApi, ICollectionRecord } from "@/lib/operationApi";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  defaultSchedule?: any[];
}

export function PaymentHistoryModal({
  isOpen,
  onClose,
  memberId,
  defaultSchedule = [],
}: PaymentHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<"collection" | "withdrawal">("collection");
  const [withdrawals, setWithdrawals] = useState<IWithdrawalItem[]>([]);
  const [collections, setCollections] = useState<any[]>(defaultSchedule);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && memberId) {
      loadData();
    }
  }, [isOpen, memberId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [wRes, cRes] = await Promise.allSettled([
        withdrawalApi.getWithdrawals({ memberId }),
        fetchCollectionsApi(memberId),
      ]);

      if (wRes.status === "fulfilled" && wRes.value?.data) {
        setWithdrawals(wRes.value.data);
      }
      if (cRes.status === "fulfilled" && cRes.value?.collections?.length) {
        setCollections(cRes.value.collections);
      } else if (defaultSchedule.length) {
        setCollections(defaultSchedule);
      }
    } catch (error) {
      console.error("Failed to load payment history", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getWithdrawalStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF8F1] text-[#00B074] border border-[#00B074]/30">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1FDE64]/10 flex items-center justify-center text-[#1FDE64]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-[18px] sm:text-[20px] font-bold text-gray-900">
                Payment History
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Track your subscription collections and withdrawal requests
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Distinct Tabs Switcher */}
        <div className="px-6 pt-3 pb-2 border-b border-gray-100 bg-[#FAFAFA] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("collection")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === "collection"
                ? "bg-white text-[#00B074] shadow-xs border border-gray-200"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-[#00B074]" />
            <span>Money Collection History</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded-full ml-1">
              {collections.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("withdrawal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === "withdrawal"
                ? "bg-white text-[#00B074] shadow-xs border border-gray-200"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-[#2B3B26]" />
            <span>Withdrawal Requests</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded-full ml-1">
              {withdrawals.length}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto bg-[#FAFAFA] flex-1">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-gray-400">
              <div className="w-6 h-6 border-2 border-[#00B074] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-gray-500">Loading history records...</p>
            </div>
          ) : activeTab === "collection" ? (
            /* TAB 1: Money Collection History */
            collections.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-xs">
                No subscription collection records found for your account.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {collections.map((item: any, idx: number) => {
                  const isPaid = item.status === "Paid" || !item.status;
                  return (
                    <div
                      key={item.receiptNo || item._id || idx}
                      className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EAF8F1] flex items-center justify-center text-[#00B074] shrink-0">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-gray-900 text-[15px]">
                            ৳{(Number(item.amount) || 0).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="font-medium text-gray-700">
                              {item.month || "Subscription"}
                            </span>
                            {item.receiptNo && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-[11px] text-gray-500">
                                  #{item.receiptNo}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-xs text-gray-500 font-medium">
                          {item.paymentDate
                            ? new Date(item.paymentDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recorded"}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-[#EAF8F1] text-[#00B074] border border-[#A7F3D0]"
                              : "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                          }`}
                        >
                          {item.status || "Paid"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* TAB 2: Withdrawal Request History */
            withdrawals.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-xs">
                No withdrawal requests submitted yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {withdrawals.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-gray-900 text-[15px]">
                          ৳{item.amount.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="font-mono text-[11px] font-semibold text-gray-700">
                            {item.referenceId}
                          </span>
                          <span>•</span>
                          <span>{item.method || "Mobile Banking"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-xs text-gray-500 font-medium">
                        {item.submittedDate}
                      </span>
                      {getWithdrawalStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
