import type {
  LoginCredentials,
  LoginErrorReason,
  LoginResponse,
  LoginSuccess,
} from "../types/loginTypes";
import { apiClient } from "@/features/api/axiosInstance";


export type LoginResult =
  | { ok: true; data: LoginSuccess }
  | { ok: false; reason: LoginErrorReason };

export const loginWithCredentials = async (credentials: LoginCredentials): Promise<LoginResult> => {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    const data = response.data ?? {};

    if (response.status >= 400) {
      if (data.code === 'INVALID_CREDENTIALS' || data.code === 'VALIDATION_ERROR' || response.status === 400) {
        return { ok: false, reason: 'invalid_credentials' };
      }

      return { ok: false, reason: 'unknown_error' };
    }

    return {
      ok: true,
      data: {
        message: data.message ?? 'Login successful',
        user: data.user ?? { email: credentials.email.trim() },
      },
    };
  } catch {
    return { ok: false, reason: 'unknown_error' };
  }
};
