import type { AuthUser } from "../types/loginTypes";
import { apiClient } from "@/features/api/axiosInstance";

export type SessionResult =
  | AuthUser | undefined

type SessionResponse = {
  user?: AuthUser;
  message?: string;
};

export const refreshSession = async (): Promise<SessionResult> => {
  try {
    const response = await apiClient.post<SessionResponse>("/auth/refresh");
    const data = response.data;
    const user = data.user;

    return user;
  } catch(error) {
    console.error("Error refreshing session:", error);
  }
};

export const logoutSession = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
  } catch(error) {
    console.error("Error logging out:", error);
  }
};
