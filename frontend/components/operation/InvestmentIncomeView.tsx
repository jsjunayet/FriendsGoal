"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { investmentIncomeApi } from "@/lib/investmentIncomeApi";
import { ExportDropdown } from "@/components/shared";

export function InvestmentIncomeView() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ fromDate: "", toDate: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["investment-incomes", appliedFilters],
    queryFn: () => investmentIncomeApi.getInvestmentIncomes(appliedFilters),
  });

  const handleShow = () => {
    setAppliedFilters({ fromDate, toDate });
  };

  const incomes = data?.incomes || [];
  const totalIncome = data?.totalIncome || 0;
  const totalRecords = data?.totalRecords || 0;

  const queryParamsStr = new URLSearchParams();
  if (appliedFilters.fromDate) queryParamsStr.append("fromDate", appliedFilters.fromDate);
  if (appliedFilters.toDate) queryParamsStr.append("toDate", appliedFilters.toDate);
  const exportUrl = `/api/v1/reports/investments/export${queryParamsStr.toString() ? `?${queryParamsStr.toString()}` : ""}`;

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
            Investments Income Reports
          </h1>
        </div>
        <Link
          href="/dashboard/investment-income/create"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#00603B] text-white text-[13px] font-bold hover:bg-[#004f30] transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          ADD NEW
        </Link>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-3">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          FILTER — LEAVE BLANK TO SHOW ALL
        </span>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[12px] font-semibold text-gray-600">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00603B]/20 focus:border-[#00603B] transition-shadow"
            />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[12px] font-semibold text-gray-600">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00603B]/20 focus:border-[#00603B] transition-shadow"
            />
          </div>
          <button
            onClick={handleShow}
            className="h-10 px-6 rounded-lg bg-[#00603B] text-white text-[13px] font-bold hover:bg-[#004f30] transition-colors"
          >
            SHOW
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#EEFFF6] border border-[#C5F4D7] rounded-xl p-6 shadow-sm flex flex-col gap-1">
          <span className="text-[12px] font-bold text-[#00603B] uppercase tracking-wider">
            TOTAL INCOME
          </span>
          <span className="text-[32px] font-bold text-[#00603B]">
            ৳ {totalIncome.toLocaleString()}
          </span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-1">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
            RECORDS
          </span>
          <span className="text-[32px] font-bold text-[#0F172A]">
            {totalRecords}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#0F172A]">
            {totalRecords} records
          </h3>
          <ExportDropdown
            endpointUrl={exportUrl}
            defaultFilename="Investments_Income_Report"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["ID", "INVESTMENT NAME", "DATE", "AMOUNT", "REMARKS"].map((th) => (
                  <th key={th} className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 text-[14px]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#00603B] border-t-transparent rounded-full animate-spin"></div>
                      Loading records...
                    </div>
                  </td>
                </tr>
              ) : incomes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 text-[14px]">
                    No investment income records found.
                  </td>
                </tr>
              ) : (
                incomes.map((item: any, idx: number) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5 text-[13px] text-gray-500 font-medium">
                      {item.numericId || idx + 1}
                    </td>
                    <td className="py-4 px-5 text-[14px] text-gray-700 font-medium whitespace-nowrap">
                      {item.investmentName}
                    </td>
                    <td className="py-4 px-5 text-[13px] text-gray-500">
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }).replace(/ /g, '-')}
                    </td>
                    <td className="py-4 px-5 text-[14px] font-bold text-[#00B074]">
                      +{item.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-[13px] text-gray-500">
                      {item.remarks}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
