/**
 * API 엔드포인트 상수
 */

export const API_BASE_URL = "https://fe-hiring-rest-api.vercel.app";

export const API_ENDPOINTS = {
  // Health Check
  HEALTH: "/health",

  // Auth
  AUTH: {
    LOGIN: "/auth/login",
  },

  // Posts
  POSTS: {
    BASE: "/posts",
    BY_ID: (id: string) => `/posts/${id}`,
  },

  // Mock Data - Charts
  MOCK: {
    POSTS: "/mock/posts",
    TOP_COFFEE_BRANDS: "/mock/top-coffee-brands",
    POPULAR_SNACK_BRANDS: "/mock/popular-snack-brands",
    WEEKLY_MOOD_TREND: "/mock/weekly-mood-trend",
    WEEKLY_WORKOUT_TREND: "/mock/weekly-workout-trend",
    COFFEE_CONSUMPTION: "/mock/coffee-consumption",
    SNACK_IMPACT: "/mock/snack-impact",
  },
} as const;
