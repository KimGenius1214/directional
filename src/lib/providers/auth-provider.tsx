/**
 * 인증 초기화 프로바이더
 */

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // 쿠키에서 인증 정보 복원
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
