import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, AlertCircle, Banknote, Landmark, Smartphone, Wallet } from "lucide-react";
import { memberDashboardApi } from "@/lib/memberDashboardApi";

interface RequestWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProfit?: number;
  memberId: string;
  onWithdrawalSuccess?: (remainingProfit: number) => void;
}

export function RequestWithdrawalModal({
  isOpen,
  onClose,
  availableProfit = 0,
  memberId,
  onWithdrawalSuccess,
}: RequestWithdrawalModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [liveProfit, setLiveProfit] = useState(availableProfit);
  const [liveDeposit, setLiveDeposit] = useState(0);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);
  const [memberName, setMemberName] = useState("");

  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("Bank Transfer");
  const [accountNumber, setAccountNumber] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    referenceId: string;
    status: string;
    amount: number;
    date: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount("");
      setResult(null);
      setErrorMsg(null);
      
      memberDashboardApi.getDashboardSummary().then((summary) => {
        setLiveProfit(summary.profitBalance || 0);
        setLiveDeposit(summary.depositBalance || summary.totalDeposit || 0);
        setPendingWithdrawal(summary.pendingWithdrawal || 0);
        setMemberName(summary.fullName || "Member");
      }).catch(() => {});
    }
  }, [isOpen, memberId]);

  if (!isOpen) return null;

  const totalEligibleBalance = Math.max(0, liveDeposit + liveProfit - pendingWithdrawal);

  const handleNextStep = () => {
    setErrorMsg(null);
    const withdrawAmt = parseFloat(amount);
    
    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      setErrorMsg("Please enter a valid positive withdrawal amount.");
      return;
    }
    
    if (withdrawAmt > totalEligibleBalance) {
      setErrorMsg(`Amount exceeds your total available limit (Deposit + Profit).`);
      return;
    }
    
    if (!accountNumber.trim()) {
      setErrorMsg("Please provide your account details.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    const withdrawAmt = parseFloat(amount);

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
      
      setResult({
        referenceId: refId,
        status: "Pending",
        amount: withdrawAmt,
        date: new Date().toLocaleString(),
      });

      if (onWithdrawalSuccess) {
        onWithdrawalSuccess(Math.max(0, liveProfit - (res.profitDeduction || 0)));
      }
      
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit withdrawal request");
      setStep(1);
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

  const setPresetAmount = (percentage: number) => {
    if (totalEligibleBalance > 0) {
      const val = (totalEligibleBalance * percentage).toFixed(2);
      setAmount(percentage === 1 ? totalEligibleBalance.toString() : val);
    }
  };

  const withdrawAmt = parseFloat(amount) || 0;
  const profitDeduction = Math.min(liveProfit, withdrawAmt);
  const depositDeduction = withdrawAmt - profitDeduction;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-serif text-gray-900 leading-tight">Request Withdrawal</h3>
            <p className="text-sm text-gray-500 mt-1">
              Available Eligible: ৳{totalEligibleBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-8 py-2 flex items-center justify-center">
          <div className="flex items-center w-full max-w-[320px] justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gray-200 -z-10" />
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#3C5B42] text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-[10px] font-bold ${step >= 1 ? 'text-[#3C5B42]' : 'text-gray-400'}`}>Request Details</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#3C5B42] text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
              </div>
              <span className={`text-[10px] font-bold ${step >= 2 ? 'text-[#3C5B42]' : 'text-gray-400'}`}>Review & Confirm</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-[#3C5B42] text-white' : 'bg-gray-200 text-gray-400'}`}>
                3
              </div>
              <span className={`text-[10px] font-bold ${step >= 3 ? 'text-[#3C5B42]' : 'text-gray-400'}`}>Submitted</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              {/* Balances */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Deposit Balance</span>
                  <span className="text-base font-bold text-gray-900">৳{liveDeposit.toLocaleString()}</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Profit Balance</span>
                  <span className="text-base font-bold text-gray-900">৳{liveProfit.toLocaleString()}</span>
                </div>
                <div className="col-span-2 bg-[#EAF8F1] border border-[#00B074]/30 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-[#00B074] uppercase block mb-0.5">Total Eligible Limit</span>
                    <span className="text-lg font-bold text-[#00B074]">৳{totalEligibleBalance.toLocaleString()}</span>
                  </div>
                  {pendingWithdrawal > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-amber-600 block">Pending</span>
                      <span className="text-xs font-bold text-amber-600">৳{pendingWithdrawal.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">৳</span>
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    max={totalEligibleBalance}
                    className="w-full pl-9 pr-4 py-3 text-lg font-bold bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3C5B42] focus:border-[#3C5B42] transition-all"
                  />
                </div>
                
                {/* Presets */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
                  {[
                    { label: "25%", val: 0.25 },
                    { label: "50%", val: 0.50 },
                    { label: "75%", val: 0.75 },
                    { label: "Max (100%)", val: 1.0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setPresetAmount(preset.val)}
                      className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-[#EAF8F1] hover:text-[#00B074] hover:border-[#00B074] transition-colors whitespace-nowrap"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Withdrawal Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Withdrawal Method</label>
                <div className="space-y-2">
                  {[
                    { id: "Bank Transfer", icon: <Landmark className="w-5 h-5 text-gray-500" />, desc: "1-3 business days" },
                    { id: "Mobile Banking", icon: <Smartphone className="w-5 h-5 text-gray-500" />, desc: "Instant (bKash, Nagad)" },
                    { id: "Cash Pickup", icon: <Wallet className="w-5 h-5 text-gray-500" />, desc: "Visit a registered branch" },
                  ].map((m) => (
                    <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${payoutMethod === m.id ? 'border-[#3C5B42] bg-[#F5F8F6]' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-xs">
                        {m.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-gray-900">{m.id}</div>
                        <div className="text-[11px] text-gray-500">{m.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutMethod === m.id ? 'border-[#3C5B42]' : 'border-gray-300'}`}>
                        {payoutMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-[#3C5B42]" />}
                      </div>
                      <input 
                        type="radio" 
                        name="payoutMethod" 
                        value={m.id} 
                        checked={payoutMethod === m.id} 
                        onChange={(e) => setPayoutMethod(e.target.value)} 
                        className="hidden" 
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Account Details</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter Bank Acc / Mobile No"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3C5B42] focus:border-[#3C5B42]"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Reason (Optional)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Emergency, Personal"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3C5B42] focus:border-[#3C5B42]"
                />
              </div>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3.5 bg-[#3C5B42] hover:bg-[#2c4230] text-white text-sm font-bold rounded-xl transition-colors shadow-xs"
              >
                Review Request
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-[#3C5B42] text-white rounded-t-2xl p-6 text-center">
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-1">Withdrawal Amount</div>
                <div className="text-4xl font-serif font-bold">৳{withdrawAmt.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-b-2xl shadow-xs -mt-6 divide-y divide-gray-100">
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Member</span>
                  <span className="text-sm font-bold text-gray-900">{memberName}</span>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Method</span>
                  <span className="text-sm font-bold text-gray-900">{payoutMethod}</span>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account</span>
                  <span className="text-sm font-bold text-gray-900">{accountNumber}</span>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</span>
                  <span className="text-sm font-bold text-gray-900">{reason || "N/A"}</span>
                </div>
                
                <div className="p-4 bg-gray-50">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Deduction Breakdown</span>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">From Profit:</span>
                    <span className="text-xs font-bold text-gray-900">৳{profitDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">From Deposit:</span>
                    <span className="text-xs font-bold text-gray-900">৳{depositDeduction.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available After</span>
                  <span className="text-sm font-bold text-gray-900">৳{Math.max(0, totalEligibleBalance - withdrawAmt).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex gap-3 text-xs text-gray-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-gray-400" />
                <p>Once submitted, your request will be reviewed within 1-2 business days. You'll be notified of approval via your registered contact.</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#3C5B42] hover:bg-[#2c4230] text-white text-sm font-bold rounded-xl transition-colors shadow-xs flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm & Submit"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-300 py-4">
              <div className="w-20 h-20 bg-[#EAF8F1] rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-[#00B074]" />
              </div>
              
              <div>
                <h4 className="text-2xl font-bold font-serif text-gray-900">Request Submitted!</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Your withdrawal request is now under review.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden text-left divide-y divide-gray-100">
                <div className="bg-[#3C5B42] p-4 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Reference ID</span>
                  <span className="text-sm font-bold font-serif text-white tracking-wider">{result.referenceId}</span>
                </div>
                
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</span>
                  <span className="text-sm font-bold text-gray-900">৳{result.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Method</span>
                  <span className="text-sm font-bold text-gray-900">{payoutMethod}</span>
                </div>

                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Under Review
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted</span>
                  <span className="text-sm font-bold text-gray-900">{result.date}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-3.5 bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm font-bold rounded-xl transition-colors mt-2"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
