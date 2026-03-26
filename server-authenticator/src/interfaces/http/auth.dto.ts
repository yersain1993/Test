export interface RegisterRequestBody {
  email?: string;
  password?: string;
}

export interface LoginRequestBody {
  email?: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}
