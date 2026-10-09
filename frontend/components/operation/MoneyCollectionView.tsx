"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  History,
  Download,
  Save,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { fetchMembersApi, IMember } from "@/lib/memberApi";
import {
  fetchCollectionsApi,
  collectPaymentApi,
  ICollectionRecord,
  IPaymentResult,
} from "@/lib/operationApi";
import { ExportDropdown } from "@/components/shared";
import { printMoneyReceipt } from "@/lib/receiptGenerator";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";

export function MoneyCollectionView() {
  const router = useRouter();

  // Members list for dropdown
  const [members, setMembers] = useState<IMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<IMember | null>(null);

  // Balances
  const [dueBalance, setDueBalance] = useState<number>(0);
  const [advanceBalance, setAdvanceBalance] = useState<number>(0);
  const [paidInput, setPaidInput] = useState<string>("");

  // History / Transactions
  const [history, setHistory] = useState<ICollectionRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Success Popup Modal State
  const [successModalData, setSuccessModalData] = useState<IPaymentResult | null>(null);

  // Load all active members for dropdown
  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetchMembersApi({ limit: 100 });
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to load members for collection", err);
      }
    }
    loadMembers();
  }, []);

  // When selectedMemberId changes
  useEffect(() => {
    async function loadData() {
      setLoadingHistory(true);
      if (!selectedMemberId) {
        // Initial Unselected State:
        // Member Selection combobox is empty by default
        // Due History displays RECENT 10 COLLECTION TRANSACTIONS globally
        // DUE BALANCE shows 0.00
        setSelectedMember(null);
        setDueBalance(0);
        setAdvanceBalance(0);
        try {
          const res = await fetchCollectionsApi();
          const list = Array.isArray(res?.collections)
            ? res.collections
            : Array.isArray((res as any)?.data)
            ? (res as any).data
            : [];
          setHistory(list.slice(0, 10));
        } catch (err) {
          console.error("Failed to load global collections", err);
          setHistory([]);
        } finally {
          setLoadingHistory(false);
        }
      } else {
        // Member Selected State:
        // Fetch and calculate real-time DUE BALANCE for that specific member
        // Table dynamically updates to display ONLY that selected member's history
        const found = members.find(
          (m) => m._id === selectedMemberId || m.memberCode === selectedMemberId
        );
        if (found) {
          setSelectedMember(found);
          setDueBalance(Number(found.dueAmount) || 0);
          setAdvanceBalance(Number(found.savingsBalance) || 0);
        }

        try {
          const res = await fetchCollectionsApi(selectedMemberId);
          if (res?.memberInfo) {
            setDueBalance(Number(res.memberInfo.dueAmount) || 0);
            setAdvanceBalance(
              Number(res.memberInfo.advanceBalance ?? (res.memberInfo as any).savingsBalance) || 0
            );
          } else if (res?.dueBalance !== undefined) {
            setDueBalance(Number(res.dueBalance) || 0);
            setAdvanceBalance(Number(res.advanceBalance) || 0);
          }
          const list = Array.isArray(res?.collections)
            ? res.collections
            : Array.isArray((res as any)?.data)
            ? (res as any).data
            : [];
          setHistory(list);
        } catch (err) {
          console.error("Failed to load member collections", err);
          setHistory([]);
        } finally {
          setLoadingHistory(false);
        }
      }
    }

    loadData();
  }, [selectedMemberId, members]);

  // Handle Payment Submit
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const amountNum = parseFloat(paidInput);
    if (!amountNum || amountNum <= 0) {
      toast.error("Please enter a valid payment amount greater than 0");
      return;
    }
    if (!selectedMemberId && !selectedMember) {
      toast.error("Please select a member first");
      return;
    }

    try {
      setIsSubmitting(true);
      const memberTargetId = selectedMember?._id || selectedMemberId;

      const result = await collectPaymentApi({
        memberId: memberTargetId,
        amount: amountNum,
        paymentMethod: "cash",
      });

      // Update local balances
      setDueBalance(Number(result.newDueAmount ?? (result as any).dueBalance) || 0);
      setAdvanceBalance(Number(result.newAdvanceBalance ?? (result as any).advanceBalance) || 0);
      setPaidInput("");

      // Refresh collections history
      const updatedHistory = await fetchCollectionsApi(memberTargetId);
      const list = Array.isArray(updatedHistory?.collections)
        ? updatedHistory.collections
        : Array.isArray((updatedHistory as any)?.data)
        ? (updatedHistory as any).data
        : [];
      setHistory(list);

      // Open Success Popup Modal
      setSuccessModalData(result);
      toast.success(`Payment of ৳${amountNum.toLocaleString()} recorded successfully!`);
    } catch (err: any) {
      console.error("Payment failed", err);
      toast.error(err?.message || "Payment processing failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Printable receipt slip trigger using exact official PDF design template
  const handlePrintReceipt = (receipt: {
    receiptNo: string;
    amount: number;
    memberName: string;
    memberCode: string;
    date: string;
    month?: string;
  }) => {
    printMoneyReceipt({
      receiptNo: receipt.receiptNo,
      amount: receipt.amount,
      memberName: receipt.memberName,
      memberCode: receipt.memberCode,
      date: receipt.date,
      month: receipt.month || receipt.date,
    });
  };

  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Money Collection</h1>
          <p className="text-sm text-gray-500 mt-0.5">Record and manage member payments.</p>
        </div>

        <div className="flex items-center gap-3">
          <ExportDropdown endpointUrl="/api/v1/reports/collection/export" defaultFilename="Collection_Report" />

          <button
            type="button"
            onClick={() => router.push("/dashboard/due-list")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* ─── 1. Member Selection Card matching Screenshot 2 & 3 ──────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Member Selection
        </label>
        <div className="relative">
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all cursor-pointer"
          >
            <option value="">Select Member (e.g. 071 – Tarek Abdulla)</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.memberCode} – {m.fullName}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* ─── 2. Selected Member Balance & Payment Grid matching Screenshot 3 ─────── */}
      {selectedMemberId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Due Balance Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-center">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              DUE BALANCE
            </div>
            <div className="text-3xl font-extrabold text-[#DC2626] tracking-tight">
              {(Number(dueBalance) || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-xl font-bold text-gray-800">BDT</span>
            </div>
            {Number(advanceBalance) > 0 && (
              <div className="text-xs text-[#00B074] font-semibold mt-1">
                Advance Balance: {(Number(advanceBalance) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT
              </div>
            )}
          </div>

          {/* Total Paid Amount Form Card */}
          <form
            onSubmit={handlePaymentSubmit}
            className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Total Paid Amount
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="any"
                  required
                  value={paidInput}
                  onChange={(e) => setPaidInput(e.target.value)}
                  placeholder="Enter amount..."
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00B074] hover:bg-[#009e67] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>SAVE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ─── 3. Due History Table matching Screenshot 2 & 3 ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {/* Table Title Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <History className="w-4 h-4 text-[#00B074]" />
            <span>Due History</span>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            {safeHistory.length} {safeHistory.length === 1 ? "entry" : "entries"}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#FAFBFD] border-b border-gray-200/80 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">DATE</th>
                <th className="py-3 px-6">MEMBER</th>
                <th className="py-3 px-6 text-right">AMOUNT</th>
                <th className="py-3 px-6 text-center">STATUS</th>
                <th className="py-3 px-6 text-center">RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingHistory ? (
                <TableRowsSkeleton cols={6} rows={6} />
              ) : safeHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No transaction entries found.
                  </td>
                </tr>
              ) : (
                safeHistory.map((record, index) => {
                  const isDue = record.status === "Due";
                  return (
                    <tr
                      key={record._id || index}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* ID */}
                      <td className="py-4 px-6 font-medium text-gray-600">
                        {index + 1}
                      </td>

                      {/* DATE */}
                      <td className="py-4 px-6 text-gray-600">
                        {record.month || "June-2024"}
                      </td>

                      {/* MEMBER */}
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {record.memberCode} – {record.memberName}
                      </td>

                      {/* AMOUNT */}
                      <td
                        className={`py-4 px-6 text-right font-bold ${
                          isDue ? "text-[#EF4444]" : "text-[#00B074]"
                        }`}
                      >
                        {(Number(record?.amount) || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${
                            isDue
                              ? "bg-[#FEE2E2] text-[#DC2626]"
                              : "bg-[#EAF8F1] text-[#00B074]"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>

                      {/* RECEIPT */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handlePrintReceipt({
                              receiptNo: record.receiptNo || `RCP-00${index + 1}`,
                              amount: record.amount,
                              memberName: record.memberName,
                              memberCode: record.memberCode,
                              date: record.month || record.paymentDate,
                            })
                          }
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#00B074] hover:border-[#00B074] hover:bg-[#EAF8F1]/40 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Download Receipt"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 4. Payment Saved! Modal matching Screenshot 4 ───────────────────────── */}
      {successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-[#00684A] w-full max-w-[420px] rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-white">
            {/* Close X button */}
            <button
              type="button"
              onClick={() => setSuccessModalData(null)}
              className="absolute right-5 top-5 p-1 text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Circle Check Icon */}
            <div className="flex flex-col items-center text-center mt-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Payment Saved!</h3>
              <p className="text-xs text-white/80 mt-0.5">Friends Goal — Financial Operations</p>

              {/* Receipt Code Badge */}
              <div className="mt-3 px-3 py-1 rounded-full bg-[#004d36] text-[11px] font-mono font-semibold tracking-wider border border-white/20">
                {successModalData.receiptNo}
              </div>
            </div>

            {/* Inner White Information Card */}
            <div className="bg-white rounded-2xl p-5 text-gray-800 shadow-md space-y-4">
              {/* Amount Box */}
              <div className="text-center pb-3 border-b border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  AMOUNT PAID
                </div>
                <div className="text-2xl font-extrabold text-[#00684A] mt-1">
                  {(Number(successModalData.amount) || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-sm font-bold text-gray-700">BDT</span>
                </div>
              </div>

              {/* Key Details Rows */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                    MEMBER
                  </span>
                  <span className="font-semibold text-gray-800">
                    {successModalData.memberCode} – {successModalData.memberName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                    DATE
                  </span>
                  <span className="font-semibold text-gray-800">
                    {successModalData.paymentDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                    REMAINING DUE
                  </span>
                  <span className="font-semibold text-[#DC2626]">
                    {(Number(successModalData.newDueAmount ?? (successModalData as any).dueBalance) || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    BDT
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                    STATUS
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#00B074]">
                    Paid
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handlePrintReceipt({
                      receiptNo: successModalData.receiptNo,
                      amount: successModalData.amount,
                      memberName: successModalData.memberName,
                      memberCode: successModalData.memberCode,
                      date: successModalData.paymentDate,
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00684A] hover:bg-[#00523a] text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSuccessModalData(null)}
                  className="w-full py-2 bg-transparent hover:bg-gray-50 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Skip — download later
                </button>
              </div>

              <div className="text-[10px] text-center text-gray-400 pt-1">
                You can re-download this receipt anytime from the history table.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
