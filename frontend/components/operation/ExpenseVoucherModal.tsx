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
          {/* Header */}
          <div className="text-center border-b border-gray-200 pb-5">
            <div className="inline-flex items-center justify-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#00B074] flex items-center justify-center text-white font-bold text-sm">
                FG
              </div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                FRIENDS GOAL
              </h2>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
              Expense Debit Voucher
            </p>
          </div>

          {/* Voucher Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="text-gray-500 block mb-0.5">Voucher No:</span>
              <span className="font-bold text-gray-900 text-sm">
                {expense.voucherNo || `EXP-${String(expense.expenseId).padStart(5, "0")}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block mb-0.5">Date:</span>
              <span className="font-bold text-gray-900 text-sm">
                {formatDate(expense.expenseDate)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">Paid To / Member:</span>
              <span className="font-bold text-gray-900 uppercase">
                {expense.memberName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block mb-0.5">Expense Head:</span>
              <span className="font-bold text-[#056839]">
                {expense.expenseHead}
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-600 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Description / Remarks</th>
                  <th className="py-2.5 px-4 text-right">Amount (BDT / $)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 px-4 text-gray-700 font-medium">
                    {expense.remarks}
                  </td>
                  <td className="py-4 px-4 text-right text-base font-bold text-gray-900">
                    {(Number(expense.amount) || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signature Areas */}
          <div className="pt-12 grid grid-cols-3 gap-6 text-center text-xs text-gray-600">
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
