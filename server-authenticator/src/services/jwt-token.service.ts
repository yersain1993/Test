import jwt, { type SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/app-error";
import type { AuthenticatedUser } from "../interfaces/domain/user";
import type { AuthTokens, ITokenService } from "../interfaces/services/token-service.interface";

export interface JwtTokenServiceConfig {
  accessSecret: string;
  refreshSecret: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
}

export class JwtTokenService implements ITokenService {
  constructor(private readonly config: JwtTokenServiceConfig) {}

  generateTokens(payload: AuthenticatedUser): AuthTokens {
    const accessToken = jwt.sign(
      payload,
      this.config.accessSecret,
      { expiresIn: this.config.accessTokenExpiration } as SignOptions
    );

    const refreshToken = jwt.sign(
      payload,
      this.config.refreshSecret,
      { expiresIn: this.config.refreshTokenExpiration } as SignOptions
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    return this.verifyToken(token, this.config.accessSecret);
  }

  verifyRefreshToken(token: string): AuthenticatedUser {
    return this.verifyToken(token, this.config.refreshSecret);
  }

  private verifyToken(token: string, secret: string): AuthenticatedUser {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== "object" || decoded === null || typeof decoded.email !== "string") {
      throw new AppError("Invalid token payload", 403, "AUTH_TOKEN_INVALID");
    }

    return { email: decoded.email };
  }
}
