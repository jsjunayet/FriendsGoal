"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { investmentIncomeApi } from "@/lib/investmentIncomeApi";
import { fetchInvestmentsApi } from "@/lib/investmentApi";

export function CreateInvestmentIncomeForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    investmentId: "",
    date: "",
    amount: "",
    remarks: "",
  });

  const { data: investmentsData, isLoading: isLoadingInvestments } = useQuery({
    queryKey: ["investments"],
    queryFn: () => fetchInvestmentsApi(),
  });

  const investments = investmentsData?.data || [];

  const { mutate, isPending } = useMutation({
    mutationFn: investmentIncomeApi.createInvestmentIncome,
    onSuccess: () => {
      toast.success("Investment income created and distributed equally to all active members!");
      queryClient.invalidateQueries({ queryKey: ["investment-incomes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-overview"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member"] });
      queryClient.invalidateQueries({ queryKey: ["disbursements"] });
      router.push("/dashboard/investment-income");
    },
    onError: (error: any) => {
      console.error("CREATE INVESTMENT INCOME ERROR:", error);
      toast.error(error.message || "Failed to create investment income");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    if (!formData.investmentId || !formData.date || !formData.amount || !formData.remarks) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    mutate({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  const handleReset = () => {
    setFormData({
      investmentId: "",
      date: "",
      amount: "",
      remarks: "",
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      <div>
        <Link
          href="/dashboard/investment-income"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
          Investment Income Reports
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm w-full">
        <div className="bg-[#00603B] py-3.5 px-6">
          <h2 className="text-white text-[14px] font-bold uppercase tracking-wider">
            CREATE INVESTMENT INCOME
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-10">
          <div className="flex flex-col gap-6 max-w-4xl">
            {/* Investment Name */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label className="text-[14px] text-gray-700 font-bold md:w-48 md:text-right shrink-0">
                Investment Name <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.investmentId}
                onChange={(e) => setFormData({ ...formData, investmentId: e.target.value })}
                className="flex-1 h-11 px-3 rounded-md border border-gray-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00603B]/20 focus:border-[#00603B] bg-white transition-shadow"
                required
              >
                <option value="">Select Investment</option>
                {investments.map((inv: any) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.name} (ID: {inv.investmentId})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label className="text-[14px] text-gray-700 font-bold md:w-48 md:text-right shrink-0">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="flex-1 h-11 px-3 rounded-md border border-gray-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00603B]/20 focus:border-[#00603B] transition-shadow"
                required
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label className="text-[14px] text-gray-700 font-bold md:w-48 md:text-right shrink-0">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="flex-1 h-11 px-3 rounded-md border border-gray-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00603B]/20 focus:border-[#00603B] transition-shadow"
                required
              />
            </div>

            {/* Remarks */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-8">
              <label className="text-[14px] text-gray-700 font-bold md:w-48 md:text-right shrink-0 pt-3">
                Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={4}
                className="flex-1 p-3 rounded-md border border-gray-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00603B]/20 focus:border-[#00603B] transition-shadow resize-y"
                required
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 md:pl-[224px] pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="h-10 px-6 rounded-md bg-[#00603B] text-white text-[13px] font-bold hover:bg-[#004f30] transition-colors disabled:opacity-70 disabled:pointer-events-none disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 min-w-[110px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SAVING...</span>
                  </>
                ) : (
                  "SAVE"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isPending}
                className="h-10 px-6 rounded-md bg-[#E2E8F0] text-gray-600 text-[13px] font-bold hover:bg-gray-300 transition-colors disabled:opacity-70"
              >
                RESET
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
