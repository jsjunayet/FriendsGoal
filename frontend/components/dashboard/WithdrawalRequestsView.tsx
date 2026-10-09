"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Smartphone,
  Landmark,
  Banknote,
  Check,
  X,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import {
  withdrawalApi,
  IWithdrawalItem,
  IWithdrawalCounts,
  TWithdrawalStatus,
} from "@/lib/withdrawalApi";
import { printWithdrawalReceipt } from "@/lib/receiptGenerator";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";

type TabType = "All" | "Pending" | "Approved" | "Rejected";

export default function WithdrawalRequestsView() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawals, setWithdrawals] = useState<IWithdrawalItem[]>([]);
  const [counts, setCounts] = useState<IWithdrawalCounts>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, startTransition] = useTransition();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadData = async (tab: TabType = activeTab, search = searchQuery) => {
    setIsLoading(true);
    try {
      const res = await withdrawalApi.getWithdrawals({ statusTab: tab, search });
      setWithdrawals(res.data);
      setCounts(res.counts);
    } catch {
      // Handled in api fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab, searchQuery);
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(activeTab, searchQuery);
  };

  const handleToggleExpand = (item: IWithdrawalItem) => {
    if (expandedId === item._id) {
      setExpandedId(null);
      setAdminNote("");
    } else {
      setExpandedId(item._id);
      setAdminNote(item.adminNote || "");
    }
  };

  const handleRespond = (action: "approve" | "reject", item: IWithdrawalItem) => {
    startTransition(async () => {
      try {
        await withdrawalApi.respondWithdrawal(item._id, {
          action,
          adminNote,
          reviewerName: action === "approve" ? "Rania Islam" : "Tarek Farouq",
        });

        const actionText = action === "approve" ? "approved" : "rejected";
        setSuccessToast(
          `Withdrawal request WD-${item.referenceId} has been successfully ${actionText}!`
        );
        setTimeout(() => setSuccessToast(null), 4000);

        setExpandedId(null);
        setAdminNote("");
        await loadData(activeTab, searchQuery);
      } catch (err: any) {
        toast.error(err.message || "Failed to update withdrawal status");
      }
    });
  };

  const getMethodIcon = (method: string) => {
    if (method.toLowerCase().includes("mobile") || method.toLowerCase().includes("bkash") || method.toLowerCase().includes("nagad")) {
      return <Smartphone className="w-4 h-4 text-gray-500" />;
    }
    if (method.toLowerCase().includes("bank")) {
      return <Landmark className="w-4 h-4 text-gray-500" />;
    }
    return <Banknote className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* Top Header matching Screenshot 2 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Withdrawal Requests
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and respond to member withdrawal requests.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="bg-[#EAF8F1] border border-[#00B074]/30 text-[#00B074] px-4 py-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Check className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-[#00B074] hover:text-[#008f5d]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Table Card matching Screenshots 2, 3, 4 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card Header with Tabs */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Withdrawal Requests
          </h2>

          {/* Right Tabs matching Screenshot 2 */}
          <div className="inline-flex items-center bg-[#F3F4F6] p-1 rounded-xl gap-1">
            {/* All */}
            <button
              onClick={() => setActiveTab("All")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "All"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>All</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === "All"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {counts.all}
              </span>
            </button>

            {/* Pending */}
            <button
              onClick={() => setActiveTab("Pending")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "Pending"
                  ? "bg-white text-amber-600 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Pending</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 font-bold">
                {counts.pending}
              </span>
            </button>

            {/* Approved */}
            <button
              onClick={() => setActiveTab("Approved")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "Approved"
                  ? "bg-white text-[#00B074] shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Approved</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#00B074] font-bold">
                {counts.approved}
              </span>
            </button>

            {/* Rejected */}
            <button
              onClick={() => setActiveTab("Rejected")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "Rejected"
                  ? "bg-white text-red-600 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Rejected</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-600">
                {counts.rejected}
              </span>
            </button>
          </div>
        </div>

        {/* Optional Search / Quick Filter Bar */}
        <div className="px-6 py-3 bg-[#FAFBFB] border-b border-gray-100 flex items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, member, or method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#00B074] text-gray-700 placeholder:text-gray-400"
            />
          </form>

          <button
            onClick={() => loadData(activeTab, searchQuery)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FCFDFD]">
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  ID
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  MEMBER
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  AMOUNT
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  METHOD
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  SUBMITTED
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  STATUS
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <TableRowsSkeleton cols={7} rows={6} />
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <EmptyState
                      title="No withdrawal requests found"
                      description={
                        searchQuery
                          ? "No withdrawal records match your current search criteria."
                          : "There are currently no withdrawal requests submitted by members."
                      }
                    />
                  </td>
                </tr>
              ) : (
                withdrawals.map((item) => {
                  const isExpanded = expandedId === item._id;

                  return (
                    <React.Fragment key={item._id}>
                      {/* Primary Row matching Screenshot 2 */}
                      <tr
                        className={`hover:bg-[#F9FCFA] transition-colors ${
                          isExpanded ? "bg-[#F8FAF9]" : ""
                        }`}
                      >
                        {/* ID */}
                        <td className="py-4 px-6 text-xs text-gray-400 font-mono tracking-wider">
                          {item.referenceId}
                        </td>

                        {/* MEMBER */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {item.memberAvatar ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative shadow-xs">
                                <img src={item.memberAvatar} alt={item.memberName} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-full ${
                                  item.avatarColor || "bg-[#2F80ED]"
                                } text-white flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0`}
                              >
                                {item.memberInitials}
                              </div>
                            )}
                            <span className="font-semibold text-gray-900 whitespace-nowrap">
                              {item.memberName}
                            </span>
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="py-4 px-6">
                          <span className="font-bold text-gray-900 text-sm">
                            ৳{(Number(item?.amount) || 0).toLocaleString()}
                          </span>
                        </td>

                        {/* METHOD */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-700 text-sm whitespace-nowrap">
                            {getMethodIcon(item.method)}
                            <span>{item.method}</span>
                          </div>
                        </td>

                        {/* SUBMITTED */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="text-xs font-medium text-gray-800">
                            {item.submittedDate}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {item.submittedTimeAgo}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          {item.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                              Pending
                            </span>
                          )}
                          {item.status === "Approved" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF8F1] text-[#00B074]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00B074]" />
                              Approved
                            </span>
                          )}
                          {item.status === "Rejected" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#DC2626]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* ACTION */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {item.status === "Pending" ? (
                            <button
                              type="button"
                              onClick={() => handleToggleExpand(item)}
                              className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                isExpanded
                                  ? "bg-[#0E3B6C] text-white shadow-xs"
                                  : "bg-[#0E3B6C]/10 text-[#0E3B6C] hover:bg-[#0E3B6C]/20"
                              }`}
                            >
                              Respond
                            </button>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs text-gray-400">
                                {item.reviewedByName || "Admin"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  printWithdrawalReceipt({
                                    referenceId: item.referenceId,
                                    memberName: item.memberName,
                                    amount: item.amount,
                                    method: item.method,
                                    accountDetails: item.accountDetails,
                                    submittedDate: item.submittedDate,
                                    status: item.status,
                                    reviewedByName: item.reviewedByName,
                                    adminNote: item.adminNote,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-[#0E3B6C] bg-[#0E3B6C]/10 hover:bg-[#0E3B6C]/20 transition-colors cursor-pointer"
                                title="Print / Download Withdrawal Receipt PDF"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#0E3B6C]" />
                                <span>Receipt</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expanded View matching Screenshots 3 & 4 */}
                      {isExpanded && (
                        <tr className="bg-[#FAFBFB]">
                          <td colSpan={7} className="p-0">
                            <div className="border-t border-b border-gray-100 bg-[#F8FAF9]/80 px-8 py-5 transition-all">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Left Side: Details */}
                                <div className="space-y-4">
                                  <div>
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                      REASON
                                    </div>
                                    <div className="text-sm font-medium text-gray-800 mt-1">
                                      {item.reason || "Personal expenses"}
                                    </div>
                                  </div>

                                  <div>
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                      ACCOUNT
                                    </div>
                                    <div className="text-sm font-medium text-gray-800 mt-1">
                                      {item.accountDetails || "N/A"}
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side: Admin Note & Action Buttons matching Screenshot 4 */}
                                <div className="flex flex-col items-start md:items-end w-full">
                                  <div className="w-full max-w-md">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                      ADMIN NOTE (OPTIONAL)
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={adminNote}
                                      onChange={(e) =>
                                        setAdminNote(e.target.value)
                                      }
                                      placeholder="Add a note for the member..."
                                      className="w-full p-3 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#00B074] placeholder:text-gray-400 resize-none shadow-2xs"
                                    />

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 mt-3 justify-end">
                                      {/* Approve Button */}
                                      <button
                                        type="button"
                                        disabled={isProcessing}
                                        onClick={() =>
                                          handleRespond("approve", item)
                                        }
                                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-[#00B074] hover:bg-[#009864] text-white shadow-xs transition-colors disabled:opacity-50"
                                      >
                                        <Check className="w-4 h-4 stroke-[2.5]" />
                                        <span>Approve</span>
                                      </button>

                                      {/* Reject Button */}
                                      <button
                                        type="button"
                                        disabled={isProcessing}
                                        onClick={() =>
                                          handleRespond("reject", item)
                                        }
                                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-white border border-red-500 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                      >
                                        <X className="w-4 h-4 stroke-[2.5]" />
                                        <span>Reject</span>
                                      </button>
                                    </div>

                                    {/* Cancel Link */}
                                    <div className="text-right mt-2 pr-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setExpandedId(null);
                                          setAdminNote("");
                                        }}
                                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
