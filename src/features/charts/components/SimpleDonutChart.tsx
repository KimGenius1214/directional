/**
 * 실제 작동하는 도넛 차트 (범례 기능 포함)
 */

"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useChartLegend } from "../hooks/use-chart-legend";

const DEFAULT_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

interface SimpleDonutChartProps {
  data: Array<{
    name?: string;
    brand?: string;
    value?: number;
    popularity?: number;
    share?: number;
  }>;
  chartId: string;
}

export default function SimpleDonutChart({
  data,
  chartId,
}: SimpleDonutChartProps) {
  // 데이터 정규화 (다양한 필드명 지원)
  const normalizedData = data.map((item, index) => ({
    name: item.name || item.brand || `항목-${index + 1}`,
    value: item.value || item.popularity || item.share || 0,
    originalIndex: index, // 고유 식별자
  }));

  // 각 데이터 항목에 대한 범례 초기화
  const config = normalizedData.map((item, index) => ({
    key: item.name,
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    label: item.name,
  }));

  const { legendItems, toggleItem, updateColor } = useChartLegend(
    chartId,
    config
  );

  if (!normalizedData || normalizedData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        데이터가 없습니다
      </div>
    );
  }

  // 보이는 데이터만 필터링
  const visibleData = normalizedData.filter((item) => {
    const legendItem = legendItems[item.name];
    return legendItem?.visible !== false;
  });

  return (
    <div className="space-y-3">
      {/* 커스텀 범례 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {normalizedData.map((item) => {
          const legendItem = legendItems[item.name];
          if (!legendItem) return null;

          return (
            <div
              key={`legend-${item.originalIndex}-${item.name}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <input
                type="color"
                value={legendItem.color}
                onChange={(e) => updateColor(item.name, e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-0"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legendItem.visible}
                  onChange={() => toggleItem(item.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {legendItem.label}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={visibleData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
          >
            {visibleData.map((entry) => {
              const legendItem = legendItems[entry.name];
              return (
                <Cell
                  key={`cell-${entry.originalIndex}-${entry.name}`}
                  fill={legendItem?.color || DEFAULT_COLORS[0]}
                />
              );
            })}
          </Pie>
          <Tooltip />
          <Legend content={() => null} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
