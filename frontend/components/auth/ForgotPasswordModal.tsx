"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, X, CheckCircle2 } from "lucide-react";
import { forgotPasswordApi, ApiError } from "@/lib/api";
import { Spinner } from "@/components/auth/Spinner";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ForgotPasswordModal({
  onClose,
  onSuccess,
  onError,
}: ForgotPasswordModalProps) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setLoading(true);
    try {
      await forgotPasswordApi({ id: userId.trim() });
      setSent(true);
      onSuccess("Password reset link sent! Check your registered email.");
    } catch (err) {
      onError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-modal="true"
      role="dialog"
      aria-labelledby="forgot-modal-title"
    >
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] bg-white rounded-[24px] p-7 sm:p-8 shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:bg-[#f5f5f5] hover:text-[#1A1A1A] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {sent ? <SuccessState userId={userId} onClose={onClose} /> : (
          <FormState
            userId={userId}
            setUserId={setUserId}
            loading={loading}
            inputRef={inputRef}
            onSubmit={handleSubmit}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Success state ─────────────────────────────────────────────────────────────

function SuccessState({ userId, onClose }: { userId: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-2">
      <div className="w-14 h-14 rounded-full bg-[#f0faf4] flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7 text-[#1FDE64]" />
      </div>
      <div>
        <h2 className="font-serif font-bold text-[#1A1A1A] text-[22px] mb-1">
          Check Your Email
        </h2>
        <p className="text-[#666] text-[14px] leading-relaxed">
          We sent a password reset link to the email registered with{" "}
          <strong>ID: {userId}</strong>. It expires in 10 minutes.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 w-full h-[48px] rounded-full bg-[#1FDE64] hover:bg-[#18c957] text-[#1A1A1A] font-bold text-[14px] transition-colors"
      >
        Done
      </button>
    </div>
  );
}

// ─── Form state ────────────────────────────────────────────────────────────────

interface FormStateProps {
  userId: string;
  setUserId: (v: string) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (e: React.FormEvent) => void;
}

function FormState({ userId, setUserId, loading, inputRef, onSubmit }: FormStateProps) {
  return (
    <>
      <div className="mb-6">
        <h2
          id="forgot-modal-title"
          className="font-serif font-bold text-[#1A1A1A] text-[24px] leading-tight mb-1.5"
        >
          Forgot Password?
        </h2>
        <p className="text-[#666] text-[13px] leading-relaxed">
          Enter your Member ID and we&apos;ll send a reset link to your registered email.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="forgot-userid"
            className="text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase"
          >
            Member ID
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888] pointer-events-none" />
            <input
              ref={inputRef}
              id="forgot-userid"
              type="text"
              autoComplete="username"
              required
              placeholder="e.g. FG-0042"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="
                w-full h-[50px] pl-11 pr-4 rounded-[14px]
                border border-[#E5E5E5] bg-[#FAFAFA]
                text-[14px] text-[#1A1A1A] placeholder:text-[#AAAAAA]
                focus:outline-none focus:border-[#1FDE64] focus:bg-white
                transition-all duration-200
              "
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !userId.trim()}
          className="
            w-full h-[50px] rounded-full
            bg-[#1FDE64] hover:bg-[#18c957]
            text-[#1A1A1A] font-bold text-[14px]
            flex items-center justify-center gap-2
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg
          "
        >
          {loading ? <><Spinner /> Sending…</> : "Send Reset Link"}
        </button>
      </form>
    </>
  );
}
