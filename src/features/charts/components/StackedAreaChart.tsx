/**
 * 스택형 면적 차트 컴포넌트
 */

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartLegend } from "../hooks/use-chart-legend";

interface DataItem {
  [key: string]: string | number;
}

interface StackedAreaChartProps {
  data: DataItem[];
  xAxisKey: string;
  stackKeys: { key: string; color: string; label: string }[];
  chartId: string;
}

export default function StackedAreaChart({
  data,
  xAxisKey,
  stackKeys,
  chartId,
}: StackedAreaChartProps) {
  const { legendItems, toggleItem, updateColor } = useChartLegend(
    chartId,
    stackKeys
  );

  // 백분율로 변환
  const percentageData = data.map((item) => {
    const total = stackKeys.reduce(
      (sum, key) => sum + (Number(item[key.key]) || 0),
      0
    );
    const percentageItem: DataItem = { [xAxisKey]: item[xAxisKey] };

    stackKeys.forEach((key) => {
      percentageItem[key.key] =
        total > 0 ? ((Number(item[key.key]) || 0) / total) * 100 : 0;
    });

    return percentageItem;
  });

  return (
    <div className="space-y-4">
      {/* 커스텀 범례 */}
      <div className="flex flex-wrap gap-3 justify-center">
        {stackKeys.map((stack) => {
          const legendItem = legendItems[stack.key];
          if (!legendItem) return null;

          return (
            <div
              key={stack.key}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <input
                type="color"
                value={legendItem.color}
                onChange={(e) => updateColor(stack.key, e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-0"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legendItem.visible}
                  onChange={() => toggleItem(stack.key)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {legendItem.label || stack.label}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={percentageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#9ca3af"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.96)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number) => `${value.toFixed(1)}%`}
          />
          <Legend content={() => null} />
          {stackKeys.map((stack) => {
            const legendItem = legendItems[stack.key];
            if (!legendItem || !legendItem.visible) return null;

            return (
              <Area
                key={stack.key}
                type="monotone"
                dataKey={stack.key}
                stackId="1"
                stroke={legendItem.color}
                fill={legendItem.color}
                fillOpacity={0.6}
                name={legendItem.label || stack.label}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
