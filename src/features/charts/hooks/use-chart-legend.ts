/**
 * 차트 범례 상태 관리 훅
 */

import { useEffect } from "react";
import { useChartLegendStore } from "@/lib/store/chart-legend-store";

interface LegendConfig {
  key: string;
  color: string;
  label: string;
}

export const useChartLegend = (chartId: string, config: LegendConfig[]) => {
  const { legends, initLegend, toggleLegendVisibility, updateLegendColor } =
    useChartLegendStore();

  // 차트 초기화
  useEffect(() => {
    if (!legends[chartId]) {
      const items = config.map((c) => ({
        dataKey: c.key,
        color: c.color,
        label: c.label,
        visible: true,
      }));
      initLegend(chartId, items);
    }
  }, [chartId, legends, config, initLegend]);

  const legendItems = legends[chartId] || {};

  return {
    legendItems,
    toggleItem: (dataKey: string) => toggleLegendVisibility(chartId, dataKey),
    updateColor: (dataKey: string, color: string) =>
      updateLegendColor(chartId, dataKey, color),
  };
};
