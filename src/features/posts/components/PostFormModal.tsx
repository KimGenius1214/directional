/**
 * 게시글 작성/수정 모달
 */

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Textarea, Select, Button, Alert } from "@/components/ui";
import { useCreatePost, useUpdatePost } from "../hooks";
import type { Post, PostCategory } from "@/types/post";
import {
  FORBIDDEN_WORDS,
  POST_VALIDATION,
  CATEGORY_LABELS,
} from "@/constants/validation";

// Zod 검증 스키마
const postSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력하세요")
    .max(
      POST_VALIDATION.TITLE_MAX_LENGTH,
      `제목은 ${POST_VALIDATION.TITLE_MAX_LENGTH}자 이하여야 합니다`
    )
    .refine(
      (val) => !FORBIDDEN_WORDS.some((word) => val.includes(word)),
      "금칙어가 포함되어 있습니다"
    ),
  body: z
    .string()
    .min(1, "본문을 입력하세요")
    .max(
      POST_VALIDATION.BODY_MAX_LENGTH,
      `본문은 ${POST_VALIDATION.BODY_MAX_LENGTH}자 이하여야 합니다`
    )
    .refine(
      (val) => !FORBIDDEN_WORDS.some((word) => val.includes(word)),
      "금칙어가 포함되어 있습니다"
    ),
  category: z.enum(["NOTICE", "QNA", "FREE"]),
  tags: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post | null;
}

export default function PostFormModal({
  isOpen,
  onClose,
  post,
}: PostFormModalProps) {
  const isEditMode = !!post;

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      category: "FREE",
      tags: "",
    },
  });

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("body", post.body);
      setValue("category", post.category);
      setValue("tags", post.tags?.join(", ") || "");
    } else {
      reset();
    }
  }, [post, setValue, reset]);

  const onSubmit = async (data: PostFormData) => {
    try {
      // 태그를 배열로 변환
      const tags = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .slice(0, POST_VALIDATION.TAG_MAX_COUNT)
        : [];

      const postData = {
        title: data.title,
        body: data.body,
        category: data.category as PostCategory,
        tags,
      };

      if (isEditMode && post) {
        await updatePost.mutateAsync({ id: post.id, data: postData });
      } else {
        await createPost.mutateAsync(postData);
      }

      reset();
      onClose();
    } catch (error) {
      console.error("게시글 저장 실패:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "게시글 수정" : "새 게시글 작성"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="제목"
          placeholder="게시글 제목을 입력하세요"
          error={errors.title?.message}
          {...register("title")}
        />

        <Select
          label="카테고리"
          options={[
            { value: "FREE", label: CATEGORY_LABELS.FREE },
            { value: "QNA", label: CATEGORY_LABELS.QNA },
            { value: "NOTICE", label: CATEGORY_LABELS.NOTICE },
          ]}
          error={errors.category?.message}
          {...register("category")}
        />

        <Textarea
          label="본문"
          placeholder="게시글 내용을 입력하세요"
          rows={8}
          error={errors.body?.message}
          helperText={`${POST_VALIDATION.BODY_MAX_LENGTH}자 이하`}
          {...register("body")}
        />

        <Input
          label="태그"
          placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 공지, 질문)"
          error={errors.tags?.message}
          helperText={`최대 ${POST_VALIDATION.TAG_MAX_COUNT}개, 각 ${POST_VALIDATION.TAG_MAX_LENGTH}자 이하`}
          {...register("tags")}
        />

        {/* 금칙어 안내 */}
        <Alert variant="warning">
          <div className="text-xs space-y-1">
            <p className="font-semibold">⚠️ 금칙어</p>
            <p>다음 단어는 사용할 수 없습니다: {FORBIDDEN_WORDS.join(", ")}</p>
          </div>
        </Alert>

        {/* 에러 메시지 */}
        {(createPost.isError || updatePost.isError) && (
          <Alert variant="error">
            <p className="text-sm">
              {isEditMode
                ? "게시글 수정에 실패했습니다."
                : "게시글 작성에 실패했습니다."}
            </p>
          </Alert>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createPost.isPending || updatePost.isPending}
          >
            {isEditMode ? "수정" : "작성"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
