# 📋 개발 가이드

## 🎯 다음 단계

기본 아키텍쳐 설정이 완료되었습니다. 이제 다음 기능들을 구현할 준비가 되었습니다:

### 1. 게시판 기능 구현

#### A. React Query 훅 생성

`src/features/posts/hooks/use-posts.ts`:

```typescript
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { postsApi } from "@/lib/api/endpoints";

export const usePosts = (filters) => {
  return useInfiniteQuery({
    queryKey: ["posts", filters],
    queryFn: ({ pageParam = 1 }) =>
      postsApi.getPosts({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });
};
```

#### B. 게시판 테이블 컴포넌트

`src/features/posts/components/PostsTable.tsx`:

- @tanstack/react-table 활용
- 컬럼 정의 (제목, 카테고리, 작성일, 태그 등)
- 컬럼 리사이징
- 컬럼 숨김/보임
- 검색/필터/정렬 UI

#### C. 게시글 CRUD 모달

`src/features/posts/components/PostFormModal.tsx`:

- React Hook Form + Zod 검증
- 금칙어 필터링
- 태그 입력
- 카테고리 선택

#### D. 무한 스크롤

`react-intersection-observer` 활용:

```typescript
import { useInView } from "react-intersection-observer";

const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasNextPage) {
    fetchNextPage();
  }
}, [inView]);
```

### 2. 차트 기능 구현

#### A. React Query 훅 생성

`src/features/charts/hooks/use-charts.ts`:

```typescript
export const useCoffeeBrands = () => {
  return useQuery({
    queryKey: ["coffee-brands"],
    queryFn: chartsApi.getTopCoffeeBrands,
  });
};
```

#### B. 차트 컴포넌트

각 차트 타입별로 구현:

**바 차트** (`src/features/charts/components/BarChart.tsx`):

```typescript
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="brand" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="count" fill="#8884d8" />
</BarChart>;
```

**도넛 차트** (`src/features/charts/components/DonutChart.tsx`):

```typescript
import { PieChart, Pie, Cell } from "recharts";

<PieChart>
  <Pie
    data={data}
    dataKey="count"
    nameKey="brand"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={80}
  >
    {data.map((entry, index) => (
      <Cell key={index} fill={COLORS[index]} />
    ))}
  </Pie>
</PieChart>;
```

**스택형 바 차트**:

```typescript
<BarChart data={data}>
  <Bar dataKey="happy" stackId="a" fill="#82ca9d" />
  <Bar dataKey="tired" stackId="a" fill="#ffc658" />
  <Bar dataKey="stressed" stackId="a" fill="#ff7c7c" />
</BarChart>
```

**멀티라인 차트**:

```typescript
<LineChart data={data}>
  <XAxis dataKey="cupsPerDay" />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <Line yAxisId="left" type="monotone" dataKey="bugs" stroke="#8884d8" />
  <Line
    yAxisId="right"
    type="monotone"
    dataKey="productivity"
    stroke="#82ca9d"
    strokeDasharray="5 5"
  />
</LineChart>
```

#### C. 커스텀 범례 컴포넌트

`src/features/charts/components/CustomLegend.tsx`:

```typescript
const CustomLegend = ({ chartId, items }) => {
  const { legends, toggleLegendVisibility, updateLegendColor } =
    useChartLegendStore();

  return (
    <div className="flex gap-4">
      {items.map((item) => (
        <div key={item.dataKey}>
          <input
            type="color"
            value={legends[chartId]?.[item.dataKey]?.color}
            onChange={(e) =>
              updateLegendColor(chartId, item.dataKey, e.target.value)
            }
          />
          <button onClick={() => toggleLegendVisibility(chartId, item.dataKey)}>
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
};
```

### 3. 검증 스키마 (Zod)

`src/features/posts/schemas/post-schema.ts`:

```typescript
import { z } from "zod";
import { FORBIDDEN_WORDS, POST_VALIDATION } from "@/constants/validation";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력하세요")
    .max(
      POST_VALIDATION.TITLE_MAX_LENGTH,
      `제목은 ${POST_VALIDATION.TITLE_MAX_LENGTH}자 이하여야 합니다`
    )
    .refine(
      (val) => !FORBIDDEN_WORDS.some((word) => val.includes(word)),
      "금칙어가 포함되어 있습니다"
    ),
  body: z
    .string()
    .min(1, "본문을 입력하세요")
    .max(POST_VALIDATION.BODY_MAX_LENGTH)
    .refine(
      (val) => !FORBIDDEN_WORDS.some((word) => val.includes(word)),
      "금칙어가 포함되어 있습니다"
    ),
  category: z.enum(["NOTICE", "QNA", "FREE"]),
  tags: z
    .array(z.string().max(POST_VALIDATION.TAG_MAX_LENGTH))
    .max(POST_VALIDATION.TAG_MAX_COUNT)
    .optional(),
});
```

## 🧪 테스트 (옵션)

향후 추가할 수 있는 테스트:

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

```typescript
// Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

## 🎨 스타일 가이드

### Tailwind 유틸리티 사용

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)}>
```

### 반응형 디자인

```typescript
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
">
```

## 📊 API 응답 예시

### 게시글 목록

```json
{
  "posts": [
    {
      "id": "cm123abc",
      "userId": "user123",
      "title": "게시글 제목",
      "body": "게시글 내용",
      "category": "FREE",
      "tags": ["태그1", "태그2"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

### 차트 데이터

```json
{
  "data": [
    { "brand": "Starbucks", "count": 150 },
    { "brand": "Coffee Bean", "count": 120 }
  ]
}
```

## 🔧 유용한 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 프로덕션 서버
npm start

# Lint
npm run lint

# 타입 체크
npx tsc --noEmit
```

## 📚 참고 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://docs.pmnd.rs/zustand)
- [Recharts 문서](https://recharts.org/)
- [React Table 문서](https://tanstack.com/table/latest)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 💡 팁

1. **API 호출 최적화**: React Query의 staleTime과 cacheTime 조정
2. **번들 크기 최적화**: 동적 import 활용
3. **성능 최적화**: React.memo, useMemo, useCallback 적절히 사용
4. **접근성**: ARIA 속성 추가
5. **SEO**: Next.js metadata API 활용

---

**Happy Coding! 🚀**
