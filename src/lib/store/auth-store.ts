/**
 * 인증 상태 관리 스토어 (Cookie 기반)
 */

import { create } from "zustand";
import type { AuthState } from "@/types/auth";
import { authCookies } from "@/lib/utils/cookies";

interface AuthStore extends AuthState {
  login: (token: string, user: { id: string; email: string }) => void;
  logout: () => void;
  setToken: (token: string) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token, user) => {
    // 쿠키에 저장
    authCookies.setToken(token);
    authCookies.setUserId(user.id);

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    // 쿠키 삭제
    authCookies.clear();

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setToken: (token) => {
    authCookies.setToken(token);
    set({ token });
  },

  /**
   * 쿠키에서 인증 정보 복원
   */
  initializeAuth: () => {
    if (typeof window === "undefined") return;

    const token = authCookies.getToken();
    const userId = authCookies.getUserId();

    if (token && userId) {
      set({
        token,
        user: { id: userId, email: "" }, // 이메일은 필요시 API로 가져오기
        isAuthenticated: true,
      });
    }
  },
}));
