"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  ChevronDown,
  Loader2,
  AlertCircle,
  Mail,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchNoticeSchedulesApi,
  deleteNoticeScheduleApi,
  INoticeScheduleItem,
  NoticeScheduleType,
} from "@/lib/noticeScheduleApi";

export function NoticeScheduleListView() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All types");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["notice-schedules", selectedType, search],
    queryFn: () =>
      fetchNoticeSchedulesApi({
        type: selectedType,
        search,
      }),
  });

  const totalPages = Math.ceil(notices.length / ITEMS_PER_PAGE) || 1;
  const paginatedNotices = notices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNoticeScheduleApi(id),
    onSuccess: () => {
      toast.success("Notice schedule deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["notice-schedules"] });
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete notice schedule");
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete notice "${title}"?`)) {
      setDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  const meetingCount = notices.filter((n) => n.type === "Meeting").length;

  const getTypeBadgeStyle = (type: NoticeScheduleType) => {
    switch (type) {
      case "Fee Reminder":
        return "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]";
      case "Meeting":
        return "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]";
      case "Invitation":
        return "bg-[#F3E8FF] text-[#9333EA] border border-[#E9D5FF]";
      case "Important Notice":
      default:
        return "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]";
    }
  };

  const formatDateTime = (item: INoticeScheduleItem) => {
    if (item.type === "Fee Reminder") {
      return item.dueDate || "N/A";
    }
    if (item.eventDate) {
      return item.time ? `${item.eventDate} ${item.time}` : item.eventDate;
    }
    if (item.createdAt) {
      return new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "N/A";
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Header matching Screenshot 3 ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-gray-900 tracking-tight">
            Notice Schedule
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Publish fee reminders, important notices, invitations, and member meetings directly to members.
          </p>
        </div>

        <Link
          href="/dashboard/notice-schedule/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] font-bold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gray-600" />
          <span>Create Notice</span>
        </Link>
      </div>

      {/* ─── Card Container matching Screenshot 3 ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {/* Card Header with Counts & Search/Filter */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-[18px] sm:text-[20px] font-bold text-gray-900">
              Notices & meetings
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {notices.length} items · {meetingCount} meetings
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notices or meetings"
                className="w-full pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Type Filter Dropdown */}
            <div className="relative min-w-[140px]">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] cursor-pointer"
              >
                <option value="All types">All types</option>
                <option value="Fee Reminder">Fee Reminder</option>
                <option value="Important Notice">Important Notice</option>
                <option value="Invitation">Invitation</option>
                <option value="Meeting">Meeting</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table View matching Screenshot 3 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAFA]/70">
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  TYPE
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  TITLE & DETAILS
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  DATE / TIME
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  AUDIENCE
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00B074]" />
                    <p className="text-xs mt-2">Loading notice schedules...</p>
                  </td>
                </tr>
              ) : notices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-xs">
                    No notice schedules found matching your query.
                  </td>
                </tr>
              ) : (
                paginatedNotices.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* TYPE */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block text-[11.5px] font-semibold px-3 py-1 rounded-full ${getTypeBadgeStyle(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                    </td>

                    {/* TITLE & DETAILS */}
                    <td className="py-4 px-6 max-w-md">
                      <Link
                        href={`/dashboard/notice-schedule/${item._id}`}
                        className="block font-serif font-bold text-gray-900 text-[14px] hover:text-[#00B074] transition-colors leading-snug"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {item.message || item.agenda || "No additional description"}
                      </p>
                    </td>

                    {/* DATE / TIME */}
                    <td className="py-4 px-6 whitespace-nowrap text-xs text-gray-700 font-medium">
                      {formatDateTime(item)}
                    </td>

                    {/* AUDIENCE */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {item.audience === "Specific member" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200" title={`Targeted to ${item.targetMemberName} (${item.targetMemberCode})`}>
                          Specific: {item.targetMemberName || item.targetMemberCode || "1 Member"}
                        </span>
                      ) : item.audience === "Due members" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Due members only
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                          {item.audience || "All members"}
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/notice-schedule/create?editId=${item._id}`}
                          className="p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                          title="Edit notice"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.title)}
                          disabled={deletingId === item._id}
                          className="p-1 text-[#EF4444] hover:text-[#DC2626] transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete notice"
                        >
                          {deletingId === item._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#EF4444]" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 bg-gray-50/40">
            <span className="text-xs text-gray-500 font-medium">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, notices.length)} of {notices.length} notices
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#2B5A27] text-white shadow-xs"
                      : "text-gray-600 hover:bg-white border border-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
