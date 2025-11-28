/**
 * React Query Provider 설정
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 기본 옵션 설정
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
            retry: 1,
            // 에러 발생 시 Error Boundary로 전파하지 않음
            throwOnError: false,
          },
          mutations: {
            // mutation 에러 발생 시 Error Boundary로 전파하지 않음
            throwOnError: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
