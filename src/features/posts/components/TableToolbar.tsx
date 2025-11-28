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
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: PostCategory | "") => void;
  onCreatePost: () => void;
}

export default function TableToolbar({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onCreatePost,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <div className="flex-1 min-w-[200px]">
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

      <Button onClick={onCreatePost} variant="primary">
        + 새 게시글
      </Button>
    </div>
  );
}

