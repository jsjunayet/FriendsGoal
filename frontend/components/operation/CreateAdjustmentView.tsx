"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  Save,
  RefreshCw,
  FileEdit,
  CheckCircle2,
} from "lucide-react";
import { fetchMembersApi, IMember } from "@/lib/memberApi";
import { createAdjustmentApi, TAdjustmentType } from "@/lib/adjustmentApi";

export function CreateAdjustmentView() {
  const router = useRouter();

  // Form states
  const [adjustmentDate, setAdjustmentDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [memberId, setMemberId] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<TAdjustmentType>("debit");
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>("");
  const [remarks, setRemarks] = useState("");

  // Members list for dropdown
  const [members, setMembers] = useState<IMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetchMembersApi({ limit: 100 });
        setMembers(res.data);
        if (res.data.length > 0 && !memberId) {
          // Preselect or keep empty
        }
      } catch (err) {
        console.error("Failed to load members", err);
      } finally {
        setLoadingMembers(false);
      }
    }
    loadMembers();
  }, [memberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      alert("Please select a member");
      return;
    }
    const amt = parseFloat(adjustmentAmount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid positive adjustment amount");
      return;
    }
    if (!remarks.trim()) {
      alert("Please enter remarks for audit justification");
      return;
    }

    try {
      setIsSubmitting(true);
      await createAdjustmentApi({
        memberId,
        adjustmentType,
        adjustmentDate,
        adjustmentAmount: amt,
        remarks,
      });

      setSuccessMessage("Adjustment recorded and ledger balances updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/money-adjustment");
      }, 1200);
    } catch (err: any) {
      alert("Error creating adjustment: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* ─── Top Header matching Screenshot 1 ───────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Adjustment</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter details to manually adjust member balances or operational records.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ─── Form Card matching Screenshot 1 ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 lg:p-8 shadow-xs space-y-6">
        {/* Card Header with Green Icon */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#EAF8F1] flex items-center justify-center text-[#00B074]">
            <FileEdit className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Adjustment Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Adjustment Date & Member Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adjustment Date * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Adjustment Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={adjustmentDate}
                  onChange={(e) => setAdjustmentDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all"
                />
              </div>
            </div>

            {/* Member Name * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Member Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all cursor-pointer"
                >
                  <option value="">
                    {loadingMembers ? "Loading members..." : "Select Member"}
                  </option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.memberCode} – {m.fullName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Adjustment Type & Adjustment Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adjustment Type * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Adjustment Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value as TAdjustmentType)}
                  className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all cursor-pointer"
                >
                  <option value="debit">Debit (Deduct / Correction)</option>
                  <option value="credit">Credit (Add Deposit)</option>
                  <option value="fee_reversal">Fee Reversal / Waive</option>
                  <option value="operational">Other Operational Adjustment</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Adjustment Amount * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Adjustment Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Remarks */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Remarks</label>
            <textarea
              rows={4}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter reason for adjustment..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all resize-y"
            />
          </div>

          {/* Buttons: SAVE & Cancel matching Screenshot 1 */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00684A] hover:bg-[#00523a] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>SAVE</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/money-adjustment")}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
