"use client";

/**
 * AuthContext — global authentication state for Friends Goal.
 *
 * Storage strategy:
 *   - accessToken  → sessionStorage  (cleared on tab close; not accessible by JS from other tabs)
 *   - role/userId  → sessionStorage  (decoded from the JWT payload on login)
 *
 * The refreshToken lives in an HttpOnly cookie set by the backend, so the
 * frontend never touches it directly.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

// ─── JWT payload decode (no library needed) ───────────────────────────────────

function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const base64 = token.split(".")[1];
    // Pad base64url to standard base64
    const padded = base64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    const payload = JSON.parse(json) as {
      userId?: string;
      role?: UserRole;
      exp?: number;
    };

    // Reject expired tokens before storing
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    if (!payload.userId || !payload.role) return null;

    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

const STORAGE_KEY_TOKEN = "fg_access_token";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Hydrate from sessionStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_TOKEN);
      if (stored) {
        const user = decodeJwtPayload(stored);
        if (user) {
          // Re-sync middleware cookies in case they were cleared (e.g. browser restart)
          document.cookie = `fg_auth=1; path=/; SameSite=Lax`;
          document.cookie = `fg_auth_role=${user.role}; path=/; SameSite=Lax`;
          setState({
            user,
            accessToken: stored,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
        // Token invalid/expired — clear it
        sessionStorage.removeItem(STORAGE_KEY_TOKEN);
      }
    } catch {
      // sessionStorage not available (e.g. incognito with storage blocked)
    }
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const login = useCallback((accessToken: string) => {
    const user = decodeJwtPayload(accessToken);
    if (!user) return;
    try {
      sessionStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
    } catch {
      // storage blocked — still keep in memory for this tab
    }
    // Write lightweight cookies so the Edge middleware can read auth state.
    // These are NOT HttpOnly so JS can clear them on logout.
    // SameSite=Lax is safe here — they carry no sensitive data.
    document.cookie = `fg_auth=1; path=/; SameSite=Lax`;
    document.cookie = `fg_auth_role=${user.role}; path=/; SameSite=Lax`;
    setState({ user, accessToken, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch {
      // ignore
    }
    // Clear middleware cookies
    document.cookie = "fg_auth=; path=/; max-age=0";
    document.cookie = "fg_auth_role=; path=/; max-age=0";
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
