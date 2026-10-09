"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  MoreVertical,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchDisbursementsApi,
  IDisbursementRecord,
  IDisbursementFilterParams,
  TMeta,
} from "@/lib/disbursementApi";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";

export function DisbursementListView() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [disbursements, setDisbursements] = useState<IDisbursementRecord[]>([]);
  const [meta, setMeta] = useState<TMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const loadDisbursements = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const filters: IDisbursementFilterParams = {
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: pageNumber,
        limit: 10,
      };
      const res = await fetchDisbursementsApi(filters);
      setDisbursements(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to load disbursements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisbursements(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadDisbursements(1);
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Header matching Screenshot 1 & 3 ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Income Disbursement
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage and review income disbursements.
          </p>
        </div>

        {/* + INCOME DISBURS Button matching Screenshot 1 */}
        <Link
          href="/dashboard/income-disbursement/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 text-gray-600" />
          <span>INCOME DISBURS</span>
        </Link>
      </div>

      {/* ─── Card 1: Disbursement Information Filter Card matching Screenshot 1 ─── */}
      <div className="bg-[#F0F2F5]/80 rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          Disbursement Information
        </h2>

        <form onSubmit={handleShowFilter} className="flex flex-col md:flex-row items-end gap-4">
          {/* FROM DATE */}
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              FROM DATE
            </label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* TO DATE */}
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              TO DATE
            </label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* SHOW Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-7 py-2.5 bg-[#00B074] hover:bg-[#009663] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            SHOW
          </button>
        </form>
      </div>

      {/* ─── Card 2: Disbursement Listing matching Screenshot 1 & 3 ──────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">
            Disbursement Listing
          </h3>
          <button
            type="button"
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-[13px]">
            <thead className="bg-[#FAFBFD] border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 w-20">ID</th>
                <th className="py-3.5 px-6">MEMBER NAME</th>
                <th className="py-3.5 px-6">TOTAL AMOUNT</th>
                <th className="py-3.5 px-6">DISBURS DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowsSkeleton cols={4} rows={6} />
              ) : disbursements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12">
                    <EmptyState
                      title="No disbursements found"
                      description={
                        fromDate || toDate
                          ? "No income disbursements found for the selected date range."
                          : "No income disbursements have been processed yet."
                      }
                    />
                  </td>
                </tr>
              ) : (
                disbursements.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-semibold text-gray-700">
                      {item.disbursementId}
                    </td>

                    {/* MEMBER NAME */}
                    <td className="py-4 px-6 font-bold text-gray-900 uppercase">
                      {item.memberName}
                    </td>

                    {/* TOTAL AMOUNT (Vibrant Green matching Screenshot 1) */}
                    <td className="py-4 px-6 font-bold text-[#00B074]">
                      {(Number(item.disbursedAmount) || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* DISBURS DATE */}
                    <td className="py-4 px-6 text-gray-600">
                      {formatDateDisplay(item.disbursDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Footer Pagination matching Screenshot 1 ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-[#FCFDFE]">
          <div className="text-xs text-gray-500 font-medium">
            Showing 1–{disbursements.length} of {meta.total} entries
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => loadDisbursements(meta.page - 1)}
              className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-md bg-[#00B074] text-white flex items-center justify-center font-bold"
            >
              {meta.page}
            </button>
            <button
              type="button"
              disabled={meta.page >= meta.totalPage}
              onClick={() => loadDisbursements(meta.page + 1)}
              className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
