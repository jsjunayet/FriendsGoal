"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  createDisbursementApi,
  fetchMemberProfitBalanceApi,
} from "@/lib/disbursementApi";
import { fetchMembersApi, IMember } from "@/lib/memberApi";

export function CreateDisbursementView() {
  const router = useRouter();

  const [members, setMembers] = useState<IMember[]>([]);
  const [selectedMemberName, setSelectedMemberName] = useState("MD BELAL HOSSAIN");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [profitBalance, setProfitBalance] = useState<number>(4554.0);
  const [paidAmount, setPaidAmount] = useState<string>("");
  const [loadingProfit, setLoadingProfit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetchMembersApi({ limit: 100 });
        setMembers(res.data);
        if (res.data.length > 0) {
          const defaultMember =
            res.data.find(
              (m) =>
                m.fullName.toUpperCase().includes("BELAL") ||
                m.fullName.toUpperCase().includes("MD")
            ) || res.data[0];
          setSelectedMemberName(defaultMember.fullName);
          setSelectedMemberId(defaultMember._id || "");
          fetchProfit(defaultMember._id || defaultMember.fullName);
        }
      } catch (err) {
        console.error("Failed to load members:", err);
      }
    }
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfit = async (idOrName: string) => {
    setLoadingProfit(true);
    try {
      const res = await fetchMemberProfitBalanceApi(idOrName);
      setProfitBalance(res.profitBalance);
    } catch (err) {
      console.error("Error fetching profit balance:", err);
    } finally {
      setLoadingProfit(false);
    }
  };

  const handleMemberSelect = (name: string) => {
    setSelectedMemberName(name);
    const m = members.find((mem) => mem.fullName === name);
    if (m) {
      setSelectedMemberId(m._id || "");
      fetchProfit(m._id || name);
    } else {
      fetchProfit(name);
    }
  };

  const handleShowClick = (e: React.FormEvent) => {
    e.preventDefault();
    const m = members.find((mem) => mem.fullName === selectedMemberName);
    fetchProfit(m?._id || selectedMemberName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paidAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid payout amount.");
      return;
    }

    if (amt > profitBalance) {
      alert(`Paid amount ($${amt}) exceeds available profit balance ($${profitBalance}).`);
      return;
    }

    try {
      setIsSubmitting(true);
      await createDisbursementApi({
        memberId: selectedMemberId || selectedMemberName,
        paidAmount: amt,
        disbursDate: new Date().toISOString().slice(0, 10),
        remarks: "Profit Disbursement Payout",
      });

      setSuccessMessage("Disbursement payout recorded and profit balance updated!");
      setTimeout(() => {
        router.push("/dashboard/income-disbursement");
      }, 1000);
    } catch (err: any) {
      alert("Failed to process disbursement: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* ─── Top Header & Back Navigation matching Screenshot 2 ──────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Income Disbursement
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Record a new disbursement entry.
          </p>
        </div>

        {/* < BACK Button */}
        <Link
          href="/dashboard/income-disbursement"
          className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer uppercase tracking-wider"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </Link>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#00B074] text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ─── Card 1: INCOMEDISBURS Member Selection matching Screenshot 2 ─────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="bg-[#F8FAFC] px-6 py-3.5 border-b border-gray-200/80">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            INCOMEDISBURS
          </h3>
        </div>

        <div className="p-6">
          <form onSubmit={handleShowClick} className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              MEMBER NAME
            </label>
            <div className="flex items-center gap-3 max-w-xl">
              <div className="relative flex-1">
                <select
                  value={selectedMemberName}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] cursor-pointer"
                >
                  {members.length > 0 ? (
                    members.map((m) => (
                      <option key={m._id} value={m.fullName}>
                        {m.fullName}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="MD BELAL HOSSAIN">MD BELAL HOSSAIN</option>
                      <option value="MD JUWEL HASAN">MD JUWEL HASAN</option>
                      <option value="SARAH JENKINS">SARAH JENKINS</option>
                      <option value="JOHN DOE">JOHN DOE</option>
                      <option value="FATEMA BEGUM">FATEMA BEGUM</option>
                    </>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* SHOW Button */}
              <button
                type="submit"
                disabled={loadingProfit}
                className="px-6 py-2.5 bg-[#00B074] hover:bg-[#009663] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {loadingProfit ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "SHOW"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ─── Card 2: Receivable Information matching Screenshot 2 ────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="bg-[#F8FAFC] px-6 py-3.5 border-b border-gray-200/80">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Receivable Information
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TOTAL PROFIT BALANCE (Replaces legacy Total Due Amount label per prompt specification) */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                TOTAL PROFIT BALANCE
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled
                  value={(Number(profitBalance) || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* TOTAL PAID AMOUNT */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                TOTAL PAID AMOUNT
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
                />
              </div>
            </div>
          </div>

          {/* Member Info Alert Pill matching Screenshot 2 */}
          <div className="flex items-center gap-2 p-3.5 rounded-lg bg-[#EAF8F1]/60 border border-[#00B074]/30 text-xs sm:text-sm font-semibold text-gray-800">
            <Info className="w-4 h-4 text-[#00B074] flex-shrink-0" />
            <span>Member: {selectedMemberName}</span>
          </div>

          {/* Bottom-right SAVE Button matching Screenshot 2 */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !paidAmount}
              className="px-8 py-2.5 bg-[#86EFAC]/80 hover:bg-[#6EE7B7] text-[#065F46] hover:text-[#044E39] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-40 inline-flex items-center justify-center min-w-[100px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "SAVE"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
