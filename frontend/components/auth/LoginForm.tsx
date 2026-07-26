"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/auth/Spinner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FieldErrors {
  userId?: string;
  password?: string;
}

interface LoginFormProps {
  userId: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  fieldError: FieldErrors;
  onUserIdChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onForgotPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginForm({
  userId,
  password,
  showPassword,
  loading,
  fieldError,
  onUserIdChange,
  onPasswordChange,
  onTogglePassword,
  onForgotPassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: "easeOut" }}
      className="w-full max-w-[420px] flex flex-col"
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-serif text-[#1A1A1A] text-[32px] sm:text-[38px] font-bold leading-tight tracking-tight mb-2">
          Welcome Back
        </h1>
        <p className="text-[#666666] text-[14px] sm:text-[15px] leading-relaxed">
          Sign in to your Friends Goal member account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        {/* Member ID */}
        <FormField
          id="login-userid"
          label="Member ID"
          error={fieldError.userId}
          errorId="userid-error"
        >
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors"
              style={{ color: fieldError.userId ? "#ef4444" : "#888888" }}
            />
            <input
              id="login-userid"
              type="text"
              autoComplete="username"
              required
              placeholder="e.g. FG-0042"
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              aria-invalid={!!fieldError.userId}
              aria-describedby={fieldError.userId ? "userid-error" : undefined}
              className={inputClass(!!fieldError.userId) + " pl-11 pr-4"}
            />
          </div>
        </FormField>

        {/* Password */}
        <FormField
          id="login-password"
          label="Password"
          error={fieldError.password}
          errorId="password-error"
          footer={
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[12px] text-[#2B5A27] font-semibold hover:underline transition-all"
              >
                Forgot password?
              </button>
            </div>
          }
        >
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors"
              style={{ color: fieldError.password ? "#ef4444" : "#888888" }}
            />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••••"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              aria-invalid={!!fieldError.password}
              aria-describedby={fieldError.password ? "password-error" : undefined}
              className={inputClass(!!fieldError.password) + " pl-11 pr-12"}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#555] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FormField>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="
            mt-1 w-full h-[52px] rounded-full
            bg-[#1FDE64] hover:bg-[#18c957]
            text-[#1A1A1A] font-bold text-[15px] tracking-wide
            flex items-center justify-center gap-2.5
            transition-all duration-200 cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg
          "
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner /> Signing in…
            </span>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="my-7 flex items-center gap-3">
        <span className="flex-1 h-px bg-[#E5E5E5]" />
        <span className="text-[12px] text-[#AAAAAA] font-semibold uppercase tracking-widest">or</span>
        <span className="flex-1 h-px bg-[#E5E5E5]" />
      </div>

      {/* Back to home */}
      <p className="text-center text-[13px] text-[#666666]">
        Not a member yet?{" "}
        <Link href="/" className="font-bold text-[#2B5A27] hover:underline transition-all">
          Back to Home
        </Link>
      </p>
    </motion.div>
  );
}

// ─── Shared form field wrapper ────────────────────────────────────────────────

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  errorId?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

function FormField({ id, label, error, errorId, footer, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-[12px] text-[#ef4444] flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
      {footer}
    </div>
  );
}

// ─── Input class helper ───────────────────────────────────────────────────────

function inputClass(hasError: boolean) {
  return `
    w-full h-[52px] rounded-[14px]
    border bg-[#FAFAFA]
    text-[14px] text-[#1A1A1A] placeholder:text-[#AAAAAA]
    focus:outline-none focus:bg-white
    transition-all duration-200
    ${hasError
      ? "border-[#ef4444] focus:border-[#ef4444]"
      : "border-[#E5E5E5] focus:border-[#1FDE64]"
    }
  `;
}
