# Health Check & Mock Data 사용 가이드

## 📋 개요

이 문서는 Health Check 기능과 Mock Data 사용 방법을 설명합니다.

## 🏥 Health Check

### 기능 설명

Health Check는 앱 초기화 시 API 서버의 상태를 자동으로 확인하고 주기적으로 모니터링하는 기능입니다.

### 구현 위치

1. **API 엔드포인트**: `src/lib/api/endpoints/health.ts`
2. **Provider**: `src/lib/providers/health-check-provider.tsx`
3. **통합**: `app/layout.tsx`

### 작동 방식

```typescript
// 앱 초기화 시 자동 실행
✅ Health Check 성공: { status: "ok", timestamp: "...", uptime: 12345 }

// 5분마다 자동 체크
// 실패 시 콘솔에 에러 로그
❌ Health Check 실패: Error message
```

### 활용 방법

#### 1. 컴포넌트에서 상태 확인

```typescript
import { useHealthCheck } from "@/lib/providers/health-check-provider";

function MyComponent() {
  const { isHealthy, lastChecked, error, checkHealth } = useHealthCheck();

  if (!isHealthy) {
    return <div>API 서버에 연결할 수 없습니다: {error}</div>;
  }

  return <div>서버 정상 (마지막 체크: {lastChecked?.toLocaleString()})</div>;
}
```

#### 2. 수동으로 Health Check 실행

```typescript
const { checkHealth } = useHealthCheck();

// 버튼 클릭 시 수동 체크
<button onClick={checkHealth}>서버 상태 확인</button>;
```

#### 3. 대시보드에 상태 표시

```typescript
function StatusIndicator() {
  const { isHealthy, lastChecked } = useHealthCheck();

  return (
    <div className={isHealthy ? "text-green-500" : "text-red-500"}>
      <span>{isHealthy ? "●" : "○"}</span>
      <span>{isHealthy ? "연결됨" : "연결 끊김"}</span>
    </div>
  );
}
```

### 설정 변경

Health Check 주기를 변경하려면 `health-check-provider.tsx` 파일의 interval 값을 수정하세요:

```typescript
// 현재: 5분 (5 * 60 * 1000)
const interval = setInterval(performHealthCheck, 5 * 60 * 1000);

// 1분으로 변경
const interval = setInterval(performHealthCheck, 1 * 60 * 1000);

// 10초로 변경 (개발 중 테스트용)
const interval = setInterval(performHealthCheck, 10 * 1000);
```

## 🎭 Mock Data (목업 데이터)

### 기능 설명

Mock Data는 실제 API 대신 테스트용 데이터를 사용할 수 있는 기능입니다. 게시판에서 토글 스위치로 쉽게 전환할 수 있습니다.

### 사용 방법

#### 1. 게시판에서 토글

```
게시판 페이지 → 검색창 하단의 "목업 데이터 사용" 체크박스 클릭
```

- ✅ 체크: `/mock/posts` API 사용 (테스트 데이터)
- ☐ 체크 해제: `/posts` API 사용 (실제 데이터)

#### 2. 토글 상태 표시

토글 스위치 옆에 현재 사용 중인 API 경로가 표시됩니다:

- `API: /mock/posts` - Mock 데이터 사용 중
- `API: /posts` - 실제 API 사용 중

### 구현 위치

1. **API 함수**: `src/lib/api/endpoints/posts.ts` → `getMockPosts()`
2. **Hook**: `src/features/posts/hooks/use-posts.ts` → `usePosts(filters, useMockData)`
3. **UI 컴포넌트**: `src/features/posts/components/TableToolbar.tsx`
4. **페이지**: `app/posts/page.tsx`

### 기술적 특징

#### Mock 데이터 필터링

Mock 데이터는 클라이언트 사이드에서 필터링됩니다:

```typescript
// 검색어 필터링
if (filters.search) {
  filteredPosts = posts.filter(
    (post) => post.title.includes(search) || post.body.includes(search)
  );
}

// 카테고리 필터링
if (filters.category) {
  filteredPosts = posts.filter((post) => post.category === filters.category);
}
```

#### React Query 캐시 분리

Mock 데이터와 실제 데이터는 별도의 캐시 키를 사용합니다:

```typescript
queryKey: ["posts", filters, useMockData];
//                            ^^^^^^^^^^^
//                            캐시 키에 포함되어 분리 관리
```

### 활용 시나리오

#### 1. 개발 중 테스트

- API 서버 없이 UI 개발 가능
- 다양한 데이터 시나리오 테스트

#### 2. 데모 및 프레젠테이션

- 안정적인 샘플 데이터로 기능 시연
- 실제 데이터 노출 방지

#### 3. 오프라인 개발

- 인터넷 연결 없이 개발 가능
- 빠른 프로토타이핑

## 📊 API 엔드포인트 목록

### Health Check

- `GET /health` - 서버 상태 확인

### Posts (실제 API)

- `GET /posts` - 게시글 목록 (페이지네이션)
- `GET /posts/:id` - 게시글 상세
- `POST /posts` - 게시글 작성
- `PATCH /posts/:id` - 게시글 수정
- `DELETE /posts/:id` - 게시글 삭제

### Mock Data

- `GET /mock/posts` - 목업 게시글 목록
- `GET /mock/top-coffee-brands` - 커피 브랜드 데이터
- `GET /mock/popular-snack-brands` - 스낵 브랜드 데이터
- `GET /mock/weekly-mood-trend` - 주간 기분 트렌드
- `GET /mock/weekly-workout-trend` - 주간 운동 트렌드
- `GET /mock/coffee-consumption` - 커피 소비량
- `GET /mock/snack-impact` - 스낵 영향도

## 🔧 확장 가능성

### 다른 기능에 Mock Data 추가

1. API 상수에 엔드포인트 추가:

```typescript
// src/constants/api.ts
MOCK: {
  NEW_FEATURE: "/mock/new-feature",
}
```

2. API 함수 추가:

```typescript
// src/lib/api/endpoints/feature.ts
getMockFeature: async () => {
  const response = await apiClient.get(API_ENDPOINTS.MOCK.NEW_FEATURE);
  return response.data;
};
```

3. Hook에서 조건부 처리:

```typescript
export const useFeature = (useMockData = false) => {
  return useQuery({
    queryKey: ["feature", useMockData],
    queryFn: () =>
      useMockData ? featureApi.getMockFeature() : featureApi.getFeature(),
  });
};
```

## 📚 참고 자료

- API 문서: https://fe-hiring-rest-api.vercel.app/docs
- React Query 문서: https://tanstack.com/query/latest
- Zustand 문서: https://zustand-demo.pmnd.rs/

## ⚠️ 주의사항

1. **Mock 데이터는 읽기 전용**

   - 생성/수정/삭제 기능은 Mock 모드에서 실제로 작동하지 않습니다
   - UI만 업데이트되고 새로고침 시 원래 상태로 돌아갑니다

2. **프로덕션 환경**

   - 프로덕션 빌드에서는 Mock Data 토글을 제거하는 것을 권장합니다
   - 환경 변수로 기능 활성화 여부를 제어할 수 있습니다

3. **Health Check 빈도**
   - 너무 잦은 Health Check는 불필요한 네트워크 요청을 발생시킵니다
   - 적절한 interval 값을 설정하세요 (권장: 3-5분)

## 🎉 완료!

이제 Health Check로 API 서버 상태를 모니터링하고, Mock Data로 유연하게 개발할 수 있습니다! 🚀
