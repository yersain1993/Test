import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import type { ITokenService } from "../interfaces/services/token-service.interface";

export class AuthMiddleware {
  constructor(private readonly tokenService: ITokenService) {}

  handle = (req: Request, _res: Response, next: NextFunction): void => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      next(new AppError("No token provided", 401, "AUTH_TOKEN_MISSING"));
      return;
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      next(new AppError("Malformed authorization header", 401, "AUTH_TOKEN_MALFORMED"));
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
}
