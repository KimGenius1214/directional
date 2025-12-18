/**
 * 게시판 페이지
 * SSR: 매 요청마다 서버에서 렌더링
 */

"use client";

// SSR: 매 요청마다 서버에서 렌더링
export const dynamic = "force-dynamic";

import { useState, useCallback } from "react";
import { useDeletePost } from "@/features/posts/hooks";
import {
  PostsTable,
  PostFormModal,
  TableToolbar,
} from "@/features/posts/components";
import { Header } from "@/components/layout";
import { ErrorBoundary } from "@/components/error";
import type { Post, PostCategory } from "@/types/post";

export default function PostsPage() {
  // 검색 및 필터 상태
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PostCategory | "">("");
  const [useMockData, setUseMockData] = useState(false);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const deletePost = useDeletePost();

  // 미들웨어에서 이미 인증 체크를 하므로 클라이언트 사이드 체크는 불필요
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [isAuthenticated, router]);

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = useCallback((post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  }, []);

  const handleDeletePost = useCallback(
    async (post: Post) => {
      if (window.confirm(`"${post.title}" 게시글을 삭제하시겠습니까?`)) {
        try {
          await deletePost.mutateAsync(post.id);
        } catch {
          // Toast로 이미 에러가 표시되므로 추가 처리 불필요
          // 에러가 발생해도 앱이 크래시되지 않음
        }
      }
    },
    [deletePost]
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  // 디바운스된 검색을 위한 필터 객체
  const filters = {
    search: search.trim() || undefined,
    category: category || undefined,
  };

  // 미들웨어에서 이미 인증 체크를 하므로 이 부분도 불필요
  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
  //       <div className="text-gray-500 dark:text-gray-400">
  //         로그인 페이지로 이동 중...
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    게시판
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    게시글을 작성하고 관리하세요
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 lg:px-8">
            <div className="space-y-4 sm:space-y-6">
              {/* 툴바 */}
              <TableToolbar
                search={search}
                category={category}
                useMockData={useMockData}
                onSearchChange={setSearch}
                onCategoryChange={setCategory}
                onMockDataToggle={setUseMockData}
                onCreatePost={handleCreatePost}
              />

              {/* 테이블 */}
              <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <PostsTable
                  filters={filters}
                  useMockData={useMockData}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              </div>
            </div>
          </div>
        </main>

        {/* 모달 */}
        <PostFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          post={editingPost}
        />
      </div>
    </ErrorBoundary>
  );
}
