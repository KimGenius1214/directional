/**
 * 쿠키 관리 유틸리티
 */

import Cookies from "universal-cookie";

const cookies = new Cookies();

const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
  USER_ID: "user_id",
} as const;

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7일
  sameSite: "lax" as const,
  // secure: process.env.NODE_ENV === 'production', // HTTPS에서만 (프로덕션)
};

export const authCookies = {
  /**
   * 인증 토큰 저장
   */
  setToken: (token: string) => {
    cookies.set(COOKIE_NAMES.AUTH_TOKEN, token, COOKIE_OPTIONS);
  },

  /**
   * 인증 토큰 가져오기
   */
  getToken: (): string | undefined => {
    return cookies.get(COOKIE_NAMES.AUTH_TOKEN);
  },

  /**
   * 사용자 ID 저장
   */
  setUserId: (userId: string) => {
    cookies.set(COOKIE_NAMES.USER_ID, userId, COOKIE_OPTIONS);
  },

  /**
   * 사용자 ID 가져오기
   */
  getUserId: (): string | undefined => {
    return cookies.get(COOKIE_NAMES.USER_ID);
  },

  /**
   * 모든 인증 정보 삭제
   */
  clear: () => {
    cookies.remove(COOKIE_NAMES.AUTH_TOKEN, { path: "/" });
    cookies.remove(COOKIE_NAMES.USER_ID, { path: "/" });
  },

  /**
   * 인증 상태 확인
   */
  isAuthenticated: (): boolean => {
    return !!cookies.get(COOKIE_NAMES.AUTH_TOKEN);
  },
};
