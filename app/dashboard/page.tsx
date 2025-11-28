/**
 * 대시보드 페이지
 */

"use client";

import { Sidebar } from "@/components/layout";
import {
  useTopCoffeeBrands,
  usePopularSnackBrands,
} from "@/features/charts/hooks";
import {
  ChartCard,
  SimpleBarChart,
  SimpleDonutChart,
} from "@/features/charts/components";

export default function DashboardPage() {
  // 차트 데이터 조회
  const coffeeBrands = useTopCoffeeBrands();
  const snackBrands = usePopularSnackBrands();

  // 차트 데이터 변환
  const coffeeChartData = coffeeBrands.data?.data?.map((item) => ({
    brand: item.brand,
    count: item.count,
    name: item.brand,
    value: item.count,
  }));

  const snackChartData = snackBrands.data?.data?.map((item) => ({
    brand: item.brand,
    count: item.count,
    name: item.brand,
    value: item.count,
  }));

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  📊 대시보드
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  데이터 시각화 및 통계 분석
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
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
                  {coffeeChartData && (
                    <SimpleBarChart
                      data={coffeeChartData}
                      dataKey="count"
                      xAxisKey="brand"
                      color="#8884d8"
                    />
                  )}
                </ChartCard>

                {/* 커피 브랜드 - 도넛 차트 */}
                <ChartCard
                  title="인기 커피 브랜드 (도넛 차트)"
                  description="브랜드별 점유율"
                  isLoading={coffeeBrands.isLoading}
                >
                  {coffeeChartData && (
                    <SimpleDonutChart data={coffeeChartData} />
                  )}
                </ChartCard>

                {/* 스낵 브랜드 - 바 차트 */}
                <ChartCard
                  title="인기 스낵 브랜드 (바 차트)"
                  description="각 브랜드별 인기도"
                  isLoading={snackBrands.isLoading}
                >
                  {snackChartData && (
                    <SimpleBarChart
                      data={snackChartData}
                      dataKey="count"
                      xAxisKey="brand"
                      color="#82ca9d"
                    />
                  )}
                </ChartCard>

                {/* 스낵 브랜드 - 도넛 차트 */}
                <ChartCard
                  title="인기 스낵 브랜드 (도넛 차트)"
                  description="브랜드별 점유율"
                  isLoading={snackBrands.isLoading}
                >
                  {snackChartData && <SimpleDonutChart data={snackChartData} />}
                </ChartCard>
              </div>
            </div>

            {/* 추가 차트 섹션 (향후 구현) */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                주간 트렌드
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard
                  title="주간 기분 트렌드"
                  description="스택형 바/면적 차트 (구현 예정)"
                >
                  <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>주간 기분 트렌드 차트</p>
                  </div>
                </ChartCard>

                <ChartCard
                  title="주간 운동 트렌드"
                  description="스택형 바/면적 차트 (구현 예정)"
                >
                  <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>주간 운동 트렌드 차트</p>
                  </div>
                </ChartCard>
              </div>
            </div>

            {/* 멀티라인 차트 섹션 (향후 구현) */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                상세 분석
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <ChartCard
                  title="커피 소비량"
                  description="멀티라인 차트 (구현 예정)"
                >
                  <div className="flex h-96 items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>커피 소비량 멀티라인 차트</p>
                  </div>
                </ChartCard>

                <ChartCard
                  title="스낵 영향도"
                  description="멀티라인 차트 (구현 예정)"
                >
                  <div className="flex h-96 items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>스낵 영향도 멀티라인 차트</p>
                  </div>
                </ChartCard>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
