export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  email: string;
};

export type LoginResponse = {
  code?: string;
  message?: string;
  user?: AuthUser;
};

export type LoginSuccess = {
  message: string;
  user: AuthUser;
};

export type LoginErrorReason = 'invalid_credentials' | 'unknown_error';
