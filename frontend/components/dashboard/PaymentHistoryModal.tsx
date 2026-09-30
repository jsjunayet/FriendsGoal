"use client";

import { useEffect, useState } from "react";
import { X, History, FileText, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { withdrawalApi } from "@/lib/withdrawalApi";
import type { IWithdrawalItem } from "@/lib/withdrawalApi";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
}

export function PaymentHistoryModal({ isOpen, onClose, memberId }: PaymentHistoryModalProps) {
  const [history, setHistory] = useState<IWithdrawalItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && memberId) {
      loadHistory();
    }
  }, [isOpen, memberId]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      // We pass the memberId filter to get only this member's withdrawals
      const res = await withdrawalApi.getWithdrawals({ memberId });
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0F0F0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1FDE64]/10 flex items-center justify-center">
              <History className="w-5 h-5 text-[#1FDE64]" />
            </div>
            <div>
              <h2 className="font-serif text-[18px] font-bold text-[#1A1A1A]">
                Withdrawal History
              </h2>
              <p className="text-[12px] text-[#888888] mt-0.5">
                Track your past withdrawal requests and their current statuses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#555555] hover:bg-[#E5E5E5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-[#FAFAFA] flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#888888]">
              <div className="w-6 h-6 border-2 border-[#1FDE64] border-t-transparent rounded-full animate-spin" />
              <p className="text-[13px] font-medium">Loading history...</p>
            </div>
          ) : history.length > 0 ? (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div 
                  key={item._id}
                  className="bg-white border border-[#E5E5E5] rounded-[16px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F6F7F6] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-[#888888]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A1A1A] text-[15px]">
                        ${item.amount.toLocaleString()}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold tracking-wider text-[#888888] uppercase">
                          {item.referenceId}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#D9D9D9]" />
                        <span className="text-[12px] text-[#555555]">
                          {item.submittedDate}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#888888] mt-1.5 line-clamp-1">
                        {item.accountDetails}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-start sm:justify-end shrink-0">
                    {item.status === "Approved" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#E8F8EE] text-[#00B074]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Approved
                        </span>
                      </div>
                    )}
                    {item.status === "Pending" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#FFF9E6] text-[#FFB020]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Pending
                        </span>
                      </div>
                    )}
                    {item.status === "Rejected" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#FFEAEA] text-[#FF4545]">
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Rejected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#888888]">
              <AlertCircle className="w-8 h-8 text-[#D9D9D9]" />
              <p className="text-[13px] font-medium text-center">
                You haven't made any withdrawal requests yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
