/**
 * 차트 범례 상태 관리 스토어
 */

import { create } from 'zustand';
import type { ChartLegendState, LegendItem } from '@/types/chart';

interface ChartLegendStore {
  legends: ChartLegendState;
  
  // 범례 초기화
  initLegend: (chartId: string, items: LegendItem[]) => void;
  
  // 범례 가시성 토글
  toggleLegendVisibility: (chartId: string, dataKey: string) => void;
  
  // 범례 색상 변경
  updateLegendColor: (chartId: string, dataKey: string, color: string) => void;
  
  // 특정 차트 범례 가져오기
  getLegend: (chartId: string) => ChartLegendState[string] | undefined;
  
  // 범례 리셋
  resetLegend: (chartId: string) => void;
}

export const useChartLegendStore = create<ChartLegendStore>((set, get) => ({
  legends: {},

  initLegend: (chartId, items) => {
    set((state) => {
      // 이미 초기화된 경우 스킵
      if (state.legends[chartId]) {
        return state;
      }

      const legendItems: ChartLegendState[string] = {};
      items.forEach((item) => {
        legendItems[item.dataKey] = {
          ...item,
          visible: true,
        };
      });

      return {
        legends: {
          ...state.legends,
          [chartId]: legendItems,
        },
      };
    });
  },

  toggleLegendVisibility: (chartId, dataKey) => {
    set((state) => {
      if (!state.legends[chartId] || !state.legends[chartId][dataKey]) {
        return state;
      }

      return {
        legends: {
          ...state.legends,
          [chartId]: {
            ...state.legends[chartId],
            [dataKey]: {
              ...state.legends[chartId][dataKey],
              visible: !state.legends[chartId][dataKey].visible,
            },
          },
        },
      };
    });
  },

  updateLegendColor: (chartId, dataKey, color) => {
    set((state) => {
      if (!state.legends[chartId] || !state.legends[chartId][dataKey]) {
        return state;
      }

      return {
        legends: {
          ...state.legends,
          [chartId]: {
            ...state.legends[chartId],
            [dataKey]: {
              ...state.legends[chartId][dataKey],
              color,
            },
          },
        },
      };
    });
  },

  getLegend: (chartId) => {
    return get().legends[chartId];
  },

  resetLegend: (chartId) => {
    set((state) => {
      const newLegends = { ...state.legends };
      delete newLegends[chartId];
      return { legends: newLegends };
    });
  },
}));

