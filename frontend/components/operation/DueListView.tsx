"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  Search,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchDueListApi,
  downloadExportFile,
  IDueListItem,
  IDueListFilterParams,
  TMeta,
} from "@/lib/operationApi";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";

export function DueListView({ initialStatus }: { initialStatus?: string }) {
  // State for filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [year, setYear] = useState("");

  const defaultStatus = initialStatus && ["All", "Advance", "Due", "Zero"].includes(initialStatus)
    ? (initialStatus as "All" | "Advance" | "Due" | "Zero")
    : "All";

  const [statusFilter, setStatusFilter] = useState<"All" | "Advance" | "Due" | "Zero">(defaultStatus);

  // State for data
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IDueListItem[]>([]);
  const [meta, setMeta] = useState<TMeta>({ page: 1, limit: 6, total: 0, totalPage: 1 });
  const [counts, setCounts] = useState({ total: 0, advance: 0, due: 0, zero: 0 });

  // Download menu dropdown state
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close download dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data
  const loadDueList = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const filters: IDueListFilterParams = {
        searchByCodeOrName: search || undefined,
        year: year || undefined,
        status: statusFilter,
        dateRange: dateRange || undefined,
        page: pageNumber,
        limit: 6,
      };
      const res = await fetchDueListApi(filters);
      setData(res.data);
      if (res.meta) setMeta(res.meta);
      const rawCounts = (res as any).counts;
      const rawMeta = (res as any).meta;

      const totalVal = rawCounts?.total ?? rawMeta?.allCount ?? rawMeta?.total ?? 0;
      const advanceVal = rawCounts?.advance ?? rawMeta?.advanceCount ?? 0;
      const dueVal = rawCounts?.due ?? rawMeta?.dueCount ?? 0;
      const zeroVal = rawCounts?.zero ?? rawMeta?.zeroCount ?? 0;

      setCounts({
        total: Number(totalVal) || 0,
        advance: Number(advanceVal) || 0,
        due: Number(dueVal) || 0,
        zero: Number(zeroVal) || 0,
      });
    } catch (err) {
      console.error("Failed to load due list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDueList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, year, statusFilter, dateRange]);

  const handleExport = async (type: "pdf" | "excel") => {
    try {
      setIsExporting(true);
      setDownloadOpen(false);
      await downloadExportFile(type, {
        searchByCodeOrName: search || undefined,
        year: year || undefined,
        status: statusFilter,
        dateRange: dateRange || undefined,
      });
    } catch (err: any) {
      toast.error("Export failed: " + (err.message || "Unknown error"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Due List</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track member receivables.</p>
        </div>

        {/* Download Button with Dropdown (STRICT: PDF and Excel only, NO CSV) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDownloadOpen(!downloadOpen)}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#00B074]" />
            ) : (
              <Download className="w-4 h-4 text-gray-500" />
            )}
            <span>{isExporting ? "Generating..." : "Download"}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {downloadOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Export Options (No CSV)
              </div>
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
              >
                <FileText className="w-4 h-4 text-red-500" />
                <div>
                  <div className="font-medium">Download PDF</div>
                  <div className="text-[11px] text-gray-400">Branded printable PDF</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleExport("excel")}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-medium">Download Excel (.xlsx)</div>
                  <div className="text-[11px] text-gray-400">Formatted spreadsheet</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Filters Card matching Screenshot 1 ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          RECEIVABLE INFORMATION FILTERS
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search By ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Search By ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter Member ID"
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all"
              />
            </div>
          </div>

          {/* Select Month */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Select Month</label>
            <div className="relative">
              <input
                type="month"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all"
              />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year</label>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full appearance-none px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074] transition-all cursor-pointer"
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Status Filter Pills matching Screenshot 1 ──────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* All */}
        <button
          type="button"
          onClick={() => setStatusFilter("All")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${statusFilter === "All"
              ? "bg-[#00B074] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          <span>All</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${statusFilter === "All" ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
              }`}
          >
            {counts.total}
          </span>
        </button>

        {/* Advance */}
        <button
          type="button"
          onClick={() => setStatusFilter("Advance")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${statusFilter === "Advance"
              ? "bg-[#00B074] text-white shadow-xs"
              : "bg-[#EAF8F1] text-[#00B074] hover:bg-[#d8f3e5]"
            }`}
        >
          <span>Advance</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${statusFilter === "Advance" ? "bg-white/25 text-white" : "bg-[#00B074]/15 text-[#00B074]"
              }`}
          >
            {counts.advance}
          </span>
        </button>

        {/* Due */}
        <button
          type="button"
          onClick={() => setStatusFilter("Due")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${statusFilter === "Due"
              ? "bg-[#DC2626] text-white shadow-xs"
              : "bg-[#FEE2E2] text-[#DC2626] hover:bg-[#fed2d2]"
            }`}
        >
          <span>Due</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${statusFilter === "Due" ? "bg-white/25 text-white" : "bg-[#DC2626]/15 text-[#DC2626]"
              }`}
          >
            {counts.due}
          </span>
        </button>

        {/* Zero */}
        <button
          type="button"
          onClick={() => setStatusFilter("Zero")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${statusFilter === "Zero"
              ? "bg-gray-800 text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          <span>Zero</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${statusFilter === "Zero" ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
              }`}
          >
            {counts.zero}
          </span>
        </button>
      </div>

      {/* ─── Due List Table matching Screenshot 1 ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#FAFBFD] border-b border-gray-200/80 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">ID (CODE)</th>
                <th className="py-3.5 px-6">MEMBER NAME</th>
                <th className="py-3.5 px-6">MOBILE NO</th>
                <th className="py-3.5 px-6 text-right">DUE AMOUNT</th>
                <th className="py-3.5 px-6 text-right">STATUS / REMARKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowsSkeleton cols={5} rows={6} />
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12">
                    <EmptyState
                      title="No receivable records found"
                      description={
                        search
                          ? "No member records match your search criteria."
                          : "No member receivable or due records are currently available."
                      }
                    />
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-medium text-gray-700">
                      {item.memberCode}
                    </td>

                    {/* Member Name */}
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {item.memberName}
                    </td>

                    {/* Mobile No */}
                    <td className="py-4 px-6 text-gray-500 font-normal">
                      {item.mobileNo}
                    </td>

                    {/* Due Amount */}
                    <td
                      className={`py-4 px-6 text-right font-bold ${item.status === "Due"
                          ? "text-[#EF4444]"
                          : item.status === "Advance"
                            ? "text-gray-900"
                            : "text-gray-800"
                        }`}
                    >
                      {item.status === "Advance"
                        ? (Number(item.advanceBalance) || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                        : (Number(item.dueAmount) || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-right">
                      {item.status === "Advance" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EAF8F1] text-[#00B074]">
                          Advance
                        </span>
                      )}
                      {item.status === "Due" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#DC2626]">
                          Due
                        </span>
                      )}
                      {item.status === "Zero" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Zero
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination Footer matching Screenshot 1 ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-[#FCFDFE]">
          <div className="text-xs text-gray-400">
            Showing {Math.min((meta.page - 1) * meta.limit + 1, meta.total)} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium">
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => loadDueList(meta.page - 1)}
              className="px-2.5 py-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              Prev
            </button>

            {Array.from({ length: meta.totalPage || 1 }).map((_, i) => {
              const p = i + 1;
              if (p > 5 && p < meta.totalPage) {
                if (p === 6) return <span key={p} className="px-1 text-gray-400">...</span>;
                return null;
              }
              const isActive = meta.page === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => loadDueList(p)}
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-semibold transition-all cursor-pointer ${isActive
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
              onClick={() => loadDueList(meta.page + 1)}
              className="px-2.5 py-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
