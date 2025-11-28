/**
 * 인증 초기화 프로바이더
 */

"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      // 쿠키에서 인증 정보 복원
      initializeAuth();
      // 초기화 완료 (비동기로 처리하여 cascading render 방지)
      setTimeout(() => setIsReady(true), 0);
    }
  }, [initializeAuth]);

  // 서버 사이드 렌더링 또는 초기화 전에는 로딩 상태
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return <>{children}</>;
}
