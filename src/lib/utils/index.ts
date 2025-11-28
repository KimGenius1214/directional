/**
 * 유틸리티 함수 모음
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 쿠키 유틸리티 re-export
export { authCookies } from "./cookies";

/**
 * Tailwind CSS 클래스 병합 (clsx + tailwind-merge)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 날짜 포맷팅
 */
export function formatDate(
  date: string | Date,
  format: "short" | "long" = "short"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 상대 시간 표시 (예: "3분 전", "2시간 전")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(d);
  }

  if (days > 0) {
    return `${days}일 전`;
  }

  if (hours > 0) {
    return `${hours}시간 전`;
  }

  if (minutes > 0) {
    return `${minutes}분 전`;
  }

  return "방금 전";
}

/**
 * 숫자를 천 단위 구분자로 포맷팅
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

/**
 * 배열에서 중복 제거
 */
export function uniqueArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 쓰로틀 함수
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 텍스트 자르기 (말줄임표 추가)
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

/**
 * 쿼리 파라미터를 객체로 변환
 */
export function parseQueryParams(
  searchParams: URLSearchParams
): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
