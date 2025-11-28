/**
 * 인증 상태 관리 스토어
 */

import { create } from "zustand";
import type { AuthState } from "@/types/auth";

interface AuthStore extends AuthState {
  login: (token: string, user: { id: string; email: string }) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
    set({ token });
  },
}));
