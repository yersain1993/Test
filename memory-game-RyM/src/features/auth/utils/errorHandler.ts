import { isAxiosError } from 'axios';
import type { LoginErrorReason } from '../types/loginTypes';
import type { RegisterErrorReason } from '../types/registerTypes';

type BackendErrorPayload = {
  code?: string;
  message?: string;
};

type HttpErrorInfo = {
  status?: number;
  code?: string;
  message: string;
};

const SESSION_ERROR_CODES = new Set([
  'AUTH_TOKEN_MISSING',
  'AUTH_TOKEN_INVALID',
  'AUTH_TOKEN_MALFORMED',
]);

export const extractHttpError = (error: unknown): HttpErrorInfo => {
  if (isAxiosError<BackendErrorPayload>(error)) {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const message =
      error.response?.data?.message ??
      error.message ??
      'Unexpected request error';

    return { status, code, message };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Unexpected request error' };
};

export const mapLoginErrorReason = (error: unknown): LoginErrorReason => {
  const { status, code } = extractHttpError(error);

  if (
    code === 'INVALID_CREDENTIALS' ||
    code === 'VALIDATION_ERROR' ||
    status === 400
  ) {
    return 'invalid_credentials';
  }

  return 'unknown_error';
};

export const mapRegisterErrorReason = (error: unknown): RegisterErrorReason => {
  const { status, code } = extractHttpError(error);

  if (code === 'USER_ALREADY_EXISTS') {
    return 'user_already_exists';
  }

  if (code === 'VALIDATION_ERROR' || status === 400) {
    return 'validation_error';
  }

  return 'unknown_error';
};

export const isExpectedSessionError = (error: unknown): boolean => {
  const { status, code } = extractHttpError(error);

  return (
    status === 401 ||
    status === 403 ||
    (code ? SESSION_ERROR_CODES.has(code) : false)
  );
};
