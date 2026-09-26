"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Download,
  Eye,
  Trash2,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import {
  fetchMembersApi,
  deleteMemberApi,
  type IMember,
} from "@/lib/memberApi";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { NotificationPopover } from "@/components/dashboard/NotificationPopover";

interface MemberListTableProps {
  onToggleMobileSidebar?: () => void;
}

export function MemberListTable({ onToggleMobileSidebar }: MemberListTableProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedMemberForDelete, setSelectedMemberForDelete] = useState<IMember | null>(null);

  // TanStack React Query
  const { data, isLoading } = useQuery({
    queryKey: ["members", searchTerm, page, limit],
    queryFn: () => fetchMembersApi({ searchTerm, page, limit }),
    staleTime: 30 * 1000,
  });

  const members = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 6, total: members.length, totalPage: 1 };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMemberApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setSelectedMemberForDelete(null);
    },
  });

  const handleDeleteConfirm = async () => {
    if (!selectedMemberForDelete) return;
    await deleteMutation.mutateAsync(selectedMemberForDelete._id);
  };

  const handleDownload = () => {
    // Generate CSV export
    const headers = "ID,Name,Email,Mobile,Total Deposit,Due Amount,Profession\n";
    const rows = members
      .map(
        (m) =>
          `"${m.memberCode}","${m.fullName}","${m.email}","${m.mobileNo}",${m.totalDeposit},${m.dueAmount},"${m.profession || ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `friends_goal_members_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ── 1. Top Header ────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight leading-tight">
              Member
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#64748B] mt-0.5">
              Manage and view all registered members
            </p>
          </div>
        </div>

        {/* Bell Notification Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-xs relative cursor-pointer"
            aria-label="Toggle notifications"
          >
            <Bell className="w-4 h-4 text-gray-700" />
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
              4
            </span>
          </button>

          <NotificationPopover
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
      </header>

      {/* ── 2. Top Bar Action Controls (Screenshot 2) ────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search members..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B074] focus:ring-2 focus:ring-emerald-100 transition-all shadow-xs"
          />
        </div>

        {/* Buttons: + Add Member & Download */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/member/create"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#00B074] hover:bg-[#009663] text-white text-[13px] font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[13px] font-semibold text-gray-700 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Download</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Dynamic Data Table (Screenshot 2) ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAFA] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">PICTURE</th>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">NAME</th>
                <th className="py-3.5 px-4">TOTAL DEPOSIT</th>
                <th className="py-3.5 px-4">DUE AMOUNT</th>
                <th className="py-3.5 px-4">MOBILE NO</th>
                <th className="py-3.5 px-4">PROFESSION</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#00B074] border-t-transparent animate-spin" />
                      <span>Loading members...</span>
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No members found matching &quot;{searchTerm}&quot;
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Picture */}
                    <td className="py-3 px-4">
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Image
                          src={member.pictureUrl || "/images/hero/hero-2.png"}
                          alt={member.fullName}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-4 font-medium text-gray-600">
                      {member.memberCode}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      <Link
                        href={`/dashboard/member/${member._id}`}
                        className="hover:text-[#00B074] transition-colors"
                      >
                        {member.fullName}
                      </Link>
                    </td>

                    {/* Total Deposit */}
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {member.totalDeposit.toLocaleString()}
                    </td>

                    {/* Due Amount */}
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      ${member.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Mobile No */}
                    <td className="py-3 px-4 text-gray-600 font-mono text-[12.5px]">
                      {member.mobileNo}
                    </td>

                    {/* Profession */}
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {member.profession || "Business"}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link
                          href={`/dashboard/member/${member._id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#00B074] hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="View / Edit Member"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedMemberForDelete(member)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── 4. Bottom Pagination (Screenshot 2) ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-[#FAFAFA] text-[12px] text-gray-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{meta.total}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className={`h-8 px-2.5 rounded-lg border text-[12px] font-medium transition-colors ${
                page <= 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-colors ${
                  page === p
                    ? "bg-[#00B074] text-white shadow-xs"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPage))}
              disabled={page >= meta.totalPage}
              className={`h-8 px-2.5 rounded-lg border text-[12px] font-medium transition-colors ${
                page >= meta.totalPage
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Two-step Safety Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!selectedMemberForDelete}
        onClose={() => setSelectedMemberForDelete(null)}
        onConfirm={handleDeleteConfirm}
        memberName={selectedMemberForDelete?.fullName || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
