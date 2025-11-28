/**
 * Next.js 미들웨어 - 인증 확인
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 보호된 경로 (인증 필요)
const PROTECTED_PATHS = ["/dashboard", "/posts"];

// 인증된 사용자는 접근 불가 (로그인 페이지만)
const AUTH_ONLY_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 쿠키에서 토큰 확인
  const token = request.cookies.get("auth_token")?.value;
  const isAuthenticated = !!token;

  // 보호된 경로 체크 (인증되지 않은 사용자만 리다이렉트)
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // 이미 인증된 사용자는 그대로 진행 (현재 페이지 유지)
    return NextResponse.next();
  }

  // 로그인 페이지 체크 (이미 로그인한 사용자는 홈으로)
  if (AUTH_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
    if (isAuthenticated) {
      // 로그인 페이지에서만 홈(/)으로 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 다음을 제외한 모든 경로에서 실행:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
