# 에러 처리 가이드

## 📋 개요

이 프로젝트는 다층 에러 처리 시스템을 구현하여 어떤 상황에서도 앱이 크래시되지 않도록 보장합니다.

### 에러 처리 계층

1. **Error Boundary**: React 컴포넌트 에러 포착 (최상위 보호막)
2. **API 인터셉터**: HTTP 에러 자동 처리 및 Toast 표시
3. **React Query**: 쿼리/뮤테이션 에러 처리
4. **Toast 메시지**: 사용자 친화적인 에러 알림

## 🛡️ Error Boundary

### 기능

React 컴포넌트에서 발생하는 에러를 포착하여 앱 전체가 크래시되는 것을 방지합니다.

### 구현 위치

- **컴포넌트**: `src/components/error/ErrorBoundary.tsx`
- **전역 적용**: `app/layout.tsx` (모든 페이지)
- **로컬 적용**: `app/posts/page.tsx` (게시판 페이지)

### Error Boundary UI

에러가 발생하면 다음과 같은 친화적인 UI가 표시됩니다:

```
😵 앗! 문제가 발생했습니다

예상치 못한 오류가 발생했습니다.
페이지를 새로고침하거나 다시 시도해주세요.

[페이지 새로고침]
[다시 시도]
[홈으로 이동]
```

### 개발 모드

개발 환경에서는 에러 상세 정보와 스택 트레이스가 표시됩니다:

```
개발 모드 - 에러 정보:
Error: Request failed with status code 404
  at createError (axios.js:...)
  ...

[스택 트레이스 보기 ▼]
```

### 사용 예시

```typescript
import { ErrorBoundary } from "@/components/error";

function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

// 커스텀 fallback UI
function MyPage() {
  return (
    <ErrorBoundary
      fallback={
        <div>
          <h1>오류가 발생했습니다</h1>
          <p>잠시 후 다시 시도해주세요.</p>
        </div>
      }
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## 🎨 Toast 메시지

### 설치된 라이브러리

- **Sonner**: 현대적이고 아름다운 Toast 알림 라이브러리
- 위치: 오른쪽 상단 (top-right)
- 다크 모드 지원

### Toast 타입

```typescript
import { toast } from "sonner";

// 성공 메시지
toast.success("제목", {
  description: "설명",
});

// 에러 메시지
toast.error("제목", {
  description: "에러 내용",
});

// 정보 메시지
toast.info("제목", {
  description: "정보 내용",
});

// 경고 메시지
toast.warning("제목", {
  description: "경고 내용",
});

// 로딩 메시지
const loadingToast = toast.loading("로딩 중...");
// 나중에 업데이트
toast.success("완료!", { id: loadingToast });
```

## 🔧 구현된 에러 처리

### 1. API 클라이언트 레벨 (자동)

모든 API 요청 에러는 자동으로 Toast로 표시됩니다.

#### HTTP 상태 코드별 처리

**401 Unauthorized**

```
제목: "인증 오류"
설명: "로그인이 필요합니다. 로그인 페이지로 이동합니다."
동작: 1초 후 자동으로 로그인 페이지로 이동
```

**403 Forbidden**

```
제목: "접근 권한 오류"
설명: "해당 리소스에 접근할 권한이 없습니다."
```

**404 Not Found**

```
제목: "리소스를 찾을 수 없음"
설명: "요청한 리소스를 찾을 수 없습니다. (URL)"
```

**500 Internal Server Error**

```
제목: "서버 오류"
설명: "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
```

#### 네트워크 에러별 처리

**요청 시간 초과 (ECONNABORTED)**

```
제목: "요청 시간 초과"
설명: "서버 응답이 지연되고 있습니다. 다시 시도해주세요."
```

**네트워크 연결 오류 (ERR_NETWORK)**

```
제목: "네트워크 오류"
설명: "네트워크 연결을 확인해주세요."
```

**기타 오류**

```
제목: "오류 발생"
설명: 서버에서 전달한 에러 메시지 또는 "알 수 없는 오류가 발생했습니다."
```

### 2. React Query Mutation 레벨 (자동)

#### 게시글 작성

**성공**

```typescript
toast.success("게시글 작성 완료", {
  description: "게시글이 성공적으로 작성되었습니다.",
});
```

**실패**

```typescript
toast.error("게시글 작성 실패", {
  description: error.message || "게시글 작성 중 오류가 발생했습니다.",
});
```

#### 게시글 수정

**성공**

```typescript
toast.success("게시글 수정 완료", {
  description: "게시글이 성공적으로 수정되었습니다.",
});
```

**실패**

```typescript
toast.error("게시글 수정 실패", {
  description: error.message || "게시글 수정 중 오류가 발생했습니다.",
});
```

#### 게시글 삭제

**성공**

```typescript
toast.success("게시글 삭제 완료", {
  description: "게시글이 성공적으로 삭제되었습니다.",
});
```

**실패**

```typescript
toast.error("게시글 삭제 실패", {
  description: error.message || "게시글 삭제 중 오류가 발생했습니다.",
});
```

### 3. 로그인 (수동)

**성공**

```typescript
toast.success("로그인 성공", {
  description: `${user.email}님, 환영합니다!`,
});
```

**실패**

```typescript
toast.error("로그인 실패", {
  description: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
});
```

## 🎯 사용 방법

### 컴포넌트에서 Toast 사용

```typescript
import { toast } from "sonner";

