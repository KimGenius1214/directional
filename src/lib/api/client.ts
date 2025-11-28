/**
 * Axios 기반 API 클라이언트 (Cookie 기반)
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/api";
import { authCookies } from "@/lib/utils/cookies";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 쿠키에서 토큰 가져오기
    if (typeof window !== "undefined") {
      const token = authCookies.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log("🔵 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("🔴 API Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "🟢 API Response:",
      response.config.url,
      "Status:",
      response.status
    );
    console.log("📦 Response Data:", response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error(
      "🔴 API Error:",
      error.config?.url,
      error.response?.status,
      error.message
    );
    console.error("📦 Error Response:", error.response?.data);

    // 401 Unauthorized - 토큰 만료 또는 인증 실패
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        authCookies.clear();
        // 로그인 페이지로 리다이렉트
        window.location.href = "/login";
      }
    }

    // 403 Forbidden
    if (error.response?.status === 403) {
      console.error("접근 권한이 없습니다.");
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      console.error("요청한 리소스를 찾을 수 없습니다.");
    }

    // 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("서버 오류가 발생했습니다.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
