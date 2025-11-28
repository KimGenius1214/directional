/**
 * 게시글 API 엔드포인트
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostFilters,
  PostsResponse,
} from "@/types/post";

export const postsApi = {
  /**
   * 게시글 목록 조회 (Cursor 기반 페이지네이션)
   */
  getPosts: async (filters: PostFilters = {}): Promise<PostsResponse> => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.cursor) params.append("cursor", filters.cursor);
    if (filters.limit) params.append("limit", filters.limit.toString());

    console.log("📝 getPosts - Filters:", filters);
    console.log("📝 getPosts - Query params:", params.toString());

    const response = await apiClient.get<PostsResponse>(
      `${API_ENDPOINTS.POSTS.BASE}?${params.toString()}`
    );

    console.log("📝 getPosts - Response:", response.data);
    return response.data;
  },

  /**
   * 게시글 상세 조회
   */
  getPost: async (id: string): Promise<Post> => {
    const response = await apiClient.get<Post>(API_ENDPOINTS.POSTS.BY_ID(id));
    return response.data;
  },

  /**
   * 게시글 작성
   */
  createPost: async (data: CreatePostDto): Promise<Post> => {
    const response = await apiClient.post<Post>(API_ENDPOINTS.POSTS.BASE, data);
    return response.data;
  },

  /**
   * 게시글 수정
   */
  updatePost: async (id: string, data: UpdatePostDto): Promise<Post> => {
    const response = await apiClient.patch<Post>(
      API_ENDPOINTS.POSTS.BY_ID(id),
      data
    );
    return response.data;
  },

  /**
   * 게시글 삭제
   */
  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.POSTS.BY_ID(id));
  },
};
