/**
 * 차트 관련 타입 정의
 */

// 바 차트, 도넛 차트
export interface BrandData {
  name?: string;
  brand?: string;
  share?: number;
  popularity?: number;
}

// API 응답이 직접 배열 형태
export type TopCoffeeBrandsResponse = BrandData[];

export type PopularSnackBrandsResponse = BrandData[];

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

// API 응답이 직접 배열 형태
export type WeeklyMoodTrendResponse = WeeklyMoodData[];

export type WeeklyWorkoutTrendResponse = WeeklyWorkoutData[];

// 멀티라인 차트
export interface CoffeeMetric {
  cups: number;
  bugs: number;
  productivity: number;
}

export interface CoffeeTeamData {
  team: string; // ✅ 'name'이 아니라 'team'
  series: CoffeeMetric[]; // ✅ 'metrics'가 아니라 'series'
}

export interface SnackMetric {
  snacks: number;
  meetingsMissed: number;
  morale: number;
}

export interface SnackDepartmentData {
  name: string;
  metrics: SnackMetric[];
}

// API 응답이 teams/departments 구조
export interface CoffeeConsumptionResponse {
  teams: CoffeeTeamData[];
}

export interface SnackImpactResponse {
  departments: SnackDepartmentData[];
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
