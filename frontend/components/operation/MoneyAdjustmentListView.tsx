"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchAdjustmentsApi,
  IAdjustmentRecord,
  IAdjustmentFilterParams,
  TMeta,
} from "@/lib/adjustmentApi";
import { ExportDropdown } from "@/components/shared";

export function MoneyAdjustmentListView() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [adjustments, setAdjustments] = useState<IAdjustmentRecord[]>([]);
  const [meta, setMeta] = useState<TMeta>({ page: 1, limit: 10, total: 15, totalPage: 3 });

  const loadAdjustments = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const filters: IAdjustmentFilterParams = {
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: pageNumber,
        limit: 10,
      };
      const res = await fetchAdjustmentsApi(filters);
      setAdjustments(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to load adjustments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdjustments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadAdjustments(1);
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const month = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Header matching Screenshot 2 ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Money Adjustment</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and review financial adjustments.</p>
        </div>

        <div className="flex items-center gap-3">
          <ExportDropdown endpointUrl="/api/v1/reports/adjustments/export" defaultFilename="Adjustments_Report" />

          {/* + MONEY ADJUST Button */}
          <Link
            href="/dashboard/money-adjustment/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Money Adjust</span>
          </Link>
        </div>
      </div>

      {/* ─── Adjustment Information Filter Card matching Screenshot 2 ──────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        <h2 className="text-base font-bold text-gray-800 mb-4">Adjustment Information</h2>

        <form onSubmit={handleShowFilter} className="flex flex-col md:flex-row items-end gap-4">
          {/* From Date */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">From Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="mm/dd/yyyy"
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">To Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="mm/dd/yyyy"
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all"
              />
            </div>
          </div>

          {/* SHOW Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-7 py-2 bg-[#00684A] hover:bg-[#00523a] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer uppercase tracking-wider h-[38px] flex items-center justify-center"
          >
            SHOW
          </button>
        </form>
      </div>

      {/* ─── Adjustment Listing Card matching Screenshot 2 ──────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {/* Card Header with title and 3-dots */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Adjustment Listing</h2>
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#FAFBFD] border-b border-gray-200/80 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Id</th>
                <th className="py-3 px-6">MemberName</th>
                <th className="py-3 px-6">AdjustmentTypeName</th>
                <th className="py-3 px-6">AdjustmentDate</th>
                <th className="py-3 px-6 text-right">AdjustmentAmount</th>
                <th className="py-3 px-6">Remarks</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#00B074] mb-2" />
                    Loading adjustments...
                  </td>
                </tr>
              ) : adjustments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No adjustment records found for selected period.
                  </td>
                </tr>
              ) : (
                adjustments.map((item, idx) => {
                  const isNegative = item.signedAmount < 0;
                  return (
                    <tr
                      key={item._id || idx}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      {/* Id */}
                      <td className="py-4 px-6 font-semibold text-gray-700">
                        {item.adjustmentId}
                      </td>

                      {/* MemberName */}
                      <td className="py-4 px-6 font-bold text-gray-900 uppercase">
                        {item.memberName}
                      </td>

                      {/* AdjustmentTypeName */}
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {item.adjustmentTypeName}
                      </td>

                      {/* AdjustmentDate */}
                      <td className="py-4 px-6 text-gray-600">
                        {formatDateDisplay(item.adjustmentDate)}
                      </td>

                      {/* AdjustmentAmount (Color Coded: Red for Debits, Green for Credits) */}
                      <td
                        className={`py-4 px-6 text-right font-bold ${
                          isNegative ? "text-[#DC2626]" : "text-[#00B074]"
                        }`}
                      >
                        {isNegative ? "" : ""}
                        {item.signedAmount.toFixed(2)}
                      </td>

                      {/* Remarks */}
                      <td className="py-4 px-6 text-gray-600 text-xs max-w-xs truncate">
                        {item.remarks}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-center">
                        <Link
                          href={`/dashboard/money-adjustment/create?editId=${item.adjustmentId}`}
                          className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors inline-flex items-center justify-center cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination matching Screenshot 2 ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-[#FCFDFE]">
          <div className="text-xs text-gray-500">
            Showing {Math.min((meta.page - 1) * meta.limit + 1, meta.total)} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium">
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => loadAdjustments(meta.page - 1)}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: meta.totalPage || 1 }).map((_, i) => {
              const p = i + 1;
              const isActive = meta.page === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => loadAdjustments(p)}
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#00B074] text-white shadow-xs"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={meta.page >= meta.totalPage}
              onClick={() => loadAdjustments(meta.page + 1)}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
