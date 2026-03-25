import type {
  RegisterCredentials,
  RegisterErrorReason,
  RegisterResponse,
  RegisterSuccess,
} from '@/features/auth/types/registerTypes';
import { apiClient } from '@/features/api/axiosInstance';

export type RegisterResult =
  | { ok: true; data: RegisterSuccess }
  | { ok: false; reason: RegisterErrorReason };

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<RegisterResult> => {
  try {
    const response = await apiClient.post<RegisterResponse>("/auth/register", credentials);
    const data = response.data ?? {};

    if (response.status >= 400) {
      if (data.code === 'USER_ALREADY_EXISTS') {
        return { ok: false, reason: 'user_already_exists' };
      }

      if (data.code === 'VALIDATION_ERROR' || response.status === 400) {
        return { ok: false, reason: 'validation_error' };
      }

      return { ok: false, reason: 'unknown_error' };
    }

    return {
      ok: true,
      data: {
        message: data.message ?? 'User registered',
      },
    };
  } catch {
    return { ok: false, reason: 'unknown_error' };
  }
};
