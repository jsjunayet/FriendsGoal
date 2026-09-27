"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Radio,
  FileText,
  ChevronUp,
  ChevronDown,
  LogOut,
  Bell,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ isMobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  // Accordion states - open by default as shown in screenshots
  const [operationOpen, setOperationOpen] = useState(true);
  const [reportOpen, setReportOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isFinancialAnalyticsActive =
    pathname === "/dashboard" || pathname === "/admin/dashboard";

  const isDashboardActive =
    pathname === "/dashboard" || pathname === "/admin/dashboard";

  const isMemberActive =
    pathname === "/dashboard/member" ||
    pathname.startsWith("/dashboard/member/") ||
    pathname.includes("/members");

  const isDueListActive =
    pathname === "/dashboard/due-list" ||
    pathname === "/admin/dashboard/due-list" ||
    pathname.includes("/due-list");

  const isCollectionActive =
    pathname === "/dashboard/collection" ||
    pathname === "/admin/dashboard/collection" ||
    pathname.includes("/collection");

  const isAdjustmentActive =
    pathname === "/dashboard/money-adjustment" ||
    pathname.startsWith("/dashboard/money-adjustment") ||
    pathname === "/admin/dashboard/money-adjustment" ||
    pathname.startsWith("/admin/dashboard/money-adjustment") ||
    pathname.includes("adjustment");

  const isExpenseActive =
    pathname === "/dashboard/expense" ||
    pathname.startsWith("/dashboard/expense") ||
    pathname === "/admin/dashboard/expense" ||
    pathname.startsWith("/admin/dashboard/expense") ||
    pathname.includes("expense");

  const isInvestmentActive =
    pathname === "/dashboard/investment" ||
    pathname.startsWith("/dashboard/investment") ||
    pathname === "/admin/dashboard/investment" ||
    pathname.startsWith("/admin/dashboard/investment") ||
    pathname.includes("investment");

  const isDisbursementActive =
    pathname === "/dashboard/income-disbursement" ||
    pathname.startsWith("/dashboard/income-disbursement") ||
    pathname === "/admin/dashboard/income-disbursement" ||
    pathname.startsWith("/admin/dashboard/income-disbursement") ||
    pathname.includes("income-disbursement") ||
    pathname.includes("disburs");

  const isWithdrawalsActive =
    pathname === "/dashboard/withdrawals" ||
    pathname.startsWith("/dashboard/withdrawals") ||
    pathname === "/admin/dashboard/withdrawals" ||
    pathname.startsWith("/admin/dashboard/withdrawals") ||
    pathname === "/admin/withdrawals" ||
    pathname.startsWith("/admin/withdrawals") ||
    pathname.includes("withdraw");

  const isAuditLogActive =
    pathname === "/dashboard/audit-logs" ||
    pathname.startsWith("/dashboard/audit-logs") ||
    pathname === "/dashboard/modification-history" ||
    pathname.startsWith("/dashboard/modification-history") ||
    pathname === "/admin/dashboard/audit-logs" ||
    pathname.startsWith("/admin/dashboard/audit-logs") ||
    pathname === "/admin/audit-logs" ||
    pathname.startsWith("/admin/audit-logs") ||
    pathname.includes("audit") ||
    pathname.includes("modification-history");

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "w-[240px] flex-shrink-0 bg-white border-r border-[#EAEFF4] flex flex-col justify-between h-screen fixed lg:sticky top-0 z-50 transition-transform duration-200 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top Header / Brand Logo */}
        <div>
          <div className="flex items-center justify-between px-5 pt-6 pb-5">
            <div className="flex items-center gap-3">
              {/* Green Equalizer / Bar Chart Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#00B074] flex items-center justify-center shadow-xs flex-shrink-0">
                <div className="flex items-end gap-[3px] h-[18px]">
                  <span className="w-[3px] h-[10px] bg-white rounded-full" />
                  <span className="w-[3px] h-[18px] bg-white rounded-full" />
                  <span className="w-[3px] h-[14px] bg-white rounded-full" />
                  <span className="w-[3px] h-[8px] bg-white rounded-full" />
                </div>
              </div>

              <div>
                <h1 className="text-[15px] font-bold text-gray-900 leading-tight tracking-tight">
                  Friends Goal
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[12px] text-gray-400 capitalize">
                    {user?.role ? (user.role === "superAdmin" ? "Super Admin" : user.role) : "Admin"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links matching Screenshot 1 */}
          <nav className="px-3 py-2 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-170px)]">
            {/* 1. Dashboard */}
            <Link
              href="/dashboard"
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 h-[42px] px-3.5 rounded-xl text-[14px] font-semibold transition-all",
                isDashboardActive && !isMemberActive
                  ? "bg-[#EAF8F1] text-[#00B074]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <LayoutGrid
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isDashboardActive && !isMemberActive ? "text-[#00B074]" : "text-gray-500"
                )}
              />
              <span>Dashboard</span>
            </Link>

            {/* 2. Member */}
            <Link
              href="/dashboard/member"
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 h-[42px] px-3.5 rounded-xl text-[14px] font-medium transition-all",
                isMemberActive
                  ? "bg-[#EAF8F1] text-[#00B074] font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Users
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isMemberActive ? "text-[#00B074]" : "text-gray-500"
                )}
              />
              <span>Member</span>
            </Link>

            {/* 3. Operation Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setOperationOpen(!operationOpen)}
                className="flex items-center justify-between w-full h-[40px] px-3.5 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>Operation</span>
                </div>
                {operationOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              {operationOpen && (
                <div className="pl-9 pr-3 py-1 flex flex-col gap-1 text-[13px]">
                  {/* Due List */}
                  <Link
                    href="/dashboard/due-list"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1 px-3 rounded-full transition-all block truncate font-medium",
                      isDueListActive
                        ? "bg-[#EAF8F1] text-[#00B074] font-semibold border border-[#00B074]/30 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Due List
                  </Link>

                  {/* Collection */}
                  <Link
                    href="/dashboard/collection"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1 px-3 rounded-full transition-all block truncate font-medium",
                      isCollectionActive
                        ? "bg-[#EAF8F1] text-[#00B074] font-semibold border border-[#00B074]/30 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Collection
                  </Link>

                  {/* Money Adjustment */}
                  <Link
                    href="/dashboard/money-adjustment"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1 px-3 rounded-full transition-all block truncate font-medium",
                      isAdjustmentActive
                        ? "bg-[#EAF8F1] text-[#00B074] font-semibold border border-[#00B074]/30 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Money Adjustment
                  </Link>

                  {/* Expense */}
                  <Link
                    href="/dashboard/expense"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1 px-3 rounded-full transition-all block truncate font-medium",
                      isExpenseActive
                        ? "bg-[#EAF8F1] text-[#00B074] font-semibold border border-[#00B074]/30 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Expense
                  </Link>

                  {/* Investment Information */}
                  <Link
                    href="/dashboard/investment"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1 px-3 rounded-full transition-all block truncate font-medium",
                      isInvestmentActive
                        ? "bg-[#EAF8F1] text-[#00B074] font-semibold border border-[#00B074]/30 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Investment Information
                  </Link>

                  {/* Income Disburs */}
                  <Link
                    href="/dashboard/income-disbursement"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1 px-3 rounded-full transition-all block truncate font-medium",
                      isDisbursementActive
                        ? "bg-[#EAF8F1] text-[#00B074] font-semibold border border-[#00B074]/30 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Income Disburs
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Report Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setReportOpen(!reportOpen)}
                className="flex items-center justify-between w-full h-[40px] px-3.5 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>Report</span>
                </div>
                {reportOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              {reportOpen && (
                <div className="pl-10 pr-2 py-1 flex flex-col gap-1 text-[13px]">
                  <Link
                    href="/dashboard"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1.5 px-2 rounded-lg transition-colors block truncate font-medium",
                      isFinancialAnalyticsActive
                        ? "text-[#00B074] font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Financial Analytics
                  </Link>
                  <Link
                    href="/dashboard/audit-logs"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1.5 px-2 rounded-lg transition-colors block truncate font-medium",
                      isAuditLogActive
                        ? "text-[#00B074] font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Modification History
                  </Link>

                  <Link
                    href="/dashboard/withdrawals"
                    onClick={onCloseMobile}
                    className={cn(
                      "py-1.5 px-2 rounded-lg transition-colors block truncate font-medium",
                      isWithdrawalsActive
                        ? "text-[#00B074] font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Withdrawal Requests
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom: Logout Button matching Screenshot 1 */}
        <div className="p-4 border-t border-[#F0F2F5]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 w-full h-[44px] rounded-xl bg-[#FEE2E2]/70 hover:bg-[#FEE2E2] text-[#DC2626] font-semibold text-[13.5px] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#DC2626]" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
