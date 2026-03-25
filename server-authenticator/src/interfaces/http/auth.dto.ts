export interface AuthUser {
  email: string;
}

export interface RegisterRequestBody {
  email?: string;
  password?: string;
}

export interface LoginRequestBody {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

export interface RefreshResponse {
  message: string;
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}
