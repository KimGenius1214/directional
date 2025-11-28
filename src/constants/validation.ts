/**
 * 검증 규칙 및 상수
 */

// 금칙어 목록
export const FORBIDDEN_WORDS = ['캄보디아', '프놈펜', '불법체류', '텔레그램'] as const;

// 게시글 검증 규칙
export const POST_VALIDATION = {
  TITLE_MAX_LENGTH: 80,
  BODY_MAX_LENGTH: 2000,
  TAG_MAX_LENGTH: 24,
  TAG_MAX_COUNT: 5,
} as const;

// 카테고리 라벨
export const CATEGORY_LABELS: Record<string, string> = {
  NOTICE: '공지사항',
  QNA: '질문/답변',
  FREE: '자유게시판',
} as const;

// 금칙어 체크 함수
export const containsForbiddenWord = (text: string): boolean => {
  return FORBIDDEN_WORDS.some((word) => text.includes(word));
};

// 금칙어 메시지
export const getForbiddenWordMessage = (text: string): string | null => {
  const foundWord = FORBIDDEN_WORDS.find((word) => text.includes(word));
  if (foundWord) {
    return `금칙어 "${foundWord}"가 포함되어 있습니다.`;
  }
  return null;
};

