import type { LoginCredentials, LoginErrorReason, LoginResponse, LoginSuccess } from "../types/loginTypes";


export type LoginResult =
  | { ok: true; data: LoginSuccess }
  | { ok: false; reason: LoginErrorReason };

const LOGIN_URL = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:8000/api/auth/login';

export const loginWithCredentials = async (credentials: LoginCredentials): Promise<LoginResult> => {
  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = (await response.json().catch(() => ({}))) as LoginResponse;

    if (!response.ok) {
      if (data.code === 'INVALID_CREDENTIALS' || response.status === 400) {
        return { ok: false, reason: 'invalid_credentials' };
      }

      return { ok: false, reason: 'unknown_error' };
    }

    return {
      ok: true,
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    };
  } catch {
    return { ok: false, reason: 'unknown_error' };
  }
};

export const persistAuthTokens = ({ accessToken, refreshToken }: LoginSuccess) => {
  if (accessToken) {
    localStorage.setItem('auth.accessToken', accessToken);
  }

  if (refreshToken) {
    localStorage.setItem('auth.refreshToken', refreshToken);
  }
};
