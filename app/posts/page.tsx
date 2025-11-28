/**
 * 게시판 페이지
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useDeletePost } from "@/features/posts/hooks";
import {
  PostsTable,
  PostFormModal,
  TableToolbar,
} from "@/features/posts/components";
import { Sidebar } from "@/components/layout";
import type { Post, PostCategory } from "@/types/post";

export default function PostsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // 검색 및 필터 상태
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PostCategory | "">("");

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const deletePost = useDeletePost();

  // 미인증 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

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
        } catch (error) {
          console.error("게시글 삭제 실패:", error);
          alert("게시글 삭제에 실패했습니다.");
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

  // 로딩 상태 표시
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">
          로그인 페이지로 이동 중...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  게시판
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  게시글을 작성하고 관리하세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-full space-y-6">
            {/* 툴바 */}
            <TableToolbar
              search={search}
              category={category}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onCreatePost={handleCreatePost}
            />

            {/* 테이블 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <PostsTable
                filters={filters}
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
  );
}
