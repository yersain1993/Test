import type { AuthTokens } from "./token-service.interface";

export interface IAuthService {
  register(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<AuthTokens>;
}
