"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { loginApi, ApiError } from "@/lib/api";

import { LoginBrandPanel } from "@/components/auth/LoginBrandPanel";
import { LoginForm, type FieldErrors } from "@/components/auth/LoginForm";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { ToastStack, type Toast, type ToastVariant } from "@/components/auth/LoginToast";
import { BrandLogo } from "@/components/auth/BrandLogo";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRedirectPath(role: string): string {
  return role === "superAdmin" || role === "admin" ? "/admin/dashboard" : "/dashboard";
}

function decodeRole(token: string): string {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    ) as { role?: string };
    return payload.role ?? "";
  } catch {
    return "";
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  // Form state
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<FieldErrors>({});

  // UI state
  const [showForgot, setShowForgot] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getRedirectPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  // ── Toast helpers ──────────────────────────────────────────────────────────

  const pushToast = (message: string, variant: ToastVariant) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!userId.trim()) errors.userId = "Member ID is required.";
    if (!password) errors.password = "Password is required.";
    else if (password.length < 4) errors.password = "Password must be at least 4 characters.";
    setFieldError(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setFieldError({});

    try {
      const data = await loginApi({ id: userId.trim(), password });
      login(data.accessToken);
      pushToast("Signed in successfully! Redirecting…", "success");

      const dest = getRedirectPath(decodeRole(data.accessToken));
      setTimeout(() => router.push(dest), 800);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setFieldError({ userId: "No account found with this Member ID." });
        } else if (err.status === 401 || err.message.toLowerCase().includes("password")) {
          setFieldError({ password: "Incorrect password. Please try again." });
        } else {
          pushToast(err.message, "error");
        }
      } else {
        pushToast("Network error — please check your connection and try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Field change handlers (clear error on change) ──────────────────────────

  const handleUserIdChange = (v: string) => {
    setUserId(v);
    if (fieldError.userId) setFieldError((f) => ({ ...f, userId: undefined }));
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (fieldError.password) setFieldError((f) => ({ ...f, password: undefined }));
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Toast notifications */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* Forgot password modal */}
      <AnimatePresence>
        {showForgot && (
          <ForgotPasswordModal
            onClose={() => setShowForgot(false)}
            onSuccess={(msg) => { setShowForgot(false); pushToast(msg, "success"); }}
            onError={(msg) => pushToast(msg, "error")}
          />
        )}
      </AnimatePresence>

      {/* Page layout */}
      <div className="min-h-screen w-full flex bg-white">

        {/* Left — branded photo panel (desktop only) */}
        <LoginBrandPanel />

        {/* Right — login form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-12 bg-white min-h-screen">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <BrandLogo />
              <span className="font-bold text-[#1A1A1A] text-[17px] tracking-tight">
                Friends Goal
              </span>
            </Link>
          </div>

          <LoginForm
            userId={userId}
            password={password}
            showPassword={showPassword}
            loading={loading}
            fieldError={fieldError}
            onUserIdChange={handleUserIdChange}
            onPasswordChange={handlePasswordChange}
            onTogglePassword={() => setShowPassword((v) => !v)}
            onForgotPassword={() => setShowForgot(true)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
