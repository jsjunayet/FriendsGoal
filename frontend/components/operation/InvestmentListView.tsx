"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  CheckCircle,
  RefreshCw,
  PowerOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchInvestmentsApi,
  closeInvestmentApi,
  IInvestmentRecord,
  TMeta,
} from "@/lib/investmentApi";

export function InvestmentListView() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<IInvestmentRecord[]>([]);
  const [meta, setMeta] = useState<TMeta>({ page: 1, limit: 10, total: 4, totalPage: 1 });
  const [closingId, setClosingId] = useState<string | null>(null);

  const loadInvestments = async (pageNumber: number = 1, searchVal: string = searchTerm) => {
    setLoading(true);
    try {
      const res = await fetchInvestmentsApi({
        search: searchVal || undefined,
        page: pageNumber,
        limit: 10,
      });
      setInvestments(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to load investments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    loadInvestments(1, val);
  };

  const handleCloseInvestment = async (item: IInvestmentRecord) => {
    if (!confirm(`Are you sure you want to close investment "${item.name}"? End date will be set to today.`)) {
      return;
    }

    try {
      setClosingId(item._id);
      const updated = await closeInvestmentApi(item._id || item.investmentId);
      setInvestments((prev) =>
        prev.map((i) => (i._id === item._id || i.investmentId === item.investmentId ? updated : i))
      );
    } catch (err: any) {
      alert("Failed to close investment: " + (err.message || "Unknown error"));
    } finally {
      setClosingId(null);
    }
  };

  const handleEdit = (item: IInvestmentRecord) => {
    router.push(`/dashboard/investment/create?editId=${item.investmentId}`);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
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
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* ─── Top Header matching Screenshot 1 ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Investment Information
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track and manage all investment portfolios.
          </p>
        </div>

        {/* + Add New Primary Green Button */}
        <Link
          href="/dashboard/investment/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00B074] hover:bg-[#009663] text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New</span>
        </Link>
      </div>

      {/* ─── Table Card matching Screenshot 1 ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {/* Sub-header: record count & search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="text-xs font-semibold text-gray-700">
            {meta.total} records
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search investments..."
              className="w-56 sm:w-64 pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-[13px]">
            <thead className="bg-[#FAFBFD] border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 w-16">ID</th>
                <th className="py-3.5 px-6">NAME</th>
                <th className="py-3.5 px-6">START DATE</th>
                <th className="py-3.5 px-6">END DATE</th>
                <th className="py-3.5 px-6 text-right">AMOUNT</th>
                <th className="py-3.5 px-6">REMARKS</th>
                <th className="py-3.5 px-6 text-center w-24">STATUS</th>
                <th className="py-3.5 px-6 text-center w-24">ACTIVE</th>
                <th className="py-3.5 px-6 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#00B074] mb-2" />
                    Loading investments...
                  </td>
                </tr>
              ) : investments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400">
                    No investment records found.
                  </td>
                </tr>
              ) : (
                investments.map((item, idx) => {
                  const isRunning = item.status === "Running";
                  return (
                    <tr
                      key={item._id || idx}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-4 px-6 font-semibold text-gray-600">
                        {item.investmentId}
                      </td>

                      {/* NAME */}
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {item.name}
                      </td>

                      {/* START DATE */}
                      <td className="py-4 px-6 text-gray-600">
                        {formatDate(item.startDate)}
                      </td>

                      {/* END DATE */}
                      <td className="py-4 px-6 text-gray-600">
                        {formatDate(item.endDate)}
                      </td>

                      {/* AMOUNT */}
                      <td className="py-4 px-6 text-right font-bold text-gray-900">
                        {(Number(item.amount) || 0).toLocaleString("en-US")}
                      </td>

                      {/* REMARKS */}
                      <td className="py-4 px-6 text-gray-600 text-xs max-w-xs truncate" title={item.remarks}>
                        {item.remarks}
                      </td>

                      {/* STATUS Badge matching Screenshot 1 */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                            isRunning
                              ? "bg-[#EAF8F1] text-[#00B074]"
                              : "bg-[#F3F4F6] text-[#6B7280]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTIVE Badge matching Screenshot 1 */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                            item.isActive
                              ? "bg-[#EAF8F1] text-[#00B074]"
                              : "bg-[#F3F4F6] text-[#6B7280]"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* ACTION (Close Investment & Edit) */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Close Investment button for running portfolios */}
                          {isRunning ? (
                            <button
                              type="button"
                              onClick={() => handleCloseInvestment(item)}
                              disabled={closingId === item._id}
                              title="Close Investment (Set End Date to Today)"
                              className="px-2 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <PowerOff className="w-3 h-3 text-amber-600" />
                              <span>Close</span>
                            </button>
                          ) : (
                            <span className="p-1 text-gray-300" title="Investment is closed">
                              <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                          )}

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            title="Edit Investment"
                            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination if multiple pages */}
        {meta.totalPage > 1 && (
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-[#FCFDFE]">
            <div className="text-xs text-gray-500 font-medium">
              Showing {Math.min((meta.page - 1) * meta.limit + 1, meta.total)} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() => loadInvestments(meta.page - 1)}
                className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-md bg-[#00B074] text-white flex items-center justify-center font-bold"
              >
                {meta.page}
              </button>
              <button
                type="button"
                disabled={meta.page >= meta.totalPage}
                onClick={() => loadInvestments(meta.page + 1)}
                className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
