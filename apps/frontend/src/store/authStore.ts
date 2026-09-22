import { create } from "zustand";
export type UserRole = "CITIZEN" | "GOVERNMENT" | "UNIVERSITY" | "INDUSTRY";

export interface AuthUser {
  id: string;
  fullName: string;
  role: UserRole;
  email?: string | null;
  phone?: string | null;
  organizationName?: string | null;
  designation?: string | null;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("samadhansetu_token", token);
      localStorage.setItem("samadhansetu_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("samadhansetu_token");
      localStorage.removeItem("samadhansetu_user");
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  initialize: () => {
    if (typeof window !== "undefined") {
      try {
        const storedToken = localStorage.getItem("samadhansetu_token");
        const storedUser = localStorage.getItem("samadhansetu_user");
        if (storedToken && storedUser) {
          set({
            token: storedToken,
            user: JSON.parse(storedUser),
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      } catch (err) {
        console.error("Failed to rehydrate auth state:", err);
      }
    }
    set({ isLoading: false });
  },
}));
