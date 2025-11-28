/**
 * 차트 관련 타입 정의
 */

// 바 차트, 도넛 차트
export interface BrandData {
  brand: string;
  count: number;
}

export interface TopCoffeeBrandsResponse {
  data: BrandData[];
}

export interface PopularSnackBrandsResponse {
  data: BrandData[];
}

// 스택형 바/면적 차트
export interface WeeklyMoodData {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export interface WeeklyWorkoutData {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
}

export interface WeeklyMoodTrendResponse {
  data: WeeklyMoodData[];
}

export interface WeeklyWorkoutTrendResponse {
  data: WeeklyWorkoutData[];
}

// 멀티라인 차트
export interface CoffeeConsumptionData {
  cupsPerDay: number;
  team: string;
  bugs: number;
  productivity: number;
}

export interface SnackImpactData {
  snackCount: number;
  team: string;
  meetingsMissed: number;
  morale: number;
}

export interface CoffeeConsumptionResponse {
  data: CoffeeConsumptionData[];
}

export interface SnackImpactResponse {
  data: SnackImpactData[];
}

// 범례 상태 관리
export interface LegendItem {
  dataKey: string;
  visible: boolean;
  color: string;
  label?: string;
}

export interface ChartLegendState {
  [chartId: string]: {
    [dataKey: string]: LegendItem;
  };
}

