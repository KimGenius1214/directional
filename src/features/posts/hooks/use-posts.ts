/**
 * 게시글 관련 React Query 훅
 */

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { postsApi } from "@/lib/api/endpoints";
import type { PostFilters, CreatePostDto, UpdatePostDto } from "@/types/post";
import { toast } from "sonner";

/**
 * 게시글 무한 스크롤 조회 (Cursor 기반)
 * @param filters - 검색 및 필터 조건
 * @param useMockData - true면 mock 데이터 사용, false면 실제 API 사용
 */
export const usePosts = (filters: PostFilters = {}, useMockData = false) => {
  return useInfiniteQuery({
    queryKey: ["posts", filters, useMockData],
    queryFn: async ({ pageParam }) => {
      if (useMockData) {
        // Mock 데이터 사용
        const mockPosts = await postsApi.getMockPosts();

        // 필터 적용 (클라이언트 사이드)
        let filteredPosts = mockPosts;

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredPosts = filteredPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchLower) ||
              post.body.toLowerCase().includes(searchLower)
          );
        }

        if (filters.category) {
          filteredPosts = filteredPosts.filter(
            (post) => post.category === filters.category
          );
        }

        // Mock 데이터 페이지네이션 (20개씩)
        const pageSize = 20;
        const currentPage = pageParam ? parseInt(String(pageParam)) : 0;
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
        const hasMore = endIndex < filteredPosts.length;

        return {
          items: paginatedPosts,
          nextCursor: hasMore ? String(currentPage + 1) : null,
        };
      } else {
        // 실제 API 사용
        return postsApi.getPosts({ ...filters, cursor: pageParam, limit: 20 });
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    initialPageParam: "0" as string | null,
  });
};

/**
 * 게시글 상세 조회
 */
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  });
};

/**
 * 게시글 작성
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("게시글 작성 완료", {
        description: "게시글이 성공적으로 작성되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast.error("게시글 작성 실패", {
        description: error.message || "게시글 작성 중 오류가 발생했습니다.",
      });
    },
  });
};

/**
 * 게시글 수정
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostDto }) =>
      postsApi.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
      toast.success("게시글 수정 완료", {
        description: "게시글이 성공적으로 수정되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast.error("게시글 수정 실패", {
        description: error.message || "게시글 수정 중 오류가 발생했습니다.",
      });
    },
  });
};

/**
 * 게시글 삭제
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("게시글 삭제 완료", {
        description: "게시글이 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast.error("게시글 삭제 실패", {
        description: error.message || "게시글 삭제 중 오류가 발생했습니다.",
      });
    },
  });
};
