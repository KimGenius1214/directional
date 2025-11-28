/**
 * PostsTable - 게시글 테이블 컴포넌트
 * - 컬럼 리사이징
 * - 컬럼 가시성 토글
 * - 정렬 기능
 * - 무한스크롤 페이지네이션
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
  type ColumnResizeMode,
} from "@tanstack/react-table";
import { usePosts } from "../hooks";
import type { Post, PostCategory } from "@/types/post";
import { formatRelativeTime } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/constants/validation";
import { Button } from "@/components/ui";
import { useInView } from "react-intersection-observer";
import { Eye, EyeOff } from "lucide-react";

interface PostsTableProps {
  filters: {
    search?: string;
    category?: PostCategory;
  };
  useMockData?: boolean;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
}

export default function PostsTable({
  filters,
  useMockData = false,
  onEditPost,
  onDeletePost,
}: PostsTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(filters, useMockData);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const flatData = useMemo(() => {
    const posts =
      data?.pages?.flatMap((page) => page.items).filter(Boolean) ?? [];
    // console.log("📊 PostsTable - Loaded posts:", posts.length, posts);
    return posts;
  }, [data]);

  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        id: "category",
        accessorKey: "category",
        header: "카테고리",
        size: 110,
        minSize: 100,
        maxSize: 150,
        enableSorting: true,
        cell: ({ row }) => {
          if (!row.original) return null;
          const category = row.original.category;
          const colors: Record<PostCategory, string> = {
            NOTICE:
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            QNA: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            FREE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          };
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${colors[category]}`}
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
        size: 250,
        minSize: 150,
        maxSize: 400,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="max-w-xs truncate font-medium text-gray-900 dark:text-white">
            {row.original?.title || "-"}
          </div>
        ),
      },
      {
        id: "body",
        accessorKey: "body",
        header: "내용",
        size: 300,
        minSize: 200,
        maxSize: 500,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="max-w-md truncate text-sm text-gray-600 dark:text-gray-400">
            {row.original?.body || "-"}
          </div>
        ),
      },
      {
        id: "tags",
        accessorKey: "tags",
        header: "태그",
        size: 180,
        minSize: 120,
        maxSize: 250,
        enableSorting: false,
        cell: ({ row }) => {
          const tags = row.original?.tags;
          if (!tags || tags.length === 0) {
            return <span className="text-xs text-gray-400">-</span>;
          }
          return (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{tags.length - 2}
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
        size: 140,
        minSize: 120,
        maxSize: 180,
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {row.original?.createdAt
              ? formatRelativeTime(row.original.createdAt)
              : "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "작업",
        size: 140,
        minSize: 120,
        maxSize: 160,
        enableSorting: false,
        enableResizing: false,
        cell: ({ row }) => {
          if (!row.original) return null;
          return (
            <div className="flex gap-1">
              <button
                onClick={() => onEditPost(row.original)}
                className="rounded px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors whitespace-nowrap"
              >
                수정
              </button>
              <button
                onClick={() => onDeletePost(row.original)}
                className="rounded px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap"
              >
                삭제
              </button>
            </div>
          );
        },
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
    enableColumnResizing: true,
    columnResizeMode,
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
      {/* 컬럼 가시성 토글 - 데스크톱만 표시 */}
      <div className="hidden md:flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/50">
        <div className="w-full sm:w-auto flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <span>📋 컬럼 표시:</span>
        </div>
        {table.getAllLeafColumns().map((column) => {
          if (column.id === "actions") return null;
          const isVisible = column.getIsVisible();
          return (
            <button
              key={column.id}
              onClick={column.getToggleVisibilityHandler()}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              {isVisible ? (
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              )}
              <span
                className={`${
                  isVisible
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {column.columnDef.header as string}
              </span>
            </button>
          );
        })}
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="md:hidden space-y-3">
        {flatData.map((post) => (
          <div
            key={post.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 hover:shadow-md transition-shadow"
          >
            {/* 카테고리와 날짜 */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  post.category === "NOTICE"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : post.category === "QNA"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {CATEGORY_LABELS[post.category]}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            {/* 제목 */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {post.title}
            </h3>

            {/* 내용 */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {post.body}
            </p>

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* 작업 버튼 */}
            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => onEditPost(post)}
                className="flex-1 rounded px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
              >
                수정
              </button>
              <button
                onClick={() => onDeletePost(post)}
                className="flex-1 rounded px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "800px" }}>
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="relative border-b-2 border-gray-200 px-2 sm:px-4 py-2.5 sm:py-3.5 text-left text-xs sm:text-sm font-bold text-gray-900 dark:border-gray-700 dark:text-white"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                : "flex items-center gap-1"
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400 text-base">
                                {{
                                  asc: "↑",
                                  desc: "↓",
                                }[header.column.getIsSorted() as string] ?? "⇅"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {/* 리사이저 */}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-0.5 cursor-col-resize select-none touch-none transition-all ${
                            header.column.getIsResizing()
                              ? "bg-blue-500 w-2 opacity-100 shadow-lg"
                              : "bg-gray-400 opacity-40 hover:opacity-100 hover:bg-blue-400 hover:w-2 dark:bg-gray-500"
                          }`}
                        >
                          {/* 리사이저 핸들 표시 */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                            <div className="w-[1px] h-3 bg-white/80 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-950">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50/50 dark:hover:bg-gray-900/70 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-sm"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 무한 스크롤 */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <span>더 불러오는 중...</span>
            </div>
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
