/**
 * 차트 색상 및 설정 상수
 */

// 기본 차트 색상 팔레트
export const DEFAULT_CHART_COLORS = [
  '#8884d8', // 파란색
  '#82ca9d', // 초록색
  '#ffc658', // 노란색
  '#ff7c7c', // 빨간색
  '#a78bfa', // 보라색
  '#fb923c', // 주황색
  '#38bdf8', // 하늘색
  '#f472b6', // 핑크색
] as const;

// 팀별 색상 (멀티라인 차트용)
export const TEAM_COLORS: Record<string, string> = {
  Frontend: '#8884d8',
  Backend: '#82ca9d',
  AI: '#ffc658',
  DevOps: '#ff7c7c',
  Design: '#a78bfa',
  QA: '#fb923c',
} as const;

// 스택형 차트 색상
export const MOOD_COLORS = {
  happy: '#82ca9d',
  tired: '#ffc658',
  stressed: '#ff7c7c',
} as const;

export const WORKOUT_COLORS = {
  running: '#8884d8',
  cycling: '#82ca9d',
  stretching: '#a78bfa',
} as const;

// 차트 마진 설정
export const CHART_MARGIN = {
  top: 20,
  right: 30,
  left: 20,
  bottom: 20,
} as const;

