/**
 * 차트 데이터 React Query 훅
 */

import { useQuery } from "@tanstack/react-query";
import { chartsApi } from "@/lib/api/endpoints";

/**
 * 인기 커피 브랜드 데이터
 */
export const useTopCoffeeBrands = () => {
  return useQuery({
    queryKey: ["charts", "coffee-brands"],
    queryFn: chartsApi.getTopCoffeeBrands,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 인기 스낵 브랜드 데이터
 */
export const usePopularSnackBrands = () => {
  return useQuery({
    queryKey: ["charts", "snack-brands"],
    queryFn: chartsApi.getPopularSnackBrands,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 주간 기분 트렌드 데이터
 */
export const useWeeklyMoodTrend = () => {
  return useQuery({
    queryKey: ["charts", "mood-trend"],
    queryFn: chartsApi.getWeeklyMoodTrend,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 주간 운동 트렌드 데이터
 */
export const useWeeklyWorkoutTrend = () => {
  return useQuery({
    queryKey: ["charts", "workout-trend"],
    queryFn: chartsApi.getWeeklyWorkoutTrend,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 커피 소비 데이터
 */
export const useCoffeeConsumption = () => {
  return useQuery({
    queryKey: ["charts", "coffee-consumption"],
    queryFn: chartsApi.getCoffeeConsumption,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 스낵 영향 데이터
 */
export const useSnackImpact = () => {
  return useQuery({
    queryKey: ["charts", "snack-impact"],
    queryFn: chartsApi.getSnackImpact,
    staleTime: 5 * 60 * 1000,
  });
};

