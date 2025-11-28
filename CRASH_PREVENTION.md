# 크래시 방지 가이드

## 🛡️ 개요

이 프로젝트는 다층 방어 시스템을 통해 **어떤 에러가 발생해도 앱이 크래시되지 않도록** 보장합니다.

## 🔧 구현된 방어 시스템

### 1. Error Boundary (React 에러 포착)

**위치:**

- 전역: `app/layout.tsx` - 모든 페이지 보호
- 게시판: `app/posts/page.tsx` - 게시판 페이지 보호
- 모달: `PostFormModal.tsx` - 게시글 작성/수정 폼 보호

**동작:**

```
컴포넌트 렌더링 에러 발생
  ↓
Error Boundary가 포착
  ↓
에러 UI 표시 (흰 화면 대신)
  ↓
사용자는 페이지 새로고침/다시 시도 가능
```

### 2. React Query 설정 (에러 전파 차단)

**설정:**

```typescript
// src/lib/providers/query-provider.tsx
new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: false, // 쿼리 에러를 throw하지 않음
    },
    mutations: {
      throwOnError: false, // mutation 에러를 throw하지 않음
    },
  },
});
```

**효과:**

- ✅ 404, 500 등 HTTP 에러 발생 시 앱 크래시 방지
- ✅ Toast로 에러만 표시하고 앱은 계속 작동
- ✅ 사용자는 다른 기능 계속 사용 가능

### 3. Mutation 처리 방식 변경

**이전 (크래시 발생):**

```typescript
// ❌ mutateAsync는 에러를 throw함
await createPost.mutateAsync(postData);
```

**현재 (크래시 방지):**

```typescript
// ✅ mutate는 onError 콜백으로만 처리
createPost.mutate(postData, {
  onSuccess: () => {
    reset();
    onClose();
  },
  // onError는 hook에서 처리
});
```

### 4. Try-Catch 처리

**게시글 삭제:**

```typescript
try {
  await deletePost.mutateAsync(post.id);
} catch {
  // Toast로 이미 에러가 표시되므로 추가 처리 불필요
  // 에러가 발생해도 앱은 크래시되지 않음
}
```

## 📊 에러 처리 흐름

### HTTP 404 에러 예시

```
사용자 동작: 존재하지 않는 게시글 수정 시도
  ↓
API 호출: PATCH /posts/invalid-id
  ↓
HTTP 404 응답
  ↓
API 인터셉터: Toast 표시 ("리소스를 찾을 수 없음")
  ↓
React Query: throwOnError: false → 에러를 상위로 전파하지 않음
  ↓
Mutation onError: Toast 표시 ("게시글 수정 실패")
  ↓
컴포넌트: 모달은 열린 상태로 유지
  ↓
결과: 앱은 정상 작동, 사용자는 재시도 가능
```

### React 렌더링 에러 예시

```
컴포넌트에서 예상치 못한 에러 발생
  ↓
Error Boundary가 에러 포착
  ↓
에러 UI 표시:
  😵 앗! 문제가 발생했습니다
  [페이지 새로고침]
  [다시 시도]
  [홈으로 이동]
  ↓
결과: 흰 화면 대신 친화적인 에러 UI
```

## 🎯 주요 변경 사항

### 1. PostFormModal.tsx

**변경 전:**

```typescript
const onSubmit = async (data: PostFormData) => {
  await updatePost.mutateAsync({ id, data }); // ❌ throw 발생
};
```

**변경 후:**

```typescript
const onSubmit = (data: PostFormData) => {
  updatePost.mutate(
    { id, data },
    {
      onSuccess: () => {
        reset();
        onClose();
      },
    }
  ); // ✅ onError 콜백으로 처리
};
```

### 2. PostsPage.tsx

**추가:**

```typescript
<ErrorBoundary>
  <div className="flex h-screen overflow-hidden">{/* 게시판 컨텐츠 */}</div>
</ErrorBoundary>
```

### 3. Query Provider

**추가:**

```typescript
throwOnError: false; // 에러를 Error Boundary로 전파하지 않음
```

## 🧪 테스트 시나리오

### 시나리오 1: 존재하지 않는 게시글 삭제

1. 게시글 삭제 시도
2. **예상 결과:**
   - Toast: "리소스를 찾을 수 없음"
   - Toast: "게시글 삭제 실패"
   - 앱은 정상 작동
   - 게시글 목록은 계속 표시됨

### 시나리오 2: 네트워크 오류

1. 오프라인 상태에서 게시글 작성
2. **예상 결과:**
   - Toast: "네트워크 오류"
   - 모달은 열린 상태 유지
   - 사용자는 재시도 가능

### 시나리오 3: 서버 오류 (500)

1. 서버 오류 발생
2. **예상 결과:**
   - Toast: "서버 오류"
   - 앱은 정상 작동
   - 사용자는 다른 기능 사용 가능

### 시나리오 4: React 렌더링 에러

1. 컴포넌트에서 예상치 못한 에러 발생
2. **예상 결과:**
   - Error Boundary UI 표시
   - 흰 화면 대신 친화적인 에러 UI
   - 페이지 새로고침 버튼 제공

## ✅ 체크리스트

### 앱이 크래시되지 않는 상황

- [x] HTTP 404 에러
- [x] HTTP 500 에러
- [x] HTTP 401 에러 (자동 로그인 페이지 이동)
- [x] 네트워크 연결 오류
- [x] 요청 시간 초과
- [x] 게시글 작성 실패
- [x] 게시글 수정 실패
- [x] 게시글 삭제 실패
- [x] React 컴포넌트 렌더링 에러
- [x] 비동기 작업 실패

### Toast 메시지 표시

- [x] API 에러 → Toast 자동 표시
- [x] Mutation 에러 → Toast 자동 표시
- [x] 성공 메시지 → Toast 표시

### Error Boundary 보호

- [x] 전역 레이아웃
- [x] 게시판 페이지
- [x] 게시글 작성/수정 모달

## 🚀 결과

### 이전 (크래시 발생)

```
에러 발생 → 흰 화면 → 앱 사용 불가 → 사용자 이탈
```

### 현재 (크래시 방지)

```
에러 발생 → Toast 표시 → 앱 정상 작동 → 사용자는 계속 사용 가능
```

## 📝 개발자 가이드

### 새로운 Mutation 추가 시

```typescript
// ✅ 권장: mutate 사용
const handleAction = () => {
  myMutation.mutate(data, {
    onSuccess: () => {
      // 성공 처리
    },
    // onError는 hook에서 처리
  });
};

// ❌ 비권장: mutateAsync 사용
const handleAction = async () => {
  try {
    await myMutation.mutateAsync(data);
  } catch {
    // 에러 처리
  }
};
```

### 새로운 페이지 추가 시

```typescript
export default function MyPage() {
  return <ErrorBoundary>{/* 페이지 내용 */}</ErrorBoundary>;
}
```

## 🎉 완료!

이제 **어떤 에러가 발생해도 앱이 크래시되지 않습니다**! 🚀

사용자는 항상 정상적인 UI를 볼 수 있으며, 에러는 Toast 메시지로 친절하게 안내됩니다.
