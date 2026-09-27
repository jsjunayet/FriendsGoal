"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Edit3,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  createExpenseApi,
  fetchExpenseCategoriesApi,
  fetchExpensesApi,
  IExpenseCategory,
  ICreateExpensePayload,
} from "@/lib/expenseApi";
import { fetchMembersApi, IMember } from "@/lib/memberApi";
import { ManageCategoriesModal } from "./ManageCategoriesModal";

export function CreateExpenseView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  // Form Fields
  const [expenseHead, setExpenseHead] = useState("");
  const [selectedMember, setSelectedMember] = useState<{ id?: string; name: string; code?: string } | null>(null);
  const [memberInput, setMemberInput] = useState("");
  const [expenseDate, setExpenseDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  // Categories & Members
  const [categories, setCategories] = useState<IExpenseCategory[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function initData() {
      try {
        const [cats, memsRes] = await Promise.all([
          fetchExpenseCategoriesApi(),
          fetchMembersApi({ limit: 100 }),
        ]);
        setCategories(cats);
        setMembers(memsRes.data);

        // If editing an existing expense
        if (editId) {
          const res = await fetchExpensesApi({ limit: 100 });
          const target = res.data.find((e) => String(e.expenseId) === editId);
          if (target) {
            setExpenseHead(target.expenseHead);
            setMemberInput(target.memberName);
            setSelectedMember({ name: target.memberName, code: target.memberCode });
            setExpenseDate(new Date(target.expenseDate).toISOString().slice(0, 10));
            setAmount(String(target.amount));
            setRemarks(target.remarks);
          }
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }
    initData();
  }, [editId]);

  const handleSelectMember = (member: IMember) => {
    setSelectedMember({
      id: member._id,
      name: member.fullName,
      code: member.memberCode,
    });
    setMemberInput(`${member.fullName} (${member.memberCode})`);
    setIsMemberDropdownOpen(false);
  };

  const handleReset = () => {
    setExpenseHead("");
    setSelectedMember(null);
    setMemberInput("");
    setExpenseDate(new Date().toISOString().slice(0, 10));
    setAmount("");
    setRemarks("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!expenseHead.trim()) {
      alert("Please select or enter an Expense Head");
      return;
    }
    if (!memberInput.trim()) {
      alert("Please enter or select a Member");
      return;
    }
    if (!expenseDate) {
      alert("Please select an Expense Date");
      return;
    }
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid positive Amount");
      return;
    }
    if (!remarks.trim()) {
      alert("Please enter Remarks");
      return;
    }

    try {
      setIsSubmitting(true);

      const memberName = selectedMember?.name || memberInput.trim();
      const payload: ICreateExpensePayload = {
        expenseHead: expenseHead.trim(),
        memberId: selectedMember?.id,
        memberName,
        memberCode: selectedMember?.code,
        expenseDate,
        amount: numAmount,
        remarks: remarks.trim(),
      };

      await createExpenseApi(payload);

      setSuccessMessage("Expense recorded successfully!");
      setTimeout(() => {
        router.push("/dashboard/expense");
      }, 1000);
    } catch (err: any) {
      alert("Failed to save expense: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter members by query
  const filteredMembers = members.filter((m) => {
    if (!memberInput) return true;
    const q = memberInput.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.memberCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* ─── Top Navigation matching Screenshot 2 ───────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/expense"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-2 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Operation</h1>
      </div>

      {/* Success Banner */}
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
          CREATE EXPENSE
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-6 max-w-[850px] mx-auto">
          {/* 1. Expense Head * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              Expense Head <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8 flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={expenseHead}
                  onChange={(e) => setExpenseHead(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] cursor-pointer"
                >
                  <option value="" disabled>
                    Search or select category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Manage Categories Button matching Screenshot 2 */}
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                title="Manage Categories"
                className="w-10 h-10 rounded-lg border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/60 text-[#056839] flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Member * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              Member <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8 relative">
              <input
                type="text"
                value={memberInput}
                onChange={(e) => {
                  setMemberInput(e.target.value);
                  setIsMemberDropdownOpen(true);
                }}
                onFocus={() => setIsMemberDropdownOpen(true)}
                placeholder="Name/ID"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />

              {/* Autocomplete dropdown */}
              {isMemberDropdownOpen && filteredMembers.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMemberDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20 divide-y divide-gray-100">
                    {filteredMembers.map((m) => (
                      <div
                        key={m._id}
                        onClick={() => handleSelectMember(m)}
                        className="px-4 py-2 text-xs sm:text-sm hover:bg-emerald-50/50 hover:text-[#00B074] cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="font-semibold">{m.fullName}</span>
                        <span className="text-xs text-gray-400 font-mono">
                          {m.memberCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 3. Expense Date * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              Expense Date <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8">
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                placeholder="mm/dd/yyyy"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* 4. Amount * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="$ 0.00"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* 5. Remarks * */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label className="md:col-span-4 md:text-right text-xs sm:text-sm font-bold text-gray-700 pt-2.5">
              Remarks <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-8">
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks or purpose of expense..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] resize-y"
              />
            </div>
          </div>

          {/* ─── Buttons matching Screenshot 2 ────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4">
            <div className="hidden md:block md:col-span-4" />
            <div className="md:col-span-8 flex items-center gap-3">
              {/* SAVE Button: Dark Emerald Green */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#056839] hover:bg-[#04532e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs inline-flex items-center justify-center min-w-[90px] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "SAVE"
                )}
              </button>

              {/* RESET Button: Light Grey */}
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-700 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                RESET
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ─── Manage Categories Modal ────────────────────────────────────────────── */}
      <ManageCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onCategoriesUpdated={(updatedCats) => {
          setCategories(updatedCats);
        }}
      />
    </div>
  );
}