function MyComponent() {
  const handleAction = async () => {
    try {
      // 비즈니스 로직
      await someAction();

      toast.success("성공!", {
        description: "작업이 완료되었습니다.",
      });
    } catch (error) {
      toast.error("실패", {
        description:
          error instanceof Error ? error.message : "오류가 발생했습니다.",
      });
    }
  };

  return <button onClick={handleAction}>실행</button>;
}
```

### 로딩 상태와 함께 사용

```typescript
const handleUpload = async () => {
  const loadingToast = toast.loading("파일 업로드 중...");

  try {
    await uploadFile();
    toast.success("업로드 완료!", { id: loadingToast });
  } catch (error) {
    toast.error("업로드 실패", {
      id: loadingToast,
      description: "파일 업로드에 실패했습니다.",
    });
  }
};
```

### Promise와 함께 사용

```typescript
toast.promise(fetchData(), {
  loading: "데이터 로딩 중...",
  success: "데이터 로드 완료!",
  error: "데이터 로드 실패",
});
```

## 🎨 커스터마이징

### Toast 스타일 변경

`src/lib/providers/toast-provider.tsx` 파일 수정:

```typescript
<Toaster
  position="top-right" // 위치 변경: top-left, bottom-right 등
  toastOptions={{
    style: {
      background: "white",
      color: "#0f172a",
      border: "1px solid #e2e8f0",
    },
    className: "dark:bg-gray-800 dark:text-white dark:border-gray-700",
  }}
  richColors // 색상 강조
  duration={4000} // 표시 시간 (기본: 4초)
/>
```

### 에러 메시지 커스터마이징

`src/lib/api/client.ts` 파일에서 인터셉터 수정:

```typescript
// 404 에러 메시지 커스터마이징 예시
else if (status === 404) {
  toast.error("페이지를 찾을 수 없음", {
    description: `죄송합니다. ${url} 페이지가 존재하지 않습니다.`,
    action: {
      label: "홈으로",
      onClick: () => window.location.href = "/",
    },
  });
}
```

## 📊 에러 로깅

### console.error 제거

모든 `console.error`는 Toast로 대체되었으며, 에러는 `throw`를 통해 상위로 전파됩니다.

**이전**

```typescript
try {
  await api.call();
} catch (error) {
  console.error("Error:", error); // ❌ 제거됨
}
```

**현재**

```typescript
try {
  await api.call();
} catch (error) {
  // Toast가 자동으로 표시됨
  throw error; // 에러를 상위로 전파
}
```

### 프로덕션 환경에서 에러 추적

프로덕션 환경에서는 Sentry, LogRocket 등의 에러 추적 도구와 통합할 수 있습니다:

```typescript
// src/lib/api/client.ts
import * as Sentry from "@sentry/react";

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Sentry에 에러 보고
    Sentry.captureException(error, {
      extra: {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      },
    });

    // Toast 표시
    if (typeof window !== "undefined") {
      // ... Toast 로직
    }

    throw error;
  }
);
```

## 🔍 디버깅

### 개발 환경에서 에러 확인

1. **브라우저 콘솔**: 에러 스택 트레이스 확인
2. **네트워크 탭**: API 요청/응답 확인
3. **React Query DevTools**: 쿼리 상태 확인

### Toast 메시지 테스트

개발자 도구 콘솔에서 직접 테스트:

```javascript
// 브라우저 콘솔에서 실행
import("sonner").then(({ toast }) => {
  toast.error("테스트 에러", {
    description: "에러 메시지 테스트입니다.",
  });
});
```

## ⚠️ 주의사항

1. **중복 Toast 방지**

   - API 인터셉터와 mutation onError에서 동일한 에러가 두 번 표시될 수 있습니다.
   - 필요시 mutation의 onError에서 특정 에러만 처리하도록 조정하세요.

2. **401 에러 처리**

   - 401 에러 시 자동으로 로그인 페이지로 이동합니다.
   - 리다이렉트를 원하지 않는 경우 API 클라이언트 수정이 필요합니다.

3. **Toast 스택 관리**

   - 너무 많은 Toast가 동시에 표시되지 않도록 주의하세요.
   - Sonner는 자동으로 스택을 관리하지만, 의도적인 중복은 피하세요.

4. **Error Boundary 범위**

   - 전역 Error Boundary: `app/layout.tsx` - 앱 전체 보호
   - 로컬 Error Boundary: `app/posts/page.tsx` - 게시판 페이지 보호
   - 필요에 따라 추가 Error Boundary를 다른 페이지에도 배치 가능

5. **React Query 에러 전파**
   - `throwOnError: false` 설정으로 에러가 Error Boundary로 전파되지 않음
   - 에러는 Toast로만 표시되고 앱은 계속 작동
   - 심각한 에러만 Error Boundary로 전파하려면 설정 변경 필요

## 🔄 React Query 설정

### throwOnError 설정

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

이 설정으로 인해:

- ✅ 에러가 발생해도 Error Boundary가 트리거되지 않음
- ✅ Toast로 에러 메시지만 표시되고 앱은 계속 작동
- ✅ 각 mutation의 onError에서 개별적으로 에러 처리 가능
- ✅ 404, 500 등의 HTTP 에러도 화면이 흰 페이지로 떨어지지 않음

## 🎉 완료!

이제 어떤 에러가 발생해도 앱이 크래시되지 않습니다! 🚀

### 보호 계층

1. **Error Boundary** - React 컴포넌트 에러 포착 → 에러 UI 표시
2. **API 인터셉터** - HTTP 에러 → Toast 메시지 표시
3. **React Query** - 쿼리/뮤테이션 에러 → Toast 메시지 표시
4. **Try-Catch** - 로컬 에러 처리 → 에러 무시 또는 Toast 표시

모든 레벨에서 에러가 안전하게 처리되어 사용자는 항상 정상적인 UI를 볼 수 있습니다! ✨
