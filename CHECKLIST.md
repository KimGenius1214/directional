# 🎯 프로젝트 체크리스트

## ✅ 완료된 항목

### 기본 설정
- [x] 프로젝트 구조 설계
- [x] package.json 의존성 추가
- [x] TypeScript 설정 (경로 별칭)
- [x] Tailwind CSS 설정
- [x] .gitignore 설정

### 타입 정의
- [x] common.ts - 공통 타입
- [x] auth.ts - 인증 관련 타입
- [x] post.ts - 게시글 타입
- [x] chart.ts - 차트 타입

### 상수
- [x] api.ts - API 엔드포인트 상수
- [x] validation.ts - 검증 규칙 및 금칙어
- [x] chart-colors.ts - 차트 색상 팔레트

### API 클라이언트
- [x] client.ts - Axios 인스턴스 및 인터셉터
- [x] endpoints/auth.ts - 인증 API
- [x] endpoints/posts.ts - 게시글 API
- [x] endpoints/charts.ts - 차트 데이터 API

### 상태 관리
- [x] auth-store.ts - 인증 상태 (Zustand)
- [x] chart-legend-store.ts - 차트 범례 상태 (Zustand)
- [x] query-provider.tsx - React Query Provider

### 유틸리티
- [x] utils/index.ts - 공통 유틸리티 함수
  - cn() - 클래스 병합
  - formatDate() - 날짜 포맷
  - formatRelativeTime() - 상대 시간
  - debounce/throttle
  - 기타 헬퍼 함수

### UI 컴포넌트
- [x] Button - 버튼 컴포넌트
- [x] Input - 입력 컴포넌트
- [x] Modal - 모달 컴포넌트

### 라우팅
- [x] app/layout.tsx - 루트 레이아웃
- [x] app/page.tsx - 홈 페이지
- [x] app/login/page.tsx - 로그인 페이지
- [x] app/posts/page.tsx - 게시판 페이지 (스켈레톤)
- [x] app/dashboard/page.tsx - 대시보드 페이지 (스켈레톤)

### 문서
- [x] README.md - 프로젝트 소개
- [x] ARCHITECTURE.md - 아키텍처 문서
- [x] DEVELOPMENT.md - 개발 가이드
- [x] CHECKLIST.md - 체크리스트 (현재 파일)

---

## 🔄 구현 예정

### 게시판 기능
- [ ] PostsTable 컴포넌트
  - [ ] React Table 설정
  - [ ] 컬럼 정의
  - [ ] 컬럼 리사이징
  - [ ] 컬럼 숨김/보임
  - [ ] 정렬 기능
- [ ] PostFormModal 컴포넌트
  - [ ] React Hook Form 설정
  - [ ] Zod 검증 스키마
  - [ ] 금칙어 필터링
  - [ ] 태그 입력
- [ ] TableToolbar 컴포넌트
  - [ ] 검색 입력
  - [ ] 카테고리 필터
  - [ ] 정렬 선택
- [ ] 무한 스크롤
  - [ ] useInfiniteQuery
  - [ ] Intersection Observer
- [ ] React Query 훅
  - [ ] usePosts
  - [ ] usePost
  - [ ] useCreatePost
  - [ ] useUpdatePost
  - [ ] useDeletePost

### 차트 기능
- [ ] 바 차트 컴포넌트
  - [ ] 인기 커피 브랜드
  - [ ] 인기 스낵 브랜드
- [ ] 도넛 차트 컴포넌트
  - [ ] 인기 커피 브랜드
  - [ ] 인기 스낵 브랜드
- [ ] 스택형 바 차트
  - [ ] 주간 기분 트렌드
  - [ ] 주간 운동 트렌드
- [ ] 스택형 면적 차트
  - [ ] 주간 기분 트렌드
  - [ ] 주간 운동 트렌드
- [ ] 멀티라인 차트
  - [ ] 커피 소비량
  - [ ] 스낵 영향도
  - [ ] 듀얼 Y축
  - [ ] 커스텀 마커
  - [ ] 커스텀 툴팁
- [ ] CustomLegend 컴포넌트
  - [ ] 색상 변경
  - [ ] 가시성 토글
- [ ] React Query 훅
  - [ ] useTopCoffeeBrands
  - [ ] usePopularSnackBrands
  - [ ] useWeeklyMoodTrend
  - [ ] useWeeklyWorkoutTrend
  - [ ] useCoffeeConsumption
  - [ ] useSnackImpact

### 추가 기능
- [ ] 인증 가드 (ProtectedRoute)
- [ ] 에러 바운더리
- [ ] 로딩 스피너
- [ ] 토스트 알림
- [ ] 반응형 디자인 개선
- [ ] 다크 모드 (옵션)
- [ ] 접근성 개선 (ARIA)

### 최적화
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] React.memo 적용
- [ ] useMemo/useCallback 최적화
- [ ] 번들 크기 분석

### 테스트 (옵션)
- [ ] 단위 테스트 설정
- [ ] 컴포넌트 테스트
- [ ] API 테스트
- [ ] E2E 테스트

---

## 📦 다음 설치 필요 (옵션)

```bash
# 개발 도구
npm install -D @testing-library/react @testing-library/jest-dom jest

# 추가 UI 라이브러리
npm install react-toastify
npm install react-icons

# 유틸리티
npm install lodash
npm install @types/lodash -D
```

---

## 🚀 시작 가이드

### 1. 의존성 설치
```bash
cd directional
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. API 테스트
- Swagger 문서에서 테스트 계정 정보 확인
- 로그인 페이지에서 로그인 테스트

### 4. 다음 구현할 기능 선택
- 게시판 먼저 구현하기 (추천)
- 또는 차트부터 구현하기

---

## 📝 노트

### API 주의사항
- 토큰은 localStorage에 저장됨
- 401 에러 시 자동 로그아웃
- 모든 요청에 자동으로 Bearer 토큰 포함

### 상태 관리
- 인증 상태: Zustand (persist)
- 서버 데이터: React Query (캐싱)
- 차트 범례: Zustand

### 스타일링
- Tailwind CSS 유틸리티 사용
- cn() 함수로 조건부 클래스 병합
- 일관된 색상 팔레트 유지

---

**마지막 업데이트**: 2024-11-28

