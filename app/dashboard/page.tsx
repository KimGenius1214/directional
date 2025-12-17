/**
 * 대시보드 페이지
 * Suspense와 Lazy Loading으로 최적화
 */

"use client";

import { Suspense, lazy } from "react";
import { Header } from "@/components/layout";
import {
  useTopCoffeeBrands,
  usePopularSnackBrands,
  useWeeklyMoodTrend,
  useWeeklyWorkoutTrend,
  useCoffeeConsumption,
  useSnackImpact,
} from "@/features/charts/hooks";
import { ChartCard } from "@/features/charts/components";

// Lazy load chart components
const SimpleBarChart = lazy(
  () => import("@/features/charts/components/SimpleBarChart")
);
const SimpleDonutChart = lazy(
  () => import("@/features/charts/components/SimpleDonutChart")
);
const StackedBarChart = lazy(
  () => import("@/features/charts/components/StackedBarChart")
);
const StackedAreaChart = lazy(
  () => import("@/features/charts/components/StackedAreaChart")
);
const MultiLineChart = lazy(
  () => import("@/features/charts/components/MultiLineChart")
);

// Chart loading fallback
const ChartLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      <p className="mt-2 text-sm text-gray-500">차트 로딩 중...</p>
    </div>
  </div>
);

// 기본 색상 팔레트
const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
  "#6366f1", // indigo
];

// 키 이름을 한글 라벨로 변환하는 매핑
const KEY_LABEL_MAP: Record<string, string> = {
  happy: "행복",
  tired: "피곤",
  stressed: "스트레스",
  running: "러닝",
  cycling: "사이클링",
  stretching: "스트레칭",
  bugs: "버그",
  productivity: "생산성",
  meetingsMissed: "회의불참",
  morale: "사기",
};

// 멀티라인 차트 필드 설정
interface FieldConfig {
  yAxisId: "left" | "right";
  shape: "circle" | "square";
  strokeDasharray?: string;
}

const FIELD_CONFIG_MAP: Record<string, FieldConfig> = {
  bugs: { yAxisId: "left", shape: "circle" },
  productivity: { yAxisId: "right", shape: "square", strokeDasharray: "5 5" },
  meetingsMissed: { yAxisId: "left", shape: "circle" },
  morale: { yAxisId: "right", shape: "square", strokeDasharray: "5 5" },
};

/**
 * 데이터에서 stackKeys를 동적으로 생성
 * @param data - 차트 데이터 배열
 * @param xAxisKey - X축에 사용할 키 (제외할 키)
 * @returns stackKeys 배열
 */
function generateStackKeys(
  data: Array<Record<string, string | number>>,
  xAxisKey: string
): { key: string; color: string; label: string }[] {
  if (!data || data.length === 0) return [];

  // 첫 번째 데이터 항목에서 모든 키 추출
  const firstItem = data[0];
  const keys = Object.keys(firstItem).filter(
    (key) => key !== xAxisKey && typeof firstItem[key] === "number"
  );

  return keys.map((key, index) => ({
    key,
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    label: KEY_LABEL_MAP[key] || key,
  }));
}

/**
 * 멀티라인 차트용 lines를 동적으로 생성
 * @param data - 차트 데이터 배열
 * @param xAxisKey - X축에 사용할 키 (제외할 키)
 * @returns lines 배열
 */
function generateMultiLineConfig(
  data: Array<Record<string, string | number>>,
  xAxisKey: string
): Array<{
  key: string;
  team: string;
  color: string;
  label: string;
  yAxisId: "left" | "right";
  strokeDasharray?: string;
  shape: "circle" | "square";
}> {
  if (!data || data.length === 0) return [];

  // 모든 팀 추출
  const teams = Array.from(
    new Set(data.map((item) => item.team as string))
  ).filter(Boolean);

  // 첫 번째 데이터 항목에서 숫자 필드 추출 (xAxisKey와 team 제외)
  const firstItem = data[0];
  const numericFields = Object.keys(firstItem).filter(
    (key) =>
      key !== xAxisKey && key !== "team" && typeof firstItem[key] === "number"
  );

  const lines: Array<{
    key: string;
    team: string;
    color: string;
    label: string;
    yAxisId: "left" | "right";
    strokeDasharray?: string;
    shape: "circle" | "square";
  }> = [];

  teams.forEach((team, teamIndex) => {
    numericFields.forEach((field) => {
      const fieldConfig = FIELD_CONFIG_MAP[field];
      if (!fieldConfig) return;

      const colorIndex = teamIndex % DEFAULT_COLORS.length;
      const fieldLabel = KEY_LABEL_MAP[field] || field;

      lines.push({
        key: field,
        team,
        color: DEFAULT_COLORS[colorIndex],
        label: `${team} - ${fieldLabel}`,
        yAxisId: fieldConfig.yAxisId,
        strokeDasharray: fieldConfig.strokeDasharray,
        shape: fieldConfig.shape,
      });
    });
  });

  return lines;
}

