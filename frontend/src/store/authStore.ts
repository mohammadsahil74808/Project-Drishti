/**
 * SentinelX AI — Auth Store (Zustand)
 *
 * Holds the current session (user + tokens) and exposes login/logout
 * actions. Persisted to localStorage so a refresh doesn't kick the officer
 * back to the login screen mid-shift.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginResponse } from "@/types";
import { tokenStorage } from "@/api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  loginSuccess: (payload: LoginResponse) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      loginSuccess: (payload) => {
        tokenStorage.setTokens(payload.access_token, payload.refresh_token);
        set({ user: payload.user, isAuthenticated: true });
      },

      logout: () => {
        tokenStorage.clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "sentinelx-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

/** Convenience selector — role helpers used throughout the dashboard shell */
export const useCurrentRole = () => useAuthStore((s) => s.user?.role ?? null);
