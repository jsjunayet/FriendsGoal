"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, FileText, CreditCard, Loader2, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { printMemberStatementPdf, printMemberIdCardPdf, type IMemberPdfData } from "@/lib/memberProfilePdfGenerator";
import { fetchCollectionsApi } from "@/lib/operationApi";
import {
  exportReportToExcel,
  IReportColumn,
  IExportReportOptions,
} from "@/lib/reportExportEngine";

interface MemberDownloadDropdownProps {
  member: any;
  variant?: "table" | "header" | "button";
  size?: "sm" | "default";
  align?: "left" | "right";
  className?: string;
}

export function MemberDownloadDropdown({
  member,
  variant = "table",
  size = "sm",
  align = "right",
  className = "",
}: MemberDownloadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isStatementLoading, setIsStatementLoading] = useState(false);
  const [isIdCardLoading, setIsIdCardLoading] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 260;
    const menuHeight = menuRef.current?.offsetHeight || 220;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < menuHeight && rect.top > menuHeight;

    let top = openUpwards ? rect.top - menuHeight - 6 : rect.bottom + 6;
    let left = align === "right" ? rect.right - menuWidth : rect.left;

    // Viewport boundaries
    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
    });
  }, [align]);

  // Handle open / reposition / close
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);

    const handleScrollOrResize = (event: Event) => {
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return;
      }
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          setIsOpen(false);
          return;
        }
      }
      updatePosition();
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  // Handle Option A: User Information Statement
  const handleDownloadStatement = async () => {
    try {
      setIsStatementLoading(true);
      let collectionsData: any[] = [];
      const memberId = member._id || member.memberId;

      if (memberId) {
        try {
          const res = await fetchCollectionsApi(memberId);
          if (res?.collections && Array.isArray(res.collections)) {
            collectionsData = res.collections;
          }
        } catch {
          // Fallback gracefully to member's local schedule or empty table
        }
      }

      printMemberStatementPdf(member as IMemberPdfData, collectionsData);
    } catch (err) {
      console.error("Error generating member statement:", err);
    } finally {
      setIsStatementLoading(false);
      setIsOpen(false);
    }
  };

  // Handle Option B: Digital ID Card
  const handleDownloadIdCard = () => {
    try {
      setIsIdCardLoading(true);
      printMemberIdCardPdf(member as IMemberPdfData);
    } catch (err) {
      console.error("Error generating ID card:", err);
    } finally {
      setIsIdCardLoading(false);
      setIsOpen(false);
    }
  };

  // Handle Option C: Member Ledger Excel
  const handleDownloadExcelStatement = async () => {
    try {
      setIsExcelLoading(true);
      let collectionsData: any[] = [];
      const memberId = member._id || member.memberId;

      if (memberId) {
        try {
          const res = await fetchCollectionsApi(memberId);
          if (res?.collections && Array.isArray(res.collections)) {
            collectionsData = res.collections;
          }
        } catch {
          // Fallback gracefully
        }
      }

      const rowsList = collectionsData.length > 0
        ? collectionsData
        : Array.isArray(member.activePaymentSchedule) && member.activePaymentSchedule.length > 0
        ? member.activePaymentSchedule
        : [];

      const mappedRows = rowsList.map((col: any, idx: number) => {
        let dateStr = "—";
        try {
          const d = new Date(col.paymentDate || col.date || col.createdAt || Date.now());
          if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
          }
        } catch (_) {}

        return {
          sl: idx + 1,
          date: dateStr,
          month: col.month || "—",
          receiptNo: col.receiptNo || "-",
          amount: Number(col.amount) || 0,
          status: col.status || "Paid",
          remarks: col.note || col.remarks || col.collectedByName || "—",
        };
      });

      const columns: IReportColumn[] = [
        { header: "SL#", dataKey: "sl", excelWidth: 8, align: "center" },
        { header: "Date", dataKey: "date", excelWidth: 16, align: "center" },
        { header: "Month", dataKey: "month", excelWidth: 18, align: "center" },
        { header: "Receipt / Ref", dataKey: "receiptNo", excelWidth: 18, align: "center" },
        { header: "Amount", dataKey: "amount", excelWidth: 16, align: "right", isCurrency: true },
        { header: "Status", dataKey: "status", excelWidth: 14, align: "center" },
        { header: "Remarks / Collector", dataKey: "remarks", excelWidth: 26, align: "left" },
      ];

      const exportOptions: IExportReportOptions = {
        reportTitle: "Member Financial Statement",
        filterSummary: `Member Code: ${member.memberCode || "001"} | Name: ${member.fullName || "Member"} | Mobile: ${member.mobileNo || member.phone || "N/A"}`,
        columns,
        rows: mappedRows,
        amountColumnKey: "amount",
        filenamePrefix: `Member_${member.memberCode || "001"}_Ledger`,
        sheetName: `Ledger-${member.memberCode || "001"}`.substring(0, 31),
        memberInfo: {
          memberCode: member.memberCode || "001",
          fullName: member.fullName || "Member",
          phone: member.mobileNo || member.phone,
          totalDeposit: Number(member.totalDeposit) || 0,
          dueAmount: Number(member.dueAmount) || 0,
          savingsBalance: Number(member.savingsBalance) || 0,
        },
      };

      await exportReportToExcel(exportOptions);
      toast.success("Member Excel ledger generated successfully");
    } catch (err: any) {
      console.error("Error generating member Excel ledger:", err);
      toast.error("Failed to generate Excel ledger: " + (err.message || "Unknown error"));
    } finally {
      setIsExcelLoading(false);
      setIsOpen(false);
    }
  };

  const isSmall = size === "sm";

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button: Download Options ▾ */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Download Options"
        className={`inline-flex items-center gap-1.5 font-semibold transition-all cursor-pointer select-none rounded-lg border shadow-xs ${
          isSmall
            ? "h-8 px-2.5 text-[12px] bg-white border-gray-200 text-[#0E3B6C] hover:bg-slate-50 hover:border-[#0E3B6C]/40"
            : "h-9 px-3.5 text-[13px] bg-white border-[#E5E7EB] text-[#0E3B6C] hover:bg-gray-50 hover:border-[#0E3B6C]"
        } ${isOpen ? "ring-2 ring-[#0E3B6C]/20 border-[#0E3B6C]" : ""}`}
      >
        <Download className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} text-[#C0262D] shrink-0`} />
        <span>Download Options</span>
        <ChevronDown
          className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu (Portaled outside table to eliminate overflow clipping) */}
      {mounted && isOpen && createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          style={{
            position: "fixed",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: "260px",
            zIndex: 99999,
          }}
          className="rounded-xl bg-white p-1.5 shadow-2xl ring-1 ring-black/10 border border-slate-200 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Download Official Documents
            </p>
          </div>

          {/* Option A: User Information Statement */}
          <button
            type="button"
            role="menuitem"
            disabled={isStatementLoading}
            onClick={handleDownloadStatement}
            className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left text-slate-700 hover:bg-slate-50 hover:text-[#0E3B6C] transition-colors group cursor-pointer disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-md bg-[#0E3B6C]/10 flex items-center justify-center text-[#0E3B6C] shrink-0 mt-0.5 group-hover:bg-[#0E3B6C] group-hover:text-white transition-colors">
              {isStatementLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-bold text-slate-900 group-hover:text-[#0E3B6C]">
                User Information Statement
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                Financial statement & member profile
              </div>
            </div>
          </button>

          {/* Option B: ID Card */}
          <button
            type="button"
            role="menuitem"
            disabled={isIdCardLoading}
            onClick={handleDownloadIdCard}
            className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left text-slate-700 hover:bg-slate-50 hover:text-[#C0262D] transition-colors group cursor-pointer disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-md bg-[#C0262D]/10 flex items-center justify-center text-[#C0262D] shrink-0 mt-0.5 group-hover:bg-[#C0262D] group-hover:text-white transition-colors">
              {isIdCardLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CreditCard className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-bold text-slate-900 group-hover:text-[#C0262D]">
                ID Card
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                Digital ID Card (Front & Back view)
              </div>
            </div>
          </button>

          {/* Option C: Member Ledger Excel */}
          <button
            type="button"
            role="menuitem"
            disabled={isExcelLoading}
            onClick={handleDownloadExcelStatement}
            className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left text-slate-700 hover:bg-slate-50 hover:text-[#00B074] transition-colors group cursor-pointer disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-md bg-[#00B074]/10 flex items-center justify-center text-[#00B074] shrink-0 mt-0.5 group-hover:bg-[#00B074] group-hover:text-white transition-colors">
              {isExcelLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-bold text-slate-900 group-hover:text-[#00B074]">
                Member Ledger (Excel)
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                Formatted financial spreadsheet (.xlsx)
              </div>
            </div>
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
