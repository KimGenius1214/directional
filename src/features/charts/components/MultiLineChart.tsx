/**
 * 멀티라인 차트 컴포넌트 (이중 Y축)
 */

"use client";

import { useState } from "react";
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

const CustomTooltip = ({
  active,
  payload,
  label,
  xAxisLabel,
  hoveredLineKey,
  lines,
}: {
  active?: boolean;
  payload?: Array<{
    color?: string;
    dataKey?: string | number;
    name?: string | number;
    value?: unknown;
    payload?: Record<string, unknown>;
  }>;
  label?: string | number;
  xAxisLabel?: string;
  hoveredLineKey?: string | null;
  lines?: LineConfig[];
}) => {
  // hoveredLineKey가 없으면 툴팁 표시 안 함
  if (!active || !payload || !payload.length || !hoveredLineKey || !lines)
    return null;

  // 모든 payload 항목을 확인하여 실제 값이 있는 항목들만 필터링
  const validPayloads = payload.filter(
    (p) => p.value !== undefined && p.value !== null
  );

  if (validPayloads.length === 0) return null;

  // 호버한 라인의 정보 찾기
  const hoveredLine = lines.find(
    (line) => `${line.team}-${line.key}` === hoveredLineKey
  );

  if (!hoveredLine) return null;

  // 호버한 라인의 데이터만 찾기
  const hoveredData = validPayloads.find((item) => {
    const dataKey = String(item.dataKey);
    return dataKey === hoveredLineKey;
  });

  if (!hoveredData) return null;

  // 팀명과 필드명 추출
  const [teamName, fieldName] = hoveredLineKey.split("-");

  // 필드명을 한글로 변환
  const getKoreanName = (field: string) => {
    switch (field) {
      case "bugs":
        return "버그 수";
      case "productivity":
        return "생산성";
      case "meetingsMissed":
        return "회의불참";
      case "morale":
        return "사기";
      default:
        return field;
    }
  };

  const koreanName = getKoreanName(fieldName);

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800 max-w-xs transition-opacity duration-200 ease-in-out"
      style={{
        opacity: 1,
      }}
    >
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        {xAxisLabel}: <span className="font-semibold">{label}</span>
      </p>
      <div>
        <p className="mb-1 font-bold text-gray-900 dark:text-white text-sm">
          {teamName}
        </p>
        <div className="pl-2">
          <p
            className="text-xs font-medium"
            style={{ color: hoveredData.color }}
          >
            {koreanName}:{" "}
            <span className="font-bold">{Number(hoveredData.value)}</span>
          </p>
        </div>
      </div>
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
  const [hoveredLineKey, setHoveredLineKey] = useState<string | null>(null);

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
      {/* 차트 (모바일에서 가로 스크롤 가능) */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <ResponsiveContainer
            width="100%"
            height={400}
            className="sm:!h-[500px]"
          >
            <LineChart
              data={mergedData}
              margin={{ top: 10, right: 60, left: 60, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={xAxisKey}
                label={{
                  value: xAxisLabel,
                  position: "insideBottom",
                  offset: -5,
                  style: { fill: "#6b7280", fontSize: 11 },
                }}
                tick={{ fill: "#6b7280", fontSize: 10 }}
                stroke="#9ca3af"
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: leftYAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#6b7280", fontSize: 11 },
                }}
                tick={{ fill: "#6b7280", fontSize: 10 }}
                stroke="#9ca3af"
                width={55}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: rightYAxisLabel,
                  angle: 90,
                  position: "insideRight",
                  style: { fill: "#6b7280", fontSize: 11 },
                }}
                tick={{ fill: "#6b7280", fontSize: 10 }}
                stroke="#9ca3af"
                width={55}
              />
              <Tooltip
                animationDuration={0}
                isAnimationActive={false}
                content={(props) => (
                  <CustomTooltip
                    {...props}
                    xAxisLabel={xAxisLabel}
                    hoveredLineKey={hoveredLineKey}
                    lines={lines}
                  />
                )}
              />
              <Legend content={() => null} />
              {/* 먼저 투명한 두꺼운 선들을 모두 렌더링 (호버 영역) */}
              {lines.map((line) => {
                const legendKey = `${line.team}-${line.key}`;
                const legendItem = legendItems[legendKey];
                if (!legendItem || !legendItem.visible) return null;

                const dataKey = `${line.team}-${line.key}`;

                return (
                  <Line
                    key={`${legendKey}-hover`}
                    type="monotone"
                    dataKey={dataKey}
                    stroke={legendItem.color}
                    strokeOpacity={0}
                    strokeWidth={15}
                    yAxisId={line.yAxisId}
                    dot={false}
                    activeDot={false}
                    connectNulls
                    onMouseEnter={() => {
                      setHoveredLineKey(legendKey);
                    }}
                    onMouseLeave={() => {
                      setHoveredLineKey(null);
                    }}
                    style={{ cursor: "pointer" }}
                    isAnimationActive={false}
                  />
                );
              })}
              {/* 그 다음 실제 보이는 선들을 렌더링 */}
              {lines.map((line) => {
                const legendKey = `${line.team}-${line.key}`;
                const legendItem = legendItems[legendKey];
                if (!legendItem || !legendItem.visible) return null;

                // 병합된 데이터의 키는 "팀명-필드명" 형태
                const dataKey = `${line.team}-${line.key}`;

                // shape에 따라 다른 마커 표시
                // circle (원형) → 실선 라인 (bugs, meetingMissed)
                // square (사각형) → 점선 라인 (productivity, morale)
                const dotShape =
                  line.shape === "square"
                    ? (props: { cx: number; cy: number; index?: number }) => {
                        const { cx, cy, index } = props;
                        return (
                          <rect
                            key={`dot-${dataKey}-${index}`}
                            x={cx - 6}
                            y={cy - 6}
                            width={12}
                            height={12}
                            fill={legendItem.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        );
                      }
                    : {
                        fill: legendItem.color,
                        r: 6,
                        strokeWidth: 2,
                        stroke: "#fff",
                      };

                const activeDotShape =
                  line.shape === "square"
                    ? (props: { cx: number; cy: number; index?: number }) => {
                        const { cx, cy, index } = props;
                        return (
                          <rect
                            key={`active-dot-${dataKey}-${index}`}
                            x={cx - 8}
                            y={cy - 8}
                            width={16}
                            height={16}
                            fill={legendItem.color}
                            stroke="#fff"
                            strokeWidth={3}
                          />
                        );
                      }
                    : {
                        r: 8,
                        fill: legendItem.color,
                        stroke: "#fff",
                        strokeWidth: 3,
                      };

                return (
                  <Line
                    key={legendKey}
                    type="monotone"
                    dataKey={dataKey}
                    stroke={legendItem.color}
                    strokeWidth={3}
                    strokeDasharray={line.strokeDasharray}
                    yAxisId={line.yAxisId}
                    name={legendItem.label || line.label}
                    dot={dotShape}
                    activeDot={{
                      ...activeDotShape,
                      onMouseEnter: () => {
                        setHoveredLineKey(legendKey);
                      },
                      onMouseLeave: () => {
                        setHoveredLineKey(null);
                      },
                    }}
                    connectNulls
                    onMouseEnter={() => {
                      setHoveredLineKey(legendKey);
                    }}
                    onMouseLeave={() => {
                      setHoveredLineKey(null);
                    }}
                    style={{ cursor: "pointer" }}
                    isAnimationActive={true}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 커스텀 범례 (차트 아래) */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {teams.map((team) => {
          const teamLines = lines.filter((l) => l.team === team);
          return teamLines.map((line) => {
            const legendKey = `${line.team}-${line.key}`;
            const legendItem = legendItems[legendKey];
            if (!legendItem) return null;

            return (
              <div
                key={legendKey}
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 bg-white px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <input
                  type="color"
                  value={legendItem.color}
                  onChange={(e) => updateColor(legendKey, e.target.value)}
                  className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer rounded border-0"
                />
                <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={legendItem.visible}
                    onChange={() => toggleItem(legendKey)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {legendItem.label || line.label}
                  </span>
                  {line.strokeDasharray && (
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      (점선)
                    </span>
                  )}
                </label>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
