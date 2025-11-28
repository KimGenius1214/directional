/**
 * 실제 작동하는 바 차트 (범례 기능 포함)
 * 각 바(항목)마다 개별 색상 제어 가능
 */

"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartLegend } from "../hooks/use-chart-legend";

interface SimpleBarChartProps {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  xAxisKey: string;
  color?: string;
  chartId: string;
  label?: string;
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export default function SimpleBarChart({
  data,
  dataKey,
  xAxisKey,
  chartId,
}: SimpleBarChartProps) {
  // 각 항목(바)마다 개별 범례 아이템 생성
  const legendConfig = data.map((item, index) => ({
    key: String(item[xAxisKey]) || `item-${index}`,
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    label: String(item[xAxisKey]) || `항목 ${index + 1}`,
  }));

  const { legendItems, toggleItem, updateColor } = useChartLegend(
    chartId,
    legendConfig
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        데이터가 없습니다
      </div>
    );
  }

  // 보이는 데이터만 필터링
  const visibleData = data.filter((item) => {
    const itemKey = String(item[xAxisKey]);
    const legendItem = legendItems[itemKey];
    return legendItem?.visible !== false;
  });

  return (
    <div className="space-y-3">
      {/* 커스텀 범례 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {data.map((item, index) => {
          const itemKey = String(item[xAxisKey]);
          const legendItem = legendItems[itemKey];
          if (!legendItem) return null;

          return (
            <div
              key={`legend-${index}-${itemKey}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <input
                type="color"
                value={legendItem.color}
                onChange={(e) => updateColor(itemKey, e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-0"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legendItem.visible}
                  onChange={() => toggleItem(itemKey)}
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
        <RechartsBarChart
          data={visibleData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
          <Legend content={() => null} />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
            {visibleData.map((entry, index) => {
              const itemKey = String(entry[xAxisKey]);
              const legendItem = legendItems[itemKey];
              return (
                <Cell
                  key={`cell-${index}-${itemKey}`}
                  fill={
                    legendItem?.color ||
                    DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                  }
                />
              );
            })}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
