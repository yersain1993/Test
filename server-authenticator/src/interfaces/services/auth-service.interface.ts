import type { AuthTokens } from "./token-service.interface";
import type { AuthenticatedUser } from "../domain/user";

export interface AuthSession {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}

export interface IAuthService {
  register(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<AuthTokens>;
  refresh(refreshToken: string): Promise<AuthSession>;
}
