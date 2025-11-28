/**
 * 게시판 검색/필터 툴바
 */

"use client";

import { Input, Select, Button } from "@/components/ui";
import { CATEGORY_LABELS } from "@/constants/validation";
import type { PostCategory } from "@/types/post";

interface TableToolbarProps {
  search: string;
  category: PostCategory | "";
  useMockData?: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: PostCategory | "") => void;
  onMockDataToggle?: (value: boolean) => void;
  onCreatePost: () => void;
}

export default function TableToolbar({
  search,
  category,
  useMockData = false,
  onSearchChange,
  onCategoryChange,
  onMockDataToggle,
  onCreatePost,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:gap-4 sm:flex-row">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="제목 또는 내용 검색..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-[180px]">
            <Select
              value={category}
              onChange={(e) =>
                onCategoryChange(e.target.value as PostCategory | "")
              }
              options={[
                { value: "", label: "전체 카테고리" },
                { value: "FREE", label: CATEGORY_LABELS.FREE },
                { value: "QNA", label: CATEGORY_LABELS.QNA },
                { value: "NOTICE", label: CATEGORY_LABELS.NOTICE },
              ]}
            />
          </div>
        </div>

        <Button
          onClick={onCreatePost}
          variant="primary"
          className="w-full sm:w-auto"
        >
          + 새 게시글
        </Button>
      </div>

      {/* Mock Data 토글 */}
      {onMockDataToggle && (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              목업 데이터
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              테스트용
            </span>
          </div>
          <button
            type="button"
            onClick={() => onMockDataToggle(!useMockData)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              useMockData ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                useMockData ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            API: {useMockData ? "/mock/posts" : "/posts"}
          </span>
        </div>
      )}
    </div>
  );
}
