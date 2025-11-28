"use client";

import Link from "next/link";
import { Header } from "@/components/layout";
import { useAuthStore } from "@/lib/store";

export default function Home() {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // 초기화가 완료되지 않았으면 로딩 표시
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                로딩 중...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <span className="text-4xl font-bold text-white">D</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Directional
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                게시글 관리와 데이터 시각화를 위한 올인원 플랫폼
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 로그인 카드 */}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="relative">
                    <div className="mb-4 text-5xl">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      로그인
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      로그인하여 게시글을 작성하고 관리하세요
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </Link>
              )}

              {/* 게시판 카드 */}
              <Link
                href="/posts"
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative">
                  <div className="mb-4 text-5xl">📝</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    게시판
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    게시글 작성, 조회, 수정, 삭제 기능
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>

              {/* 대시보드 카드 */}
              <Link
                href="/dashboard"
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative">
                  <div className="mb-4 text-5xl">📊</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    대시보드
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    다양한 차트로 데이터 시각화
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-6 h-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>

              {/* API 문서 카드 */}
              <a
                href="https://fe-hiring-rest-api.vercel.app/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative">
                  <div className="mb-4 text-5xl">📚</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    API 문서
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Swagger API 문서 보기
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-6 h-6 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </a>
            </div>

            {/* Features List */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  빠른 성능
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  React Query와 무한 스크롤로 최적화된 성능
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <span className="text-2xl">🎨</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  모던 UI
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  다크모드 지원과 직관적인 인터페이스
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <span className="text-2xl">🔒</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  안전한 인증
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  JWT 토큰 기반 보안 인증 시스템
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
