/**
 * Axios 기반 API 클라이언트 (Cookie 기반)
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/api";
import { authCookies } from "@/lib/utils/cookies";
import { toast } from "sonner";

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
    return config;
  },
  (error) => {
    if (typeof window !== "undefined") {
      toast.error("요청 오류", {
        description: error.message || "API 요청 중 오류가 발생했습니다.",
      });
    }
    throw error;
  }
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;
      const url = error.config?.url;

      // 401 Unauthorized - 토큰 만료 또는 인증 실패
      if (status === 401) {
        toast.error("인증 오류", {
          description: "로그인이 필요합니다. 로그인 페이지로 이동합니다.",
        });
        authCookies.clear();
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
      // 403 Forbidden
      else if (status === 403) {
        toast.error("접근 권한 오류", {
          description: "해당 리소스에 접근할 권한이 없습니다.",
        });
      }
      // 404 Not Found
      else if (status === 404) {
        toast.error("리소스를 찾을 수 없음", {
          description: `요청한 리소스를 찾을 수 없습니다. (${url})`,
        });
      }
      // 500 Internal Server Error
      else if (status === 500) {
        toast.error("서버 오류", {
          description:
            "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
      // 기타 에러
      else if (error.code === "ECONNABORTED") {
        toast.error("요청 시간 초과", {
          description: "서버 응답이 지연되고 있습니다. 다시 시도해주세요.",
        });
      } else if (error.code === "ERR_NETWORK") {
        toast.error("네트워크 오류", {
          description: "네트워크 연결을 확인해주세요.",
        });
      } else {
        toast.error("오류 발생", {
          description: errorMessage || "알 수 없는 오류가 발생했습니다.",
        });
      }
    }

    throw error;
  }
);

export default apiClient;
