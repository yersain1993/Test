export type RegisterCredentials = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  code?: string;
  message?: string;
};

export type RegisterErrorReason =
  | 'user_already_exists'
  | 'validation_error'
  | 'unknown_error';

export type RegisterSuccess = {
  message: string;
};
