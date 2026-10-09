"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText, CreditCard, Loader2, Download } from "lucide-react";
import { printMemberStatementPdf, printMemberIdCardPdf, type IMemberPdfData } from "@/lib/memberProfilePdfGenerator";
import { fetchCollectionsApi } from "@/lib/operationApi";

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
  const [isStatementLoading, setIsStatementLoading] = useState(false);
  const [isIdCardLoading, setIsIdCardLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  const isSmall = size === "sm";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      {/* Trigger Button: Download Options ▾ */}
      <button
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute z-50 mt-1.5 w-64 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 border border-slate-100 animate-in fade-in zoom-in-95 duration-100 ${
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
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
        </div>
      )}
    </div>
  );
}
