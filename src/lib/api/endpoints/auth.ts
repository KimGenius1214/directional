/**
 * 인증 API 엔드포인트
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import type { LoginDto, LoginResponse } from '@/types/auth';

export const authApi = {
  /**
   * 로그인
   */
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  /**
   * 로그아웃 (클라이언트 사이드)
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};

