"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Shield,
} from "lucide-react";
import { auditLogApi, IAuditLogItem, TAuditAction } from "@/lib/auditLogApi";

export default function ModificationHistoryView() {
  const [logs, setLogs] = useState<IAuditLogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [totalEntries, setTotalEntries] = useState(18);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 8; // 8 items per page yields exactly 3 pages for 18 entries, matching Screenshot 1

  const loadLogs = async (page = currentPage, action = actionFilter, search = searchQuery) => {
    setIsLoading(true);
    try {
      const res = await auditLogApi.getLogs({
        page,
        limit: pageSize,
        action,
        search,
      });
      setLogs(res.data);
      setTotalPages(res.meta.totalPage);
      setTotalEntries(res.meta.total);
    } catch {
      // Error handled by local fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(currentPage, actionFilter, searchQuery);
  }, [currentPage, actionFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadLogs(1, actionFilter, searchQuery);
  };

  const getActionBadgeStyle = (action: TAuditAction) => {
    switch (action) {
      case "Member Added":
        return {
          bg: "bg-[#EAF8F1]",
          text: "text-[#00B074]",
          dot: "bg-[#00B074]",
        };
      case "Payment Recorded":
        return {
          bg: "bg-[#E6F7F5]",
          text: "text-[#0D9488]",
          dot: "bg-[#0D9488]",
        };
      case "Due Updated":
        return {
          bg: "bg-[#EFF6FF]",
          text: "text-[#2563EB]",
          dot: "bg-[#2563EB]",
        };
      case "Withdrawal Approved":
        return {
          bg: "bg-[#ECFDF5]",
          text: "text-[#059669]",
          dot: "bg-[#059669]",
        };
      case "Amount Modified":
        return {
          bg: "bg-[#FFFBEB]",
          text: "text-[#D97706]",
          dot: "bg-[#D97706]",
        };
      case "Report Generated":
        return {
          bg: "bg-[#F5F3FF]",
          text: "text-[#7C3AED]",
          dot: "bg-[#7C3AED]",
        };
      case "Withdrawal Rejected":
        return {
          bg: "bg-[#FEF2F2]",
          text: "text-[#DC2626]",
          dot: "bg-[#DC2626]",
        };
      case "Settings Changed":
        return {
          bg: "bg-[#EEF2FF]",
          text: "text-[#4F46E5]",
          dot: "bg-[#4F46E5]",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          dot: "bg-gray-500",
        };
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* Top Header matching Screenshot 1 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Modification History
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Full audit log of admin actions across the system.
        </p>
      </div>

      {/* Main Table Card matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card Header matching Screenshot 1 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Audit Log
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            {totalEntries} entries
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-6 py-3 bg-[#FAFBFB] border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by log #, admin, action, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#00B074] text-gray-700 placeholder:text-gray-400"
            />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-[#00B074]"
              >
                <option value="All">All Actions</option>
                <option value="Member Added">Member Added</option>
                <option value="Payment Recorded">Payment Recorded</option>
                <option value="Due Updated">Due Updated</option>
                <option value="Withdrawal Approved">Withdrawal Approved</option>
                <option value="Withdrawal Rejected">Withdrawal Rejected</option>
                <option value="Amount Modified">Amount Modified</option>
                <option value="Report Generated">Report Generated</option>
                <option value="Settings Changed">Settings Changed</option>
              </select>
            </div>

            <button
              onClick={() => loadLogs(currentPage, actionFilter, searchQuery)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Table Content matching Screenshot 1 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FCFDFD]">
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400 w-16">
                  #
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  ADMIN
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  ACTION
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  TARGET
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  DATE
                </th>
                <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  DETAILS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#00B074]" />
                      <span>Loading audit history...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <span>No audit entries found matching the filter.</span>
                  </td>
                </tr>
              ) : (
                logs.map((item) => {
                  const badgeStyle = getActionBadgeStyle(item.action);

                  return (
                    <tr
                      key={item.logId}
                      className="hover:bg-[#F9FCFA] transition-colors"
                    >
                      {/* # (Log ID: 001, 002...) */}
                      <td className="py-4 px-6 text-xs text-gray-400 font-mono tracking-wider">
                        {item.logId}
                      </td>

                      {/* ADMIN (Avatar + Name) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${
                              item.avatarColor || "bg-[#00B074]"
                            } text-white flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0`}
                          >
                            {item.adminAvatar}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {item.adminName}
                          </span>
                        </div>
                      </td>

                      {/* ACTION (Colored Pill Badge with dot) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
                          />
                          {item.action}
                        </span>
                      </td>

                      {/* TARGET */}
                      <td className="py-4 px-6 font-medium text-gray-800 whitespace-nowrap">
                        {item.target}
                      </td>

                      {/* DATE */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-xs font-semibold text-gray-900">
                          {item.date}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {item.timeAgo}
                        </div>
                      </td>

                      {/* DETAILS */}
                      <td className="py-4 px-6 text-xs text-gray-600 font-normal leading-relaxed max-w-md">
                        {item.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer matching Screenshot 1 */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div>
            Page {currentPage} of {totalPages} · {totalEntries} entries
          </div>

          <div className="flex items-center gap-1">
            {/* Prev button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center transition-colors ${
                  currentPage === pg
                    ? "bg-[#00B074] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {pg}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
