import Image from "next/image";
import { Header } from "@/components/layout";
import { HomeContent } from "@/components/home/HomeContent";

// SSG: 정적 사이트 생성
export const dynamic = "force-static";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="mb-6 flex justify-center">
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/directional_logo.png"
                    alt="Directional Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Directional
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                게시글 관리 및 데이터 시각화
              </p>
            </div>

            {/* Feature Cards - 클라이언트 컴포넌트로 분리 */}
            <HomeContent />

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
