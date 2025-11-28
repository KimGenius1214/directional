# 📝 게시판 & 차트 대시보드

게시글 CRUD 기능과 다양한 데이터 시각화 차트를 제공하는 웹 애플리케이션입니다.

## ✨ 주요 기능

### 1️⃣ 게시판

- ✅ 게시글 작성, 조회, 수정, 삭제 (CRUD)
- ✅ 테이블 형태로 게시글 목록 표시
- ✅ 컬럼 너비 조절
- ✅ 컬럼 숨김/보임
- ✅ 무한 스크롤 페이지네이션
- ✅ 검색 (제목, 본문)
- ✅ 정렬 (제목, 작성일)
- ✅ 카테고리 필터링
- ✅ 금칙어 필터링

### 2️⃣ 데이터 시각화

- ✅ 바 차트 & 도넛 차트
- ✅ 스택형 바 차트 & 면적 차트
- ✅ 멀티라인 차트
- ✅ 범례 색상 변경
- ✅ 범례 토글 (데이터 숨김/보임)
- ✅ 커스텀 툴팁

## 🛠️ 기술 스택

- **React** 19.2.0
- **Next.js** 16.0.5 (App Router)
- **TypeScript** 5+
- **Tailwind CSS** 4
- **Zustand** - 상태 관리
- **React Query** - 서버 상태 관리
- **Recharts** - 차트 라이브러리
- **React Table** - 테이블 라이브러리
- **React Hook Form** + **Zod** - 폼 관리 및 검증

## 📁 프로젝트 구조

```
directional/
├── app/                    # Next.js 페이지
│   ├── page.tsx           # 홈
│   ├── login/             # 로그인
│   ├── posts/             # 게시판
│   └── dashboard/         # 대시보드
├── src/
│   ├── components/        # 공통 컴포넌트
│   ├── features/          # 기능별 모듈
│   ├── lib/               # 라이브러리
│   │   ├── api/          # API 클라이언트
│   │   ├── store/        # 상태 관리
│   │   └── utils/        # 유틸리티
│   ├── types/            # 타입 정의
│   └── constants/        # 상수
└── ARCHITECTURE.md       # 상세 아키텍쳐 문서
```

자세한 아키텍쳐는 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참고하세요.

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. API 정보

- **API Base URL**: https://fe-hiring-rest-api.vercel.app
- **API 문서**: https://fe-hiring-rest-api.vercel.app/docs

로그인에 필요한 이메일과 비밀번호는 API 문서를 참고하세요.

## 📖 사용 방법

### 로그인

1. 홈 페이지에서 "로그인" 카드 클릭
2. API 문서에서 제공하는 이메일과 비밀번호 입력
3. 로그인 성공 시 게시판으로 자동 이동

### 게시판

1. 로그인 후 게시판 페이지 접근
2. 게시글 작성, 조회, 수정, 삭제 가능
3. 검색, 필터, 정렬 기능 활용
4. 컬럼 조절 및 숨김/보임 설정

### 대시보드

1. 홈 또는 네비게이션에서 대시보드 접근
2. 다양한 차트로 데이터 확인
3. 범례 클릭으로 데이터 숨김/보임
4. 범례 색상 변경 가능

## 🎯 주요 기능 구현 상태

### ✅ 완료

- [x] 기본 프로젝트 구조 설정
- [x] 타입 정의
- [x] API 클라이언트 설정
- [x] 상태 관리 스토어
- [x] 공통 UI 컴포넌트
- [x] 라우팅 구조
- [x] 로그인 페이지

### 🔄 구현 예정

- [ ] 게시판 테이블 컴포넌트
- [ ] 게시글 CRUD 모달
- [ ] 차트 컴포넌트들
- [ ] 범례 컴포넌트
- [ ] 무한 스크롤
- [ ] 반응형 디자인

## 🏗️ 아키텍쳐 특징

### 레이어드 아키텍쳐

- Presentation Layer: React 컴포넌트
- Business Logic Layer: Custom Hooks, Store
- Data Access Layer: API Client

### 상태 관리 전략

- **클라이언트 상태**: Zustand (인증, 차트 범례)
- **서버 상태**: React Query (게시글, 차트 데이터)

### 코드 품질

- TypeScript로 타입 안정성 확보
- 컴포넌트 재사용성 극대화
- 명확한 폴더 구조
- 일관된 코딩 컨벤션

## 📦 빌드 & 배포

### 프로덕션 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

### Lint 실행

```bash
npm run lint
```

## 🔧 환경 변수 (옵션)

필요시 `.env.local` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```env
NEXT_PUBLIC_API_URL=https://fe-hiring-rest-api.vercel.app
```

## 📝 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 작성되었습니다.

## 🙋‍♂️ 문의

프로젝트 관련 문의사항은 이슈를 등록해주세요.

---

**Made with ❤️ using Next.js + TypeScript**
