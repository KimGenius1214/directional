/**
 * 헤더 네비게이션 컴포넌트 (가로형)
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useThemeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  active?: boolean;
}

function NavItem({ href, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
        active
          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-2 sm:px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-base sm:text-lg font-bold text-white">D</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Directional
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavItem href="/" label="홈" active={pathname === "/"} />

          {isAuthenticated && (
            <NavItem
              href="/posts"
              label="게시판"
              active={pathname === "/posts"}
            />
          )}

          <NavItem
            href="/dashboard"
            label="대시보드"
            active={pathname === "/dashboard"}
          />
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Section */}
          {isAuthenticated && user ? (
            <>
              {/* Theme Toggle Button (iPhone style) */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  theme === "dark" ? "bg-gray-700" : "bg-blue-500"
                }`}
                aria-label="테마 변경"
              >
                <span
                  className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="h-3 w-3 text-gray-700" />
                  ) : (
                    <Sun className="h-3 w-3 text-blue-500" />
                  )}
                </span>
              </button>

              {/* User Email */}
              <div className="hidden lg:block rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-900">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                  {user.email}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 whitespace-nowrap"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              {/* Theme Toggle Button (iPhone style) for non-authenticated users */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  theme === "dark" ? "bg-gray-700" : "bg-blue-500"
                }`}
                aria-label="테마 변경"
              >
                <span
                  className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="h-3 w-3 text-gray-700" />
                  ) : (
                    <Sun className="h-3 w-3 text-blue-500" />
                  )}
                </span>
              </button>

              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
              >
                로그인
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden items-center gap-1 border-t border-gray-200 px-2 py-2 dark:border-gray-800 overflow-x-auto">
        <NavItem href="/" label="홈" active={pathname === "/"} />

        {isAuthenticated && (
          <NavItem
            href="/posts"
            label="게시판"
            active={pathname === "/posts"}
          />
        )}

        <NavItem
          href="/dashboard"
          label="대시보드"
          active={pathname === "/dashboard"}
        />
      </nav>
    </header>
  );
}
