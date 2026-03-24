import type { AuthenticatedUser } from "../domain/user";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenService {
  generateTokens(payload: AuthenticatedUser): AuthTokens;
  verifyAccessToken(token: string): AuthenticatedUser;
}
