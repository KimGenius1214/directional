/**
 * 사이드바 네비게이션 컴포넌트
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useThemeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    // 현재 페이지가 보호된 경로(/posts)인지 확인
    const isProtectedPath = pathname.startsWith("/posts");

    setTimeout(() => {
      if (isProtectedPath) {
        // 보호된 경로에서는 홈으로
        window.location.href = "/";
      } else {
        // 그 외에는 현재 페이지 새로고침
        window.location.reload();
      }
    }, 100);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-lg overflow-hidden">
            <Image
              src="/directional_logo.png"
              alt="Directional"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Directional
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <NavItem href="/" icon="🏠" label="홈" active={pathname === "/"} />

        {isAuthenticated && (
          <NavItem
            href="/posts"
            icon="📝"
            label="게시판"
            active={pathname === "/posts"}
          />
        )}

        <NavItem
          href="/dashboard"
          icon="📊"
          label="대시보드"
          active={pathname === "/dashboard"}
        />

        {!isAuthenticated && (
          <NavItem
            href="/login"
            icon="🔐"
            label="로그인"
            active={pathname === "/login"}
          />
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <span className="text-xl">{theme === "light" ? "🌙" : "☀️"}</span>
          <span>{theme === "light" ? "다크 모드" : "라이트 모드"}</span>
        </button>

        {isAuthenticated && user ? (
          <div className="space-y-2">
            <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                로그인됨
              </p>
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <span className="text-xl">🚪</span>
              <span>로그아웃</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex w-full items-center gap-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <span className="text-xl">🔐</span>
            <span>로그인</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
