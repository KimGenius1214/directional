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

/**
 * 게시글 무한 스크롤 조회 (Cursor 기반)
 */
export const usePosts = (filters: PostFilters = {}) => {
  console.log("🔎 usePosts - Called with filters:", filters);

  return useInfiniteQuery({
    queryKey: ["posts", filters],
    queryFn: ({ pageParam }) => {
      console.log("🔎 usePosts - queryFn called with cursor:", pageParam);
      return postsApi.getPosts({ ...filters, cursor: pageParam, limit: 20 });
    },
    getNextPageParam: (lastPage) => {
      console.log("🔎 usePosts - getNextPageParam:", {
        nextCursor: lastPage.nextCursor,
        itemsCount: lastPage.items.length,
      });
      return lastPage.nextCursor;
    },
    initialPageParam: null as string | null,
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
    },
  });
};
