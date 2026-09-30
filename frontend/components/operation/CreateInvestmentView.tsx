"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  createInvestmentApi,
  updateInvestmentApi,
  fetchInvestmentsApi,
  ICreateInvestmentPayload,
  TInvestmentStatus,
} from "@/lib/investmentApi";
import { fetchMembersApi, IMember } from "@/lib/memberApi";

export function CreateInvestmentView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  // Form states matching Screenshot 2
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [isClosed, setIsClosed] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");

  // Optional member tracking
  const [members, setMembers] = useState<IMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function initData() {
      try {
        const memRes = await fetchMembersApi({ limit: 100 });
        setMembers(memRes.data);

        if (editId) {
          const invRes = await fetchInvestmentsApi({ limit: 100 });
          const target = invRes.data.find(
            (i) => i.investmentId === editId || i._id === editId
          );
          if (target) {
            setName(target.name);
            setAmount(String(target.amount));
            setStartDate(new Date(target.startDate).toISOString().slice(0, 10));
            if (target.status === "Closed" || target.endDate) {
              setIsClosed(true);
              setEndDate(
                target.endDate
                  ? new Date(target.endDate).toISOString().slice(0, 10)
                  : ""
              );
            }
            setRemarks(target.remarks);
            if (target.memberId) {
              setSelectedMemberId(target.memberId);
            }
          }
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }
    initData();
  }, [editId]);

  const handleReset = () => {
    setName("");
    setAmount("");
    setStartDate(new Date().toISOString().slice(0, 10));
    setIsClosed(false);
    setEndDate("");
    setRemarks("");
    setSelectedMemberId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter Investment Name");
      return;
    }
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (isNaN(numAmount) || numAmount < 0) {
      toast.error("Please enter a valid Amount");
      return;
    }
    if (!startDate) {
      toast.error("Please select a Start Date");
      return;
    }
    if (isClosed && !endDate) {
      toast.error("Please select an End Date for Closed investment");
      return;
    }
    if (!remarks.trim()) {
      toast.error("Please enter Remarks");
      return;
    }

    try {
      setIsSubmitting(true);

      const status: TInvestmentStatus = isClosed ? "Closed" : "Running";
      const isActive = !isClosed;

      const memberObj = members.find((m) => m._id === selectedMemberId);

      const payload: ICreateInvestmentPayload = {
        name: name.trim(),
        amount: numAmount,
        startDate,
        endDate: isClosed ? endDate : null,
        remarks: remarks.trim(),
        status,
        isActive,
        memberId: selectedMemberId || undefined,
        memberName: memberObj?.fullName,
        memberCode: memberObj?.memberCode,
      };

      if (editId) {
        await updateInvestmentApi(editId, payload);
        setSuccessMessage("Investment updated successfully!");
      } else {
        await createInvestmentApi(payload);
        setSuccessMessage("Investment created successfully!");
      }

      setTimeout(() => {
        router.push("/dashboard/investment");
      }, 1000);
    } catch (err: any) {
      toast.error("Failed to save investment: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Navigation matching Screenshot 2 ───────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/investment"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-2 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Investment</h1>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#00B074] text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ─── Card Layout matching Screenshot 2 ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Emerald Green Header Bar matching Screenshot 2 */}
        <div className="bg-[#056839] px-8 py-3.5 text-white font-bold text-sm tracking-wide uppercase">
          CREATE INVESTMENT
        </div>

        {/* Form Body matching Screenshot 2 */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-6 max-w-[850px] mx-auto">
          {/* 1. Name * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Investment name"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* 2. Amount * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8">
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* 3. Start Date * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* 4. Status Checkbox matching Screenshot 2: "Status [ ] Closed" */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              Status
            </label>
            <div className="md:col-span-8 flex items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isClosed}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsClosed(checked);
                    if (checked && !endDate) {
                      setEndDate(new Date().toISOString().slice(0, 10));
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-[#00B074] focus:ring-[#00B074]"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Closed</span>
              </label>
            </div>
          </div>

          {/* 5. End Date * (revealed or enabled if Closed) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              End Date {isClosed && <span className="text-red-500">*</span>}
            </label>
            <div className="md:col-span-8">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!isClosed}
                placeholder="mm/dd/yyyy"
                className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-white border rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] ${
                  !isClosed
                    ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* 6. Remarks * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700 pt-2.5">
              Remarks <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8">
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks or account reference..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] resize-y"
              />
            </div>
          </div>

          {/* 7. Optional Member Reference (Audit tracking only) */}
          {members.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
              <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-600">
                Member Reference
              </label>
              <div className="md:col-span-8">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#00B074]"
                >
                  <option value="">None / Organization Level</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullName} ({m.memberCode})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Reference only. Does NOT affect member balances or ledgers.
                </p>
              </div>
            </div>
          )}

          {/* ─── Centered Action Buttons matching Screenshot 3 ──────────────────── */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 bg-[#056839] hover:bg-[#04532e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs inline-flex items-center justify-center min-w-[90px] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "SAVE"
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-7 py-2.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-700 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
            >
              RESET
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
