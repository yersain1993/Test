import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import type { ITokenService } from "../interfaces/services/token-service.interface";

export class AuthMiddleware {
  constructor(private readonly tokenService: ITokenService) {}

  handle = (req: Request, _res: Response, next: NextFunction): void => {
    const cookieToken = req.cookies?.accessToken as string | undefined;
    const authorization = req.headers.authorization;
    const bearerToken = this.extractBearerToken(authorization);
    const token = cookieToken ?? bearerToken;

    if (!token) {
      next(new AppError("No token provided", 401, "AUTH_TOKEN_MISSING"));
      return;
    }

    try {
      const payload = this.tokenService.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch {
      next(new AppError("Invalid or expired token", 403, "AUTH_TOKEN_INVALID"));
    }
  };

  private extractBearerToken(authorization: string | undefined): string | undefined {
    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return undefined;
    }

    return token;
  }
}