export default function DashboardPage() {
  // 차트 데이터 조회
  const coffeeBrands = useTopCoffeeBrands();
  const snackBrands = usePopularSnackBrands();
  const moodTrend = useWeeklyMoodTrend();
  const workoutTrend = useWeeklyWorkoutTrend();
  const coffeeConsumption = useCoffeeConsumption();
  const snackImpact = useSnackImpact();

  // 멀티라인 차트 데이터 변환
  const coffeeConsumptionData = coffeeConsumption.data?.teams
    ? coffeeConsumption.data.teams
        .filter((team) => {
          return team.series && Array.isArray(team.series);
        })
        .flatMap((team) => {
          return team.series.map((metric) => ({
            cupsPerDay: metric.cups,
            bugs: metric.bugs,
            productivity: metric.productivity,
            team: team.team,
          }));
        })
    : [];

  const snackImpactData = snackImpact.data?.departments
    ? snackImpact.data.departments
        .filter((dept) => dept.metrics && Array.isArray(dept.metrics))
        .flatMap((dept) =>
          dept.metrics.map((metric) => ({
            snackCount: metric.snacks,
            meetingsMissed: metric.meetingsMissed,
            morale: metric.morale,
            team: dept.name,
          }))
        )
    : [];

  // 차트 데이터 변환 (API 응답이 직접 배열 형태)
  const coffeeChartData = Array.isArray(coffeeBrands.data)
    ? coffeeBrands.data.map((item) => ({
        brand: item.brand || item.name || "Unknown",
        count: item.popularity || item.share || 0,
        name: item.brand || item.name || "Unknown",
        value: item.popularity || item.share || 0,
      }))
    : undefined;

  const snackChartData = Array.isArray(snackBrands.data)
    ? snackBrands.data.map((item) => ({
        brand: item.brand || item.name || "Unknown",
        count: item.popularity || item.share || 0,
        name: item.brand || item.name || "Unknown",
        value: item.popularity || item.share || 0,
      }))
    : undefined;

  // 스택형 차트 데이터 변환
  const moodTrendData =
    Array.isArray(moodTrend.data) && moodTrend.data.length > 0
      ? moodTrend.data.map((item) => ({
          week: item.week,
          happy: item.happy,
          tired: item.tired,
          stressed: item.stressed,
        }))
      : undefined;

  const workoutTrendData =
    Array.isArray(workoutTrend.data) && workoutTrend.data.length > 0
      ? workoutTrend.data.map((item) => ({
          week: item.week,
          running: item.running,
          cycling: item.cycling,
          stretching: item.stretching,
        }))
      : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  대시보드
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  데이터 시각화 및 통계 분석
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* 바 차트 & 도넛 차트 섹션 */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                인기 브랜드 통계
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* 커피 브랜드 - 바 차트 */}
                <ChartCard
                  title="인기 커피 브랜드 (바 차트)"
                  description="각 브랜드별 인기도"
                  isLoading={coffeeBrands.isLoading}
                >
                  {coffeeBrands.isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : coffeeChartData && coffeeChartData.length > 0 ? (
                    <Suspense fallback={<ChartLoader />}>
                      <SimpleBarChart
                        data={coffeeChartData}
                        dataKey="count"
                        xAxisKey="brand"
                        color="#8884d8"
                        chartId="coffee-bar"
                        label="점유율"
                      />
                    </Suspense>
                  ) : coffeeBrands.isLoading ? null : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>

                {/* 커피 브랜드 - 도넛 차트 */}
                <ChartCard
                  title="인기 커피 브랜드 (도넛 차트)"
                  description="브랜드별 점유율"
                  isLoading={coffeeBrands.isLoading}
                >
                  {coffeeBrands.isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : coffeeChartData && coffeeChartData.length > 0 ? (
                    <Suspense fallback={<ChartLoader />}>
                      <SimpleDonutChart
                        data={coffeeChartData}
                        chartId="coffee-donut"
                      />
                    </Suspense>
                  ) : coffeeBrands.isLoading ? null : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>

                {/* 스낵 브랜드 - 바 차트 */}
                <ChartCard
                  title="인기 스낵 브랜드 (바 차트)"
                  description="각 브랜드별 인기도"
                  isLoading={snackBrands.isLoading}
                >
                  {snackBrands.isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : snackChartData && snackChartData.length > 0 ? (
                    <Suspense fallback={<ChartLoader />}>
                      <SimpleBarChart
                        data={snackChartData}
                        dataKey="count"
                        xAxisKey="brand"
                        color="#82ca9d"
                        chartId="snack-bar"
                        label="점유율"
                      />
                    </Suspense>
                  ) : snackBrands.isLoading ? null : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>

                {/* 스낵 브랜드 - 도넛 차트 */}
                <ChartCard
                  title="인기 스낵 브랜드 (도넛 차트)"
                  description="브랜드별 점유율"
                  isLoading={snackBrands.isLoading}
                >
                  {snackBrands.isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : snackChartData && snackChartData.length > 0 ? (
                    <Suspense fallback={<ChartLoader />}>
                      <SimpleDonutChart
                        data={snackChartData}
                        chartId="snack-donut"
                      />
                    </Suspense>
                  ) : snackBrands.isLoading ? null : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>
              </div>
            </div>

            {/* 스택형 바 차트 섹션 */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                주간 트렌드 (스택형 바 차트)
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* 기분 트렌드 - 스택형 바 */}
                <ChartCard
                  title="주간 기분 트렌드 (스택형 바)"
                  description="주별 감정 상태 백분율"
                  isLoading={moodTrend.isLoading}
                >
                  {moodTrend.isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : moodTrendData ? (
                    <Suspense fallback={<ChartLoader />}>
                      <StackedBarChart
                        data={moodTrendData}
                        xAxisKey="week"
                        stackKeys={generateStackKeys(moodTrendData, "week")}
                        chartId="mood-stacked-bar"
                      />
                    </Suspense>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>

                {/* 운동 트렌드 - 스택형 바 */}
                <ChartCard
                  title="주간 운동 트렌드 (스택형 바)"
                  description="주별 운동 종류 백분율"
                  isLoading={workoutTrend.isLoading}
                >
                  {workoutTrend.isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : workoutTrendData ? (
                    <Suspense fallback={<ChartLoader />}>
                      <StackedBarChart
                        data={workoutTrendData}
                        xAxisKey="week"
                        stackKeys={generateStackKeys(workoutTrendData, "week")}
                        chartId="workout-stacked-bar"
                      />
                    </Suspense>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>
              </div>
            </div>

            {/* 스택형 면적 차트 섹션 */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                주간 트렌드 (스택형 면적 차트)
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* 기분 트렌드 - 스택형 면적 */}
                <ChartCard
                  title="주간 기분 트렌드 (스택형 면적)"
                  description="주별 감정 상태 백분율"
                  isLoading={moodTrend.isLoading}
                >
                  {moodTrend.isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : moodTrendData ? (
                    <Suspense fallback={<ChartLoader />}>
                      <StackedAreaChart
                        data={moodTrendData}
                        xAxisKey="week"
                        stackKeys={generateStackKeys(moodTrendData, "week")}
                        chartId="mood-stacked-area"
                      />
                    </Suspense>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>

                {/* 운동 트렌드 - 스택형 면적 */}
                <ChartCard
                  title="주간 운동 트렌드 (스택형 면적)"
                  description="주별 운동 종류 백분율"
                  isLoading={workoutTrend.isLoading}
                >
                  {workoutTrend.isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : workoutTrendData ? (
                    <Suspense fallback={<ChartLoader />}>
                      <StackedAreaChart
                        data={workoutTrendData}
                        xAxisKey="week"
                        stackKeys={generateStackKeys(workoutTrendData, "week")}
                        chartId="workout-stacked-area"
                      />
                    </Suspense>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>
              </div>
            </div>

            {/* 멀티라인 차트 섹션 */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                상세 분석 (멀티라인 차트)
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {/* 커피 소비량 */}
                <ChartCard
                  title="커피 소비량 분석"
                  description="팀별 커피 섭취량에 따른 버그 수와 생산성"
                  isLoading={coffeeConsumption.isLoading}
                >
                  {coffeeConsumption.isError ? (
                    <div className="flex h-96 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : coffeeConsumptionData &&
                    coffeeConsumptionData.length > 0 ? (
                    <Suspense fallback={<ChartLoader />}>
                      <MultiLineChart
                        data={coffeeConsumptionData}
                        xAxisKey="cupsPerDay"
                        xAxisLabel="커피 섭취량 (잔/일)"
                        leftYAxisLabel="버그 수"
                        rightYAxisLabel="생산성 점수"
                        lines={generateMultiLineConfig(
                          coffeeConsumptionData,
                          "cupsPerDay"
                        )}
                        chartId="coffee-consumption"
                      />
                    </Suspense>
                  ) : (
                    <div className="flex h-96 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>

                {/* 스낵 영향도 */}
                <ChartCard
                  title="스낵 영향도 분석"
                  description="팀별 스낵 수에 따른 회의불참과 사기"
                  isLoading={snackImpact.isLoading}
                >
                  {snackImpact.isError ? (
                    <div className="flex h-96 items-center justify-center text-red-500">
                      <p>데이터를 불러오는데 실패했습니다.</p>
                    </div>
                  ) : snackImpactData && snackImpactData.length > 0 ? (
                    <Suspense fallback={<ChartLoader />}>
                      <MultiLineChart
                        data={snackImpactData}
                        xAxisKey="snackCount"
                        xAxisLabel="스낵 수 (개/일)"
                        leftYAxisLabel="회의불참 횟수"
                        rightYAxisLabel="사기 점수"
                        lines={generateMultiLineConfig(
                          snackImpactData,
                          "snackCount"
                        )}
                        chartId="snack-impact"
                      />
                    </Suspense>
                  ) : (
                    <div className="flex h-96 items-center justify-center text-gray-500">
                      <p>데이터가 없습니다.</p>
                    </div>
                  )}
                </ChartCard>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
