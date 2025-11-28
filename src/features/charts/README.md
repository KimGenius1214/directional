/\*\*

- 차트 기능 모듈 README
-
- 이 디렉토리는 데이터 시각화 차트 기능과 관련된 모든 코드를 포함합니다.
  \*/

## 구조

```
charts/
├── components/     # 차트 컴포넌트
├── hooks/          # React Query 훅
├── types/          # 차트 관련 타입 (필요시)
└── utils/          # 차트 유틸리티 함수
```

## 구현 예정

### 컴포넌트

- [ ] BarChart.tsx - 바 차트
- [ ] DonutChart.tsx - 도넛 차트
- [ ] StackedBarChart.tsx - 스택형 바 차트
- [ ] StackedAreaChart.tsx - 스택형 면적 차트
- [ ] MultiLineChart.tsx - 멀티라인 차트
- [ ] CustomLegend.tsx - 커스텀 범례
- [ ] ChartCard.tsx - 차트 래퍼 카드

### 훅

- [ ] use-chart-data.ts - 차트 데이터 조회
- [ ] use-legend.ts - 범례 상태 관리

### 유틸리티

- [ ] chart-helpers.ts - 차트 데이터 변환 함수
