/**
 * Health Check API 엔드포인트
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "@/constants/api";

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export const healthApi = {
  /**
   * Health Check - API 서버 상태 확인
   * @returns {Promise<HealthResponse>} 서버 상태 정보
   */
  check: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>(API_ENDPOINTS.HEALTH);
    return response.data;
  },
};
