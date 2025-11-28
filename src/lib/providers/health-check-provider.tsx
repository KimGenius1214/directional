/**
 * Health Check Provider
 * 앱 초기화 시 API 서버 상태를 확인하고 모니터링하는 Provider
 */

"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { healthApi } from "@/lib/api/endpoints";

interface HealthStatus {
  isHealthy: boolean;
  lastChecked: Date | null;
  error: string | null;
}

interface HealthCheckContextValue extends HealthStatus {
  checkHealth: () => Promise<void>;
}

const HealthCheckContext = createContext<HealthCheckContextValue | undefined>(
  undefined
);

export function useHealthCheck() {
  const context = useContext(HealthCheckContext);
  if (!context) {
    throw new Error("useHealthCheck must be used within HealthCheckProvider");
  }
  return context;
}

interface HealthCheckProviderProps {
  children: React.ReactNode;
}

export function HealthCheckProvider({ children }: HealthCheckProviderProps) {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    isHealthy: false,
    lastChecked: null,
    error: null,
  });

  const checkHealth = async () => {
    try {
      const response = await healthApi.check();
      setHealthStatus({
        isHealthy: response.status === "ok" || response.status === "healthy",
        lastChecked: new Date(),
        error: null,
      });
      // console.log("✅ Health Check 성공:", response);
    } catch (error) {
      setHealthStatus({
        isHealthy: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : "Health check failed",
      });
      console.error("❌ Health Check 실패:", error);
    }
  };

  // 초기 health check
  useEffect(() => {
    // 비동기 함수를 effect 내부에서 정의하여 사용
    let isMounted = true;

    const performHealthCheck = async () => {
      try {
        const response = await healthApi.check();
        if (isMounted) {
          setHealthStatus({
            isHealthy:
              response.status === "ok" || response.status === "healthy",
            lastChecked: new Date(),
            error: null,
          });
          // console.log("✅ Health Check 성공:", response);
        }
      } catch (error) {
        if (isMounted) {
          setHealthStatus({
            isHealthy: false,
            lastChecked: new Date(),
            error:
              error instanceof Error ? error.message : "Health check failed",
          });
          console.error("❌ Health Check 실패:", error);
        }
      }
    };

    performHealthCheck();

    // 5분마다 health check (선택사항)
    const interval = setInterval(performHealthCheck, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const value: HealthCheckContextValue = {
    ...healthStatus,
    checkHealth,
  };

  return (
    <HealthCheckContext.Provider value={value}>
      {children}
    </HealthCheckContext.Provider>
  );
}
