/**
 * 인증 관련 타입 정의
 */

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
}

