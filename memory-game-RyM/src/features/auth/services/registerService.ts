import type {
  RegisterCredentials,
  RegisterErrorReason,
  RegisterResponse,
  RegisterSuccess,
} from '@/features/auth/types/registerTypes';
import { apiClient } from '@/features/auth/api/axiosInstance';
import { mapRegisterErrorReason } from '../utils/errorHandler';

export type RegisterResult =
  | { ok: true; data: RegisterSuccess }
  | { ok: false; reason: RegisterErrorReason };

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<RegisterResult> => {
  try {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      credentials
    );
    const data = response.data ?? {};

    return {
      ok: true,
      data: {
        message: data.message ?? 'User registered',
      },
    };
  } catch (error) {
    return { ok: false, reason: mapRegisterErrorReason(error) };
  }
};
