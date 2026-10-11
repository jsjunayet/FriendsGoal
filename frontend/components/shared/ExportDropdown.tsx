"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileText, FileSpreadsheet, RefreshCw } from "lucide-react";
import { downloadReportFile } from "@/lib/reportApi";
import { toast } from "sonner";

interface ExportDropdownProps {
  endpointUrl?: string;
  defaultFilename?: string;
  onExport?: (type: "pdf" | "excel") => Promise<void> | void;
  disabled?: boolean;
  buttonLabel?: string;
  className?: string;
}

export function ExportDropdown({
  endpointUrl,
  defaultFilename = "Report",
  onExport,
  disabled,
  buttonLabel = "Export",
  className = "",
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (type: "pdf" | "excel") => {
    try {
      setIsExporting(true);
      setIsOpen(false);

      if (onExport) {
        await onExport(type);
      } else if (endpointUrl) {
        await downloadReportFile(endpointUrl, type, defaultFilename);
      } else {
        throw new Error("No export handler configured");
      }
      toast.success(`${type.toUpperCase()} exported successfully`);
    } catch (error: any) {
      toast.error(error.message || "Failed to download report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || disabled}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
      >
        {isExporting ? (
          <RefreshCw className="w-4 h-4 animate-spin text-[#00B074]" />
        ) : (
          <Download className="w-4 h-4 text-gray-500" />
        )}
        <span>{isExporting ? "Generating..." : buttonLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            Export Options
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
            <FileSpreadsheet className="w-4 h-4 text-[#00B074]" />
            <div>
              <div className="font-medium">Download Excel</div>
              <div className="text-[11px] text-gray-400">Formatted spreadsheet (.xlsx)</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
