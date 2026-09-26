"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  memberName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  memberName,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    if (isDeleting) return;
    setStep(1);
    setConfirmText("");
    onClose();
  };

  const handleStep1Continue = () => {
    setStep(2);
    setConfirmText("");
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;
    await onConfirm();
    setStep(1);
    setConfirmText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
        {/* Soft Red Circle with Trash Icon */}
        <div className="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4 text-[#DC2626]">
          <Trash2 className="w-6 h-6 stroke-[2.2]" />
        </div>

        {step === 1 ? (
          // ── Step 1: Warning Dialog (Screenshot 5) ──
          <>
            <h3 className="text-[18px] font-bold text-gray-900 mb-2">
              Delete Member?
            </h3>
            <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6">
              You are about to permanently delete{" "}
              <strong className="text-gray-900 font-semibold">{memberName}</strong>.
              This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-[13px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStep1Continue}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-[13px] transition-colors cursor-pointer shadow-xs"
              >
                Yes, continue
              </button>
            </div>
          </>
        ) : (
          // ── Step 2: Final Confirmation (Screenshot 4) ──
          <>
            <h3 className="text-[18px] font-bold text-gray-900 mb-1.5">
              Final Confirmation
            </h3>
            <p className="text-[13px] text-gray-600 mb-4">
              This is irreversible. Type <strong className="text-[#DC2626]">DELETE</strong> to confirm.
            </p>

            <div className="w-full mb-6">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE here"
                disabled={isDeleting}
                autoFocus
                className="w-full h-11 px-4 text-center rounded-xl border border-gray-300 focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-red-100 text-[14px] font-mono transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-[13px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isDeleting}
                className={`flex-1 h-10 rounded-xl text-white font-semibold text-[13px] transition-all flex items-center justify-center gap-2 ${
                  confirmText === "DELETE" && !isDeleting
                    ? "bg-[#DC2626] hover:bg-[#B91C1C] cursor-pointer shadow-xs"
                    : "bg-[#F87171]/50 cursor-not-allowed text-white/80"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
