"use client";

import { X, Printer } from "lucide-react";
import { IExpenseRecord } from "@/lib/expenseApi";

interface ExpenseVoucherModalProps {
  expense: IExpenseRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpenseVoucherModal({
  expense,
  isOpen,
  onClose,
}: ExpenseVoucherModalProps) {
  if (!isOpen || !expense) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-[620px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFBFD] print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B074]" />
            <span className="text-sm font-bold text-gray-800">
              Payment Voucher Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-gray-600" />
              <span>Print Voucher</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voucher Printable Content */}
        <div className="p-8 overflow-y-auto space-y-6 print:p-0 print:space-y-4 text-gray-900 bg-white">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#0E3B6C]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2.5 border-[#0E3B6C] flex items-center justify-center font-black text-lg text-[#C0262D] -rotate-12 shadow-xs bg-white">
                FG
              </div>
              <div>
                <div className="text-xl font-black leading-none">
                  <span className="text-[#0E3B6C]">Friends</span> <span className="text-[#C0262D]">Goal</span>
                </div>
                <div className="inline-block mt-1 bg-[#0E3B6C] text-white text-[8.5px] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase">
                  LET'S GO TOGETHER
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-base font-black text-[#0E3B6C] uppercase tracking-tight">
                Expense Debit Voucher
              </h2>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                Date: {formatDate(expense.expenseDate)}
              </p>
              <p className="text-[10px] font-bold text-[#C0262D]">
                www.friendsgoal.com
              </p>
            </div>
          </div>

          {/* Voucher Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-gray-200">
            <div>
              <span className="text-gray-500 block mb-0.5 text-[11px]">Voucher No:</span>
              <span className="font-bold text-[#0E3B6C] text-sm font-mono">
                {expense.voucherNo || `EXP-${String(expense.expenseId).padStart(5, "0")}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block mb-0.5 text-[11px]">Status:</span>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                Official Voucher
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5 text-[11px]">Paid To / Member:</span>
              <span className="font-bold text-gray-900 uppercase">
                {expense.memberName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block mb-0.5 text-[11px]">Expense Head:</span>
              <span className="font-bold text-[#0E3B6C]">
                {expense.expenseHead}
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E3B6C] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Description / Remarks</th>
                  <th className="py-2.5 px-4 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="py-4 px-4 text-gray-700 font-medium">
                    {expense.remarks || "Official organization operational expense"}
                  </td>
                  <td className="py-4 px-4 text-right text-base font-extrabold text-[#0E3B6C]">
                    BDT {(Number(expense.amount) || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Bar */}
          <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-dashed border-[#0E3B6C] rounded-lg">
            <div className="flex items-center gap-2">
              <span className="bg-[#0E3B6C] text-white text-[9.5px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                VERIFIED AUTHENTIC
              </span>
              <span className="font-mono text-xs font-bold text-slate-800">
                FG-VERIFY-EXP-{String(expense.expenseId || "001").padStart(3, "0")}
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">
              ✓ Valid Official Debit Voucher
            </span>
          </div>

          {/* Signature Areas */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-gray-600">
            <div className="border-t border-gray-300 pt-2 font-medium">
              Prepared By
            </div>
            <div className="border-t border-gray-300 pt-2 font-medium">
              Checked By
            </div>
            <div className="border-t border-gray-300 pt-2 font-bold text-gray-900">
              Authorized Signatory
            </div>
          </div>

          {/* Disclaimer & Bottom Dual-Tone Accent Bar */}
          <div>
            <div className="text-[11px] font-medium text-gray-500 mb-2">
              This is an auto-generated document, no signature required.
            </div>
            <div className="h-2.5 flex overflow-hidden rounded-xs -mx-8 -mb-8">
              <div
                className="bg-[#C0262D] w-[53%]"
                style={{ clipPath: "polygon(0 0, 100% 0, 94% 100%, 0 100%)" }}
              />
              <div
                className="bg-[#0E3B6C] w-[49%] -ml-[2%]"
                style={{ clipPath: "polygon(6% 0, 100% 0, 100% 100%, 0 100%)" }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-[#FAFBFD] flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
