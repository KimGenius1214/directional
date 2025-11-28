/**
 * 차트 데이터 API 엔드포인트
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  TopCoffeeBrandsResponse,
  PopularSnackBrandsResponse,
  WeeklyMoodTrendResponse,
  WeeklyWorkoutTrendResponse,
  CoffeeConsumptionResponse,
  SnackImpactResponse,
} from '@/types/chart';

export const chartsApi = {
  /**
   * 인기 커피 브랜드 데이터
   */
  getTopCoffeeBrands: async (): Promise<TopCoffeeBrandsResponse> => {
    const response = await apiClient.get<TopCoffeeBrandsResponse>(
      API_ENDPOINTS.MOCK.TOP_COFFEE_BRANDS
    );
    return response.data;
  },

  /**
   * 인기 스낵 브랜드 데이터
   */
  getPopularSnackBrands: async (): Promise<PopularSnackBrandsResponse> => {
    const response = await apiClient.get<PopularSnackBrandsResponse>(
      API_ENDPOINTS.MOCK.POPULAR_SNACK_BRANDS
    );
    return response.data;
  },

  /**
   * 주간 기분 트렌드 데이터
   */
  getWeeklyMoodTrend: async (): Promise<WeeklyMoodTrendResponse> => {
    const response = await apiClient.get<WeeklyMoodTrendResponse>(
      API_ENDPOINTS.MOCK.WEEKLY_MOOD_TREND
    );
    return response.data;
  },

  /**
   * 주간 운동 트렌드 데이터
   */
  getWeeklyWorkoutTrend: async (): Promise<WeeklyWorkoutTrendResponse> => {
    const response = await apiClient.get<WeeklyWorkoutTrendResponse>(
      API_ENDPOINTS.MOCK.WEEKLY_WORKOUT_TREND
    );
    return response.data;
  },

  /**
   * 커피 소비 데이터
   */
  getCoffeeConsumption: async (): Promise<CoffeeConsumptionResponse> => {
    const response = await apiClient.get<CoffeeConsumptionResponse>(
      API_ENDPOINTS.MOCK.COFFEE_CONSUMPTION
    );
    return response.data;
  },

  /**
   * 스낵 영향 데이터
   */
  getSnackImpact: async (): Promise<SnackImpactResponse> => {
    const response = await apiClient.get<SnackImpactResponse>(
      API_ENDPOINTS.MOCK.SNACK_IMPACT
    );
    return response.data;
  },
};

