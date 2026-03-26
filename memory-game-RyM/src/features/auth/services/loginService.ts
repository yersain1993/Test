import type {
  LoginCredentials,
  LoginErrorReason,
  LoginResponse,
  LoginSuccess,
} from "../types/loginTypes";
import { apiClient } from "@/features/api/axiosInstance";
import { mapLoginErrorReason } from "../utils/errorHandler";


export type LoginResult =
  | { ok: true; data: LoginSuccess }
  | { ok: false; reason: LoginErrorReason };

export const loginWithCredentials = async (credentials: LoginCredentials): Promise<LoginResult> => {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    const data = response.data ?? {};

    return {
      ok: true,
      data: {
        message: data.message ?? 'Login successful',
        user: data.user ?? { email: credentials.email.trim() },
      },
    };
  } catch (error) {
    return { ok: false, reason: mapLoginErrorReason(error) };
  }
};
