/**
 * 멀티라인 차트 컴포넌트 (이중 Y축)
 */

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartLegend } from "../hooks/use-chart-legend";

interface LineConfig {
  key: string;
  team: string;
  color: string;
  label: string;
  yAxisId: "left" | "right";
  strokeDasharray?: string;
  shape?: "circle" | "square";
}

interface DataItem {
  [key: string]: string | number;
  team: string;
}

interface MultiLineChartProps {
  data: DataItem[];
  xAxisKey: string;
  xAxisLabel: string;
  leftYAxisLabel: string;
  rightYAxisLabel: string;
  lines: LineConfig[];
  chartId: string;
}

interface TooltipPayload {
  color: string;
  dataKey: string;
  name: string;
  value: number;
  payload?: {
    team?: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  // 같은 팀의 데이터만 표시
  const team = payload[0]?.payload?.team;
  const teamData = payload.filter((p) => p.payload?.team === team);

  if (teamData.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-2 font-semibold text-gray-900 dark:text-white">{team}</p>
      <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
        {`${payload[0]?.name}: ${label}`}
      </p>
      {teamData.map((entry, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {`${entry.dataKey}: ${entry.value}`}
        </p>
      ))}
    </div>
  );
};

export default function MultiLineChart({
  data,
  xAxisKey,
  xAxisLabel,
  leftYAxisLabel,
  rightYAxisLabel,
  lines,
  chartId,
}: MultiLineChartProps) {
  const { legendItems, toggleItem, updateColor } = useChartLegend(
    chartId,
    lines.map((line) => ({
      key: `${line.team}-${line.key}`,
      color: line.color,
      label: line.label,
    }))
  );

  // 팀별로 데이터 그룹화
  const teams = Array.from(new Set(data.map((d) => d.team)));

  // X축 기준으로 데이터를 병합 (팀별로 분리된 데이터를 하나의 X축 값으로 합침)
  const mergedData = data.reduce((acc: DataItem[], item: DataItem) => {
    const existing = acc.find((d) => d[xAxisKey] === item[xAxisKey]);
    if (existing) {
      // 같은 X축 값이 있으면 팀별 데이터 추가
      Object.keys(item).forEach((key) => {
        if (key !== xAxisKey && key !== "team") {
          existing[`${item.team}-${key}`] = item[key];
        }
      });
    } else {
      // 새로운 X축 값이면 새 객체 생성
      const newItem: DataItem = {
        [xAxisKey]: item[xAxisKey],
        team: item.team,
      };
      Object.keys(item).forEach((key) => {
        if (key !== xAxisKey && key !== "team") {
          newItem[`${item.team}-${key}`] = item[key];
        }
      });
      acc.push(newItem);
    }
    return acc;
  }, []);

  // X축 값으로 정렬
  mergedData.sort((a, b) => Number(a[xAxisKey]) - Number(b[xAxisKey]));

  return (
    <div className="space-y-4">
      {/* 커스텀 범례 */}
      <div className="flex flex-wrap gap-3 justify-center">
        {teams.map((team) => {
          const teamLines = lines.filter((l) => l.team === team);
          return teamLines.map((line) => {
            const legendKey = `${line.team}-${line.key}`;
            const legendItem = legendItems[legendKey];
            if (!legendItem) return null;

            return (
              <div
                key={legendKey}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <input
                  type="color"
                  value={legendItem.color}
                  onChange={(e) => updateColor(legendKey, e.target.value)}
                  className="h-6 w-6 cursor-pointer rounded border-0"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={legendItem.visible}
                    onChange={() => toggleItem(legendKey)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {legendItem.label || line.label}
                  </span>
                  {line.strokeDasharray && (
                    <span className="text-xs text-gray-500">(점선)</span>
                  )}
                </label>
              </div>
            );
          });
        })}
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={mergedData}
          margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -5,
              style: { fill: "#6b7280", fontSize: 12 },
            }}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            yAxisId="left"
            label={{
              value: leftYAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { fill: "#6b7280", fontSize: 12 },
            }}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#9ca3af"
            width={70}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: rightYAxisLabel,
              angle: 90,
              position: "insideRight",
              style: { fill: "#6b7280", fontSize: 12 },
            }}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#9ca3af"
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={() => null} />
          {lines.map((line) => {
            const legendKey = `${line.team}-${line.key}`;
            const legendItem = legendItems[legendKey];
            if (!legendItem || !legendItem.visible) return null;

            // 병합된 데이터의 키는 "팀명-필드명" 형태
            const dataKey = `${line.team}-${line.key}`;

            return (
              <Line
                key={legendKey}
                type="monotone"
                dataKey={dataKey}
                stroke={legendItem.color}
                strokeWidth={2}
                strokeDasharray={line.strokeDasharray}
                yAxisId={line.yAxisId}
                name={legendItem.label || line.label}
                dot={{
                  fill: legendItem.color,
                  r: 4,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
