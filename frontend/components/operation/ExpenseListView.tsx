"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  FileText,
  Pencil,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchExpensesApi,
  IExpenseRecord,
  TMeta,
} from "@/lib/expenseApi";
import { ExpenseVoucherModal } from "./ExpenseVoucherModal";
import { ExportDropdown } from "@/components/shared";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";

export function ExpenseListView() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<IExpenseRecord[]>([]);
  const [meta, setMeta] = useState<TMeta>({ page: 1, limit: 10, total: 0, totalPage: 1 });

  // Voucher preview modal state
  const [selectedExpense, setSelectedExpense] = useState<IExpenseRecord | null>(null);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  const loadExpenses = async (pageNumber: number = 1, searchVal: string = activeSearch) => {
    setLoading(true);
    try {
      const res = await fetchExpensesApi({
        search: searchVal || undefined,
        page: pageNumber,
        limit: 10,
      });
      setExpenses(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
    loadExpenses(1, searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPage) return;
    loadExpenses(newPage, activeSearch);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleOpenVoucher = (item: IExpenseRecord) => {
    setSelectedExpense(item);
    setIsVoucherOpen(true);
  };

  const handleEdit = (item: IExpenseRecord) => {
    router.push(`/dashboard/expense/create?editId=${item.expenseId}`);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Header Actions matching Screenshot 1 ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Expense Information
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar matching Screenshot 1 */}
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search For..."
                className="w-48 sm:w-64 pl-10 pr-3 py-2 text-xs sm:text-sm bg-white border border-r-0 border-gray-300 rounded-l-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#334155] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-bold tracking-wider rounded-r-lg transition-colors cursor-pointer uppercase flex items-center justify-center h-[38px] sm:h-[40px]"
            >
              SEARCH
            </button>
          </form>

          <ExportDropdown endpointUrl="/api/v1/reports/expense/export" defaultFilename="Expense_Report" />

          {/* + ADD NEW Primary Green Button matching Screenshot 1 */}
          <Link
            href="/dashboard/expense/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00B074] hover:bg-[#009663] text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer uppercase tracking-wider h-[38px] sm:h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW</span>
          </Link>
        </div>
      </div>

      {/* ─── Expense Information Data Table matching Screenshot 1 ─────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-[13px]">
            <thead className="bg-[#FAFBFD] border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5 w-16">ID</th>
                <th className="py-3.5 px-5">MEMBER NAME</th>
                <th className="py-3.5 px-5">EXPENSE HEAD</th>
                <th className="py-3.5 px-5">EXPENSE DATE</th>
                <th className="py-3.5 px-5 text-right">AMOUNT</th>
                <th className="py-3.5 px-5">REMARKS</th>
                <th className="py-3.5 px-5 text-center w-20">REPORTS</th>
                <th className="py-3.5 px-5 text-center w-20">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowsSkeleton cols={8} rows={6} />
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12">
                    <EmptyState
                      title="No expenses found"
                      description={
                        searchTerm
                          ? "No expense records match your search criteria."
                          : "No expenses have been recorded yet."
                      }
                    />
                  </td>
                </tr>
              ) : (
                expenses.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-4 px-5 font-semibold text-gray-700">
                      {item.expenseId}
                    </td>

                    {/* MEMBER NAME */}
                    <td className="py-4 px-5 font-bold text-gray-900 uppercase">
                      {item.memberName}
                    </td>

                    {/* EXPENSE HEAD */}
                    <td className="py-4 px-5 text-gray-700 font-medium">
                      {item.expenseHead}
                    </td>

                    {/* EXPENSE DATE */}
                    <td className="py-4 px-5 text-gray-600">
                      {formatDate(item.expenseDate)}
                    </td>

                    {/* AMOUNT */}
                    <td className="py-4 px-5 text-right font-bold text-gray-900">
                      {(Number(item.amount) || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* REMARKS */}
                    <td className="py-4 px-5 text-gray-600 text-xs max-w-xs truncate" title={item.remarks}>
                      {item.remarks}
                    </td>

                    {/* REPORTS (Document Icon Button) */}
                    <td className="py-4 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenVoucher(item)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-[#00B074] hover:bg-emerald-50 transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="View & Print Voucher"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>

                    {/* ACTION (Edit Pencil Icon Button) */}
                    <td className="py-4 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Edit Expense"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
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
            Showing {meta.total === 0 ? 0 : Math.min((meta.page - 1) * meta.limit + 1, meta.total)} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {/* Prev */}
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => handlePageChange(meta.page - 1)}
              className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(meta.totalPage, 3) }, (_, i) => i + 1).map((p) => {
              const isActive = meta.page === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#00B074] text-white font-bold"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {meta.totalPage > 3 && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-400">
                ...
              </span>
            )}

            {/* Next */}
            <button
              type="button"
              disabled={meta.page >= meta.totalPage}
              onClick={() => handlePageChange(meta.page + 1)}
              className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Voucher Preview Modal */}
      <ExpenseVoucherModal
        expense={selectedExpense}
        isOpen={isVoucherOpen}
        onClose={() => setIsVoucherOpen(false)}
      />
    </div>
  );
}
