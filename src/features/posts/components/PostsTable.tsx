/**
 * PostsTable - getValue 에러 수정
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { usePosts } from "../hooks";
import type { Post, PostCategory } from "@/types/post";
import { formatRelativeTime } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/constants/validation";
import { Button } from "@/components/ui";
import { useInView } from "react-intersection-observer";

interface PostsTableProps {
  filters: {
    search?: string;
    category?: PostCategory;
  };
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
}

export default function PostsTable({
  filters,
  onEditPost,
  onDeletePost,
}: PostsTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(filters);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const flatData = useMemo(() => {
    return data?.pages?.flatMap((page) => page.posts) ?? [];
  }, [data]);

  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        id: "category",
        accessorKey: "category",
        header: "카테고리",
        cell: ({ row }) => {
          const category = row.original.category;
          const colors: Record<PostCategory, string> = {
            NOTICE:
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            QNA: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            FREE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          };
          return (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[category]}`}
            >
              {CATEGORY_LABELS[category]}
            </span>
          );
        },
      },
      {
        id: "title",
        accessorKey: "title",
        header: "제목",
        cell: ({ row }) => (
          <div className="max-w-md truncate font-medium text-gray-900 dark:text-white">
            {row.original.title}
          </div>
        ),
      },
      {
        id: "body",
        accessorKey: "body",
        header: "내용",
        cell: ({ row }) => (
          <div className="max-w-lg truncate text-sm text-gray-600 dark:text-gray-400">
            {row.original.body}
          </div>
        ),
      },
      {
        id: "tags",
        accessorKey: "tags",
        header: "태그",
        cell: ({ row }) => {
          const tags = row.original.tags;
          if (!tags || tags.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "작성일",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatRelativeTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "작업",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onEditPost(row.original)}
              className="rounded px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              수정
            </button>
            <button
              onClick={() => onDeletePost(row.original)}
              className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              삭제
            </button>
          </div>
        ),
      },
    ],
    [onEditPost, onDeletePost]
  );

  const table = useReactTable({
    data: flatData,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (flatData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">게시글이 없습니다</p>
          <p className="mt-1 text-sm">첫 번째 게시글을 작성해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 컬럼 토글 */}
      <div className="flex flex-wrap gap-2">
        {table.getAllLeafColumns().map((column) => {
          if (column.id === "actions") return null;
          return (
            <label
              key={column.id}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                className="rounded"
              />
              <span className="dark:text-gray-300">
                {column.columnDef.header as string}
              </span>
            </label>
          );
        })}
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:border-gray-800 dark:text-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 무한 스크롤 */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <div className="text-sm text-gray-500">더 불러오는 중...</div>
          ) : (
            <Button onClick={() => fetchNextPage()} variant="outline">
              더 보기
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
