import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { memberDashboardApi } from "@/lib/memberDashboardApi";

interface RequestWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProfit: number;
  memberId: string;
  onWithdrawalSuccess?: (remainingProfit: number) => void;
}

export function RequestWithdrawalModal({
  isOpen,
  onClose,
  availableProfit,
  memberId,
  onWithdrawalSuccess,
}: RequestWithdrawalModalProps) {
  const [liveProfit, setLiveProfit] = useState(availableProfit);
  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("Bank Transfer");
  const [accountNumber, setAccountNumber] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    referenceId: string;
    status: string;
    amount: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      memberDashboardApi.getProfitBalance(memberId).then((res) => {
        if (typeof res.profitBalance === "number") {
          setLiveProfit(res.profitBalance);
        }
      });
    }
  }, [isOpen, memberId]);

  if (!isOpen) return null;

  const currentAvailable = liveProfit > 0 ? liveProfit : availableProfit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const withdrawAmt = parseFloat(amount);
    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      setErrorMsg("Please enter a valid positive withdrawal amount.");
      return;
    }

    if (withdrawAmt > currentAvailable) {
      setErrorMsg(
        `Requested amount (৳${(Number(withdrawAmt) || 0).toLocaleString()}) exceeds your available profit balance (৳${(Number(currentAvailable) || 0).toLocaleString()}).`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await memberDashboardApi.submitWithdrawalRequest({
        memberId: memberId || "mem-002",
        amount: withdrawAmt,
        method: payoutMethod,
        accountDetails: accountNumber,
        reason,
      });

      const refId = res?.withdrawal?.referenceId || res?.referenceId || "WD-SUBMITTED";
      const remaining = res?.remainingProfitBalance ?? Math.max(0, currentAvailable - withdrawAmt);

      setResult({
        referenceId: refId,
        status: "Pending",
        amount: withdrawAmt,
      });

      setLiveProfit(remaining);
      if (onWithdrawalSuccess) {
        onWithdrawalSuccess(remaining);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit withdrawal request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setResult(null);
    setErrorMsg(null);
    setAmount("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1A1A1A] px-6 py-4.5 flex items-center justify-between text-white">
          <div>
            <h3 className="text-base font-bold leading-tight">Request Withdrawal</h3>
            <p className="text-xs text-white/60 mt-0.5">
              Submit your profit distribution payout request
            </p>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {result ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-[#00B074] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Withdrawal Request Submitted
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Your request has been placed and is currently under review by council.
                </p>
              </div>

              {/* Reference ID and Status Box */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Reference ID:</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    {result.referenceId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-bold text-gray-900">
                    ৳{(Number(result?.amount) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status:</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {result.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-2.5 bg-[#00B074] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#009663] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Available Profit Banner */}
              <div className="p-4 rounded-xl bg-[#EAF8F1] border border-[#00B074]/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Available Profit
                  </span>
                  <span className="text-xl font-bold text-[#00B074]">
                    ৳{(Number(availableProfit) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#00B074] shadow-2xs border border-[#00B074]/20">
                  Ready to Withdraw
                </span>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Withdrawal Amount ($) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 4554.00"
                  max={availableProfit}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
                />
              </div>

              {/* Payout Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Payout Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074]"
                >
                  <option value="Bank Transfer">Bank Transfer (EFT / RTGS)</option>
                  <option value="bKash / Nagad">Mobile Financial Services (bKash / Nagad)</option>
                  <option value="Cheque">Physical Cheque</option>
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Account / Mobile Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter recipient account number"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074]"
                />
              </div>

              {/* Reason / Remarks */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Reason (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason or instructions..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00B074]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !amount}
                  className="px-6 py-2 bg-[#00B074] hover:bg-[#009663] disabled:opacity-50 text-white text-xs font-bold uppercase rounded-lg transition-colors shadow-xs inline-flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
