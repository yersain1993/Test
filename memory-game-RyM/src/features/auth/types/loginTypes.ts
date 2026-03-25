export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  code?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type LoginSuccess = {
  accessToken?: string;
  refreshToken?: string;
};

export type LoginErrorReason = 'invalid_credentials' | 'unknown_error';