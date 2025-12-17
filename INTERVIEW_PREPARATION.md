# 🎯 면접 대비 - 기술 스택 및 설계 결정 사항

이 문서는 프로젝트에서 사용한 기술 스택과 설계 결정에 대한 면접 대비 자료입니다.

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택 선택 이유](#기술-스택-선택-이유)
3. [아키텍처 설계 결정](#아키텍처-설계-결정)
4. [상태 관리 전략](#상태-관리-전략)
5. [보안 설계](#보안-설계)
6. [성능 최적화](#성능-최적화)
7. [에러 처리 전략](#에러-처리-전략)
8. [주요 기능 구현 방식](#주요-기능-구현-방식)

---

## 📌 프로젝트 개요

**Directional**은 게시판 CRUD 기능과 데이터 시각화 차트를 제공하는 풀스택 웹 애플리케이션입니다.

### 핵심 요구사항

- JWT 기반 인증 시스템
- 게시글 CRUD (무한 스크롤, 검색, 필터링, 정렬)
- 다양한 차트 시각화 (바, 도넛, 스택, 멀티라인)
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 다크/라이트 모드

---

## 🛠️ 기술 스택 선택 이유

### 1. Next.js 16 (App Router)

**왜 선택했나요?**

- **서버 사이드 렌더링 (SSR)**: 초기 로딩 성능 향상
- **App Router**: 파일 기반 라우팅으로 직관적인 구조
- **미들웨어 지원**: 서버 사이드에서 인증 체크 가능
- **API Routes**: 필요시 백엔드 API도 같은 프로젝트에서 관리 가능

**대안과 비교**

- **Create React App**: 클라이언트 사이드만 지원, SEO 약함
- **Remix**: 좋은 선택이지만 Next.js가 더 널리 사용되고 생태계가 큼

**실제 활용 사례**

```typescript
// middleware.ts - 서버 사이드 인증 체크
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

---

### 2. React 19.2.0

**왜 선택했나요?**

- **최신 기능**: React 19의 성능 개선 및 새로운 훅 활용
- **컴포넌트 기반 아키텍처**: 재사용성과 유지보수성
- **풍부한 생태계**: 다양한 라이브러리 지원

**대안과 비교**

- **Vue.js**: 좋은 프레임워크지만 React가 더 널리 사용됨
- **Svelte**: 성능은 좋지만 생태계가 작음

---

### 3. TypeScript 5

**왜 선택했나요?**

- **타입 안정성**: 컴파일 타임에 오류 발견
- **자동완성**: 개발 생산성 향상
- **리팩토링 안전성**: 코드 변경 시 타입 체크로 안전성 보장
- **문서화 효과**: 타입 정의가 곧 문서 역할

**실제 활용 사례**

```typescript
// types/post.ts - 명확한 타입 정의
export interface Post {
  id: string;
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

### 4. Zustand (상태 관리)

**왜 Redux 대신 Zustand를 선택했나요?**

**Zustand의 장점:**

- ✅ **간단한 API**: 보일러플레이트 코드 최소화
- ✅ **작은 번들 크기**: Redux보다 훨씬 가벼움 (~1KB)
- ✅ **TypeScript 친화적**: 타입 추론이 우수
- ✅ **외부 의존성 없음**: Context API 기반으로 추가 라이브러리 불필요
- ✅ **성능**: 필요한 부분만 리렌더링

**Redux의 단점 (이 프로젝트에서):**

- ❌ **과도한 보일러플레이트**: Action, Reducer, Store 설정 복잡
- ❌ **큰 번들 크기**: 프로젝트 규모에 비해 과함
- ❌ **학습 곡선**: 팀원들이 익숙하지 않을 수 있음

**실제 활용 사례**

```typescript
// auth-store.ts - 간단한 상태 관리
export const useAuthStore = create<AuthStore>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  login: (token, user) => set({ token, user, isAuthenticated: true }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
```

**언제 Context API를 사용하지 않았나요?**

- Context API는 Provider 중첩 문제와 불필요한 리렌더링 발생
- Zustand는 구독 기반으로 필요한 컴포넌트만 리렌더링

---

### 5. React Query (TanStack Query)

**왜 서버 상태 관리를 React Query로 했나요?**

**React Query의 장점:**

- ✅ **자동 캐싱**: 동일한 데이터 재요청 방지
- ✅ **백그라운드 리페칭**: 데이터 최신성 유지
- ✅ **무한 스크롤 지원**: `useInfiniteQuery`로 간단한 구현
- ✅ **에러 재시도**: 네트워크 오류 시 자동 재시도
- ✅ **로딩/에러 상태 관리**: 일관된 상태 처리

**대안과 비교**

- **SWR**: 좋은 선택이지만 React Query가 더 많은 기능 제공
- **직접 fetch**: 캐싱, 재시도, 상태 관리 모두 수동 구현 필요

**실제 활용 사례**

```typescript
// use-posts.ts - 무한 스크롤 구현
export const usePosts = (filters: PostFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ["posts", filters],
    queryFn: ({ pageParam }) =>
      postsApi.getPosts({ ...filters, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "0",
  });
};
```

**상태 관리 분리 전략**

- **클라이언트 상태 (Zustand)**: 인증, 테마, UI 상태
- **서버 상태 (React Query)**: API 데이터, 캐싱

---

### 6. Axios

**왜 fetch 대신 Axios를 선택했나요?**

**Axios의 장점:**

- ✅ **인터셉터**: 요청/응답 전역 처리 (토큰 추가, 에러 처리)
- ✅ **자동 JSON 변환**: fetch는 수동으로 `.json()` 호출 필요
- ✅ **요청 취소**: `AbortController`보다 간단한 API
- ✅ **타임아웃 설정**: 네트워크 오류 처리 용이

**실제 활용 사례**

```typescript
// client.ts - 인터셉터로 토큰 자동 추가
apiClient.interceptors.request.use((config) => {
  const token = authCookies.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 에러 시 자동 로그아웃
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authCookies.clear();
      window.location.href = "/login";
    }
    throw error;
  }
);
```

---

### 7. TanStack Table (React Table)

**왜 직접 테이블을 만들지 않고 라이브러리를 사용했나요?**

**TanStack Table의 장점:**

- ✅ **헤드리스**: UI는 직접 구현, 로직만 제공
- ✅ **성능**: 가상화 지원으로 대용량 데이터 처리
- ✅ **기능 풍부**: 정렬, 필터링, 컬럼 리사이징, 가시성 토글
- ✅ **타입 안정성**: TypeScript 완벽 지원

**대안과 비교**

- **AG Grid**: 유료 기능이 많고 번들 크기가 큼
- **Material-UI Table**: 스타일 커스터마이징이 제한적

**실제 활용 사례**

```typescript
// PostsTable.tsx - 복잡한 테이블 기능 구현
const table = useReactTable({
  data: posts,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: { sorting, columnVisibility },
  onSortingChange: setSorting,
  onColumnVisibilityChange: setColumnVisibility,
  columnResizeMode: "onChange",
});
```

---

### 8. Recharts

**왜 Chart.js 대신 Recharts를 선택했나요?**

**Recharts의 장점:**

- ✅ **React 네이티브**: React 컴포넌트로 구성
- ✅ **커스터마이징**: 각 요소를 개별 컴포넌트로 제어
- ✅ **TypeScript 지원**: 완벽한 타입 정의
- ✅ **반응형**: 자동으로 화면 크기에 맞춤

**대안과 비교**

- **Chart.js**: 좋지만 React 래퍼가 필요하고 커스터마이징이 제한적
- **D3.js**: 너무 저수준, 구현 시간이 오래 걸림

---

### 9. React Hook Form + Zod

**왜 폼 관리를 React Hook Form으로 했나요?**

**React Hook Form의 장점:**

- ✅ **성능**: 제어 컴포넌트보다 리렌더링 최소화
- ✅ **간단한 API**: `register`, `handleSubmit`만으로 폼 구현
- ✅ **Zod 통합**: 스키마 기반 검증

**Zod의 장점:**

- ✅ **타입 추론**: 스키마에서 TypeScript 타입 자동 생성
- ✅ **런타임 검증**: 클라이언트와 서버 모두에서 사용 가능
- ✅ **에러 메시지**: 자동으로 친화적인 에러 메시지 생성

**실제 활용 사례**

```typescript
// PostFormModal.tsx
const schema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  body: z.string().min(1, "내용을 입력해주세요"),
  category: z.enum(["notice", "qna", "free"]),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

---

### 10. Tailwind CSS

**왜 CSS-in-JS 대신 Tailwind를 선택했나요?**

**Tailwind의 장점:**

- ✅ **빠른 개발**: 유틸리티 클래스로 즉시 스타일링
- ✅ **번들 크기 최적화**: 사용하지 않는 CSS 자동 제거
- ✅ **일관성**: 디자인 시스템을 유틸리티로 강제
- ✅ **다크 모드**: `dark:` 프리픽스로 간단한 구현

**대안과 비교**

- **Styled Components**: 런타임 오버헤드, SSR 복잡성
- **CSS Modules**: 파일 관리 복잡, 중복 코드 발생

**실제 활용 사례**

```typescript
// 다크 모드 자동 지원
<div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
  Content
</div>
```

---

## 🏗️ 아키텍처 설계 결정

### 1. Feature-First 구조

**왜 Feature-First 구조를 선택했나요?**

```
src/
├── features/           # 기능별 모듈
│   ├── posts/         # 게시판 기능
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── charts/        # 차트 기능
│       ├── components/
│       ├── hooks/
│       └── types/
```

**장점:**

- ✅ **높은 응집도**: 관련 코드가 한 곳에 모임
- ✅ **낮은 결합도**: 기능 간 독립성 유지
- ✅ **확장성**: 새 기능 추가 시 독립적으로 개발 가능
- ✅ **유지보수성**: 특정 기능 수정 시 해당 폴더만 확인

**대안: Layer-First 구조의 단점:**

```
src/
├── components/        # 모든 컴포넌트
├── hooks/             # 모든 훅
└── types/             # 모든 타입
```

- ❌ 관련 코드가 여러 폴더에 분산
- ❌ 기능 수정 시 여러 폴더를 오가야 함

---

### 2. 레이어드 아키텍처

```
Presentation Layer (컴포넌트)
        ↓
Business Logic Layer (훅, 스토어)
        ↓
Data Access Layer (API 클라이언트)
        ↓
External API
```

**왜 이 구조를 선택했나요?**

- ✅ **관심사 분리**: 각 레이어가 명확한 책임
- ✅ **테스트 용이성**: 각 레이어를 독립적으로 테스트 가능
- ✅ **재사용성**: API 클라이언트를 여러 컴포넌트에서 재사용

**실제 구조 예시**

```typescript
// Presentation Layer
<PostsTable />;

// Business Logic Layer
const { data } = usePosts(filters);

// Data Access Layer
postsApi.getPosts(filters);
```

---

### 3. API 엔드포인트 모듈화

**왜 엔드포인트를 별도 파일로 분리했나요?**

```
lib/api/
├── client.ts          # Axios 인스턴스
└── endpoints/
    ├── auth.ts       # 인증 관련 API
    ├── posts.ts      # 게시글 관련 API
    └── charts.ts     # 차트 관련 API
```

**장점:**

- ✅ **중앙 관리**: API URL 변경 시 한 곳만 수정
- ✅ **타입 안정성**: 각 엔드포인트별 타입 정의
- ✅ **재사용성**: 여러 컴포넌트에서 동일한 API 함수 사용

**실제 활용 사례**

```typescript
// endpoints/posts.ts
export const postsApi = {
  getPosts: (params: GetPostsParams) =>
    apiClient.get<PostsResponse>("/posts", { params }),
  createPost: (data: CreatePostDto) => apiClient.post<Post>("/posts", data),
};
```

---

## 🔄 상태 관리 전략

### 1. 클라이언트 상태 vs 서버 상태 분리

**왜 상태를 분리했나요?**

| 상태 타입       | 라이브러리  | 사용 사례           |
| --------------- | ----------- | ------------------- |
| 클라이언트 상태 | Zustand     | 인증, 테마, UI 상태 |
| 서버 상태       | React Query | API 데이터, 캐싱    |

**클라이언트 상태 (Zustand)**

- 인증 상태: `auth-store.ts`
- 테마 설정: `theme-store.ts`
- 차트 범례: `chart-legend-store.ts`

**서버 상태 (React Query)**

- 게시글 목록: `usePosts()`
- 차트 데이터: `useChartData()`

**이유:**

- ✅ **적절한 도구 사용**: 각 상태 타입에 맞는 최적의 라이브러리
- ✅ **성능**: React Query의 캐싱으로 불필요한 API 호출 방지
- ✅ **일관성**: 서버 상태는 React Query로 통일

---

### 2. Zustand 스토어 설계

**왜 여러 스토어로 분리했나요?**

```
store/
├── auth-store.ts          # 인증 상태
├── theme-store.ts         # 테마 상태
└── chart-legend-store.ts  # 차트 범례 상태
```

**장점:**

- ✅ **관심사 분리**: 각 스토어가 독립적인 책임
- ✅ **성능**: 필요한 스토어만 구독
- ✅ **유지보수성**: 특정 기능 수정 시 해당 스토어만 확인

**단일 스토어의 단점:**

- ❌ 모든 상태가 한 곳에 모여 복잡도 증가
- ❌ 상태 변경 시 불필요한 리렌더링 발생 가능

---

### 3. React Query 설정

**왜 이런 기본 옵션을 설정했나요?**

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      refetchOnWindowFocus: false, // 포커스 시 리페치 비활성화
      retry: 1, // 재시도 1회
      throwOnError: false, // 에러를 throw하지 않음
    },
  },
});
```

**설정 이유:**

- `staleTime: 60초`: 1분 내 동일한 요청은 캐시 사용
- `refetchOnWindowFocus: false`: 사용자가 탭 전환 시 불필요한 리페치 방지
- `retry: 1`: 네트워크 오류 시 1회만 재시도 (과도한 재시도 방지)
- `throwOnError: false`: 에러 발생 시 앱 크래시 방지, Toast로만 표시

---

## 🔐 보안 설계

### 1. 쿠키 기반 인증

**왜 localStorage 대신 쿠키를 사용했나요?**

**쿠키의 장점:**

- ✅ **HTTP-only 옵션**: JavaScript 접근 불가 (XSS 방지)
- ✅ **SameSite 옵션**: CSRF 공격 방지
- ✅ **자동 전송**: 모든 요청에 자동 포함

**localStorage의 단점:**

- ❌ JavaScript로 접근 가능 (XSS 취약)
- ❌ 수동으로 헤더에 추가해야 함

**실제 구현**

```typescript
// cookies.ts
const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7일
  sameSite: "lax", // CSRF 방지
  // secure: true,           // HTTPS에서만 (프로덕션)
};
```

---

### 2. Next.js 미들웨어 인증

**왜 클라이언트 사이드 체크 대신 미들웨어를 사용했나요?**

**미들웨어의 장점:**

- ✅ **서버 사이드 체크**: 클라이언트에서 우회 불가
- ✅ **초기 렌더링 전 체크**: 불필요한 렌더링 방지
- ✅ **리다이렉트**: 인증 실패 시 즉시 로그인 페이지로 이동

**클라이언트 사이드 체크의 단점:**

- ❌ JavaScript 비활성화 시 우회 가능
- ❌ 초기 렌더링 후 체크 (깜빡임 발생)

**실제 구현**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
```

---

### 3. Axios 인터셉터로 토큰 자동 추가

**왜 매번 수동으로 토큰을 추가하지 않았나요?**

**인터셉터의 장점:**

- ✅ **중앙 집중식 관리**: 한 곳에서 토큰 처리
- ✅ **자동화**: 모든 요청에 자동으로 토큰 추가
- ✅ **에러 처리**: 401 에러 시 자동 로그아웃

**실제 구현**

```typescript
// client.ts
apiClient.interceptors.request.use((config) => {
  const token = authCookies.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ⚡ 성능 최적화

### 1. 무한 스크롤 (Cursor 기반 페이지네이션)

**왜 Offset 기반 대신 Cursor 기반을 사용했나요?**

**Cursor 기반의 장점:**

- ✅ **성능**: 데이터 추가/삭제 시에도 일관된 성능
- ✅ **정확성**: 페이지 중간에 데이터 추가되어도 중복/누락 없음

**Offset 기반의 단점:**

- ❌ 데이터 추가/삭제 시 페이지 번호가 어긋남
- ❌ 대용량 데이터에서 느림 (OFFSET이 클수록)

**실제 구현**

```typescript
// use-posts.ts
export const usePosts = (filters: PostFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ["posts", filters],
    queryFn: ({ pageParam }) =>
      postsApi.getPosts({ ...filters, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
```

---

### 2. React Query 캐싱

**왜 캐싱을 사용했나요?**

**캐싱의 장점:**

- ✅ **빠른 응답**: 캐시된 데이터 즉시 표시
- ✅ **네트워크 요청 감소**: 불필요한 API 호출 방지
- ✅ **오프라인 지원**: 네트워크 오류 시에도 캐시 데이터 표시

**캐싱 전략**

- `staleTime: 60초`: 1분 내 동일한 요청은 캐시 사용
- `cacheTime: 5분`: 5분 후 캐시 삭제

---

### 3. 코드 스플리팅

**Next.js App Router의 자동 코드 스플리팅**

**장점:**

- ✅ **초기 로딩 시간 단축**: 필요한 페이지만 로드
- ✅ **번들 크기 최적화**: 각 페이지별로 번들 분리

**실제 동작**

- `/posts` 페이지 접근 시 posts 관련 코드만 로드
- `/dashboard` 페이지 접근 시 dashboard 관련 코드만 로드

---

### 4. React Intersection Observer

**왜 무한 스크롤에 Intersection Observer를 사용했나요?**

**장점:**

- ✅ **성능**: 스크롤 이벤트보다 효율적
- ✅ **정확성**: 요소가 뷰포트에 진입할 때만 트리거

**실제 구현**

```typescript
// PostsTable.tsx
const { ref, inView } = useInView({
  threshold: 0,
});

useEffect(() => {
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
}, [inView, hasNextPage, isFetchingNextPage]);
```

---

## 🛡️ 에러 처리 전략

### 1. 다층 방어 시스템

**왜 여러 레벨에서 에러를 처리했나요?**

```
1. API 레벨 (Axios 인터셉터)
   ↓
2. React Query 레벨 (throwOnError: false)
   ↓
3. 컴포넌트 레벨 (Error Boundary)
   ↓
4. 사용자 피드백 (Toast)
```

**각 레벨의 역할:**

- **API 레벨**: HTTP 에러 코드별 처리 (401, 403, 404, 500)
- **React Query 레벨**: 에러를 throw하지 않아 앱 크래시 방지
- **컴포넌트 레벨**: 렌더링 에러 포착
- **사용자 피드백**: 친화적인 에러 메시지 표시

---

### 2. Error Boundary

**왜 Error Boundary를 사용했나요?**

**장점:**

- ✅ **앱 크래시 방지**: 에러 발생 시 흰 화면 대신 에러 UI 표시
- ✅ **부분 실패 허용**: 한 컴포넌트 에러가 전체 앱을 망가뜨리지 않음

**실제 구현**

```typescript
// ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

### 3. React Query 에러 처리

**왜 throwOnError: false를 설정했나요?**

**설정 이유:**

- ✅ **앱 안정성**: 에러 발생 시에도 앱이 계속 작동
- ✅ **사용자 경험**: Toast로 에러만 표시하고 다른 기능은 사용 가능

**실제 동작**

```typescript
// query-provider.tsx
new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: false, // 에러를 throw하지 않음
    },
    mutations: {
      throwOnError: false, // mutation 에러도 throw하지 않음
    },
  },
});
```

---

## 🎯 주요 기능 구현 방식

### 1. 무한 스크롤 구현

**구현 방식:**

1. `useInfiniteQuery`로 페이지네이션 데이터 관리
2. `React Intersection Observer`로 스크롤 감지
3. 하단 요소가 뷰포트에 진입 시 `fetchNextPage()` 호출

**왜 이 방식을 선택했나요?**

- ✅ **사용자 경험**: 페이지 번호 클릭 없이 자연스러운 스크롤
- ✅ **성능**: 필요한 데이터만 점진적으로 로드

---

### 2. 차트 범례 상태 관리

**구현 방식:**

1. Zustand로 범례 상태 관리 (색상, 가시성)
2. 각 차트별로 독립적인 범례 상태
3. 상태 지속성 (새로고침 시에도 유지)

**왜 Zustand를 사용했나요?**

- ✅ **간단한 API**: 범례 상태는 클라이언트 상태
- ✅ **성능**: 필요한 차트만 리렌더링
- ✅ **독립성**: 각 차트의 범례가 서로 영향 없음

---

### 3. 반응형 디자인

**구현 방식:**

1. **Mobile First**: 모바일부터 디자인
2. **Tailwind Breakpoints**: sm, md, lg, xl
3. **Adaptive Components**: 화면 크기별 다른 UI (테이블 ↔ 카드)

**실제 구현**

```typescript
// PostsTable.tsx
{
  isMobile ? (
    <PostsCardView /> // 모바일: 카드 뷰
  ) : (
    <PostsTableView /> // 데스크톱: 테이블 뷰
  );
}
```

**왜 이 방식을 선택했나요?**

- ✅ **사용자 경험**: 각 디바이스에 최적화된 UI
- ✅ **성능**: 모바일에서는 테이블 렌더링 비용 절감

---

### 4. 다크 모드 구현

**구현 방식:**

1. Zustand로 테마 상태 관리
2. Tailwind `dark:` 프리픽스 사용
3. `class` 방식으로 HTML에 `dark` 클래스 추가

**왜 이 방식을 선택했나요?**

- ✅ **간단한 구현**: Tailwind의 내장 다크 모드 지원
- ✅ **성능**: CSS 변수로 빠른 전환
- ✅ **일관성**: 모든 컴포넌트에 동일한 방식 적용

---

## 📊 설계 결정 요약

### 기술 스택 선택 기준

1. **프로젝트 규모**: 중소규모 프로젝트에 적합한 가벼운 라이브러리 선택
2. **팀 역량**: 널리 사용되는 기술로 학습 곡선 최소화
3. **성능**: 번들 크기와 런타임 성능 고려
4. **유지보수성**: 장기적으로 유지보수하기 쉬운 기술 선택

### 아키텍처 설계 원칙

1. **관심사 분리**: 각 레이어가 명확한 책임
2. **높은 응집도, 낮은 결합도**: Feature-First 구조
3. **확장성**: 새 기능 추가 시 기존 코드 영향 최소화
4. **타입 안정성**: TypeScript로 런타임 오류 방지

---

## 🎓 면접 예상 질문

### Q1. 왜 Redux 대신 Zustand를 선택했나요?

**답변:**
"프로젝트 규모가 중소규모이고, 복잡한 상태 관리가 필요하지 않았기 때문에 Zustand를 선택했습니다. Zustand는 Redux보다 보일러플레이트 코드가 적고, 번들 크기도 작으며, TypeScript 지원이 우수합니다. 또한 클라이언트 상태(인증, 테마)는 Zustand로, 서버 상태(API 데이터)는 React Query로 분리하여 각 상태 타입에 맞는 최적의 도구를 사용했습니다."

### Q2. 왜 React Query를 사용했나요?

**답변:**
"서버 상태 관리를 위해 React Query를 선택했습니다. React Query는 자동 캐싱, 백그라운드 리페칭, 무한 스크롤 지원 등 서버 상태 관리에 필요한 기능을 제공합니다. 특히 `useInfiniteQuery`를 사용하여 게시글 무한 스크롤을 간단하게 구현할 수 있었고, 캐싱으로 불필요한 API 호출을 방지했습니다."

### Q3. 에러 처리는 어떻게 했나요?

**답변:**
"다층 방어 시스템을 구축했습니다. API 레벨에서는 Axios 인터셉터로 HTTP 에러 코드별 처리(401 자동 로그아웃, 404/500 에러 메시지)를 하고, React Query 레벨에서는 `throwOnError: false`로 에러를 throw하지 않아 앱 크래시를 방지했습니다. 컴포넌트 레벨에서는 Error Boundary로 렌더링 에러를 포착하고, 사용자에게는 Toast로 친화적인 에러 메시지를 표시했습니다."

### Q4. 성능 최적화는 어떻게 했나요?

**답변:**
"여러 방법으로 성능을 최적화했습니다. 첫째, React Query 캐싱으로 동일한 데이터 재요청을 방지했습니다. 둘째, Cursor 기반 페이지네이션으로 무한 스크롤을 구현하여 필요한 데이터만 점진적으로 로드했습니다. 셋째, Next.js App Router의 자동 코드 스플리팅으로 초기 로딩 시간을 단축했습니다. 넷째, React Intersection Observer로 스크롤 이벤트 대신 효율적인 무한 스크롤을 구현했습니다."

### Q5. 보안은 어떻게 구현했나요?

**답변:**
"보안을 위해 여러 방법을 적용했습니다. 첫째, 쿠키 기반 인증을 사용하여 localStorage보다 안전하게 토큰을 저장했습니다. 둘째, Next.js 미들웨어로 서버 사이드에서 인증을 체크하여 클라이언트에서 우회할 수 없도록 했습니다. 셋째, Axios 인터셉터로 모든 요청에 토큰을 자동으로 추가하고, 401 에러 시 자동으로 로그아웃 처리했습니다."

---

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [TanStack Table 공식 문서](https://tanstack.com/table/latest)
- [Recharts 공식 문서](https://recharts.org/)

---

**작성일**: 2024년  
**프로젝트**: Directional  
**버전**: 1.0.0
