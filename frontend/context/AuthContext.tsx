"use client";

/**
 * AuthContext — global authentication state for Friends Goal.
 *
 * Storage strategy:
 *   - accessToken  → localStorage & sessionStorage (30-day session)
 *   - role/userId  → decoded securely from JWT
 *   - middleware   → fg_auth, fg_auth_role, fg_token cookies
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  STORAGE_KEY_TOKEN,
  decodeJwtPayload,
  setAuthCookies,
  clearClientAuth,
  type DecodedAuthUser,
} from "@/lib/authUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "superAdmin" | "superadmin" | "admin" | "manager" | "member" | string;

export interface AuthUser {
  userId: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // true while hydrating from storage
}

interface AuthContextValue extends AuthState {
  login: (accessToken: string) => void;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Hydrate from localStorage / sessionStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem(STORAGE_KEY_TOKEN) ||
        localStorage.getItem(STORAGE_KEY_TOKEN) ||
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");

      if (stored) {
        const decoded = decodeJwtPayload(stored);
        if (decoded) {
          // Keep both storage locations in sync for 30-day session
          try {
            localStorage.setItem(STORAGE_KEY_TOKEN, stored);
            sessionStorage.setItem(STORAGE_KEY_TOKEN, stored);
          } catch (_) {}

          // Synchronize cookies for Edge middleware
          setAuthCookies(stored, decoded.role);

          setState({
            user: { userId: decoded.userId, role: decoded.role },
            accessToken: stored,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }

        // Token is invalid/expired — purge completely
        clearClientAuth(false);
      } else {
        // No token present — ensure no stale cookies linger
        clearClientAuth(false);
      }
    } catch {
      // storage unavailable
    }
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  // Listen to cross-tab logout or auth expiration events
  useEffect(() => {
    const handleAuthLogout = () => {
      setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    };

    window.addEventListener("fg_auth_logout", handleAuthLogout);
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY_TOKEN && !e.newValue) {
        handleAuthLogout();
      }
    });

    return () => {
      window.removeEventListener("fg_auth_logout", handleAuthLogout);
    };
  }, []);

  const login = useCallback((accessToken: string) => {
    const decoded = decodeJwtPayload(accessToken);
    if (!decoded) return;

    try {
      localStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
      sessionStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
    } catch {
      // storage blocked — still keep in memory
    }

    setAuthCookies(accessToken, decoded.role);

    setState({
      user: { userId: decoded.userId, role: decoded.role },
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    clearClientAuth(false);
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
