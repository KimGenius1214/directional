/**
 * 게시글 관련 타입 정의
 */

export type PostCategory = "NOTICE" | "QNA" | "FREE";

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostDto {
  title: string;
  body: string;
  category: PostCategory;
  tags?: string[];
}

export interface UpdatePostDto {
  title?: string;
  body?: string;
  category?: PostCategory;
  tags?: string[];
}

export interface PostFilters {
  search?: string;
  category?: PostCategory;
  sortBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
  cursor?: string | null;
  limit?: number;
}

export interface PostsResponse {
  items: Post[];
  prevCursor: string | null;
  nextCursor: string | null;
}
