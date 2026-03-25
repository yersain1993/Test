import type { Request, Response } from "express";
import { AppError } from "../errors/app-error";
import type { LoginRequestBody, RegisterRequestBody } from "../interfaces/http/auth.dto";
import type { IAuthService } from "../interfaces/services/auth-service.interface";
import { clearAuthCookies, setAuthCookies } from "../utils/auth-cookies";
import type { LogoutResponse, LoginResponse, RefreshResponse } from "../interfaces/http/auth.dto";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (req: Request<unknown, unknown, RegisterRequestBody>, res: Response): Promise<void> => {
    const credentials = this.validateRegisterCredentials(req.body.email, req.body.password);

    await this.authService.register(credentials.email, credentials.password);

    res.status(201).json({ message: "User registered" });
  };

  login = async (req: Request<unknown, unknown, LoginRequestBody>, res: Response): Promise<void> => {
    const credentials = this.validateLoginCredentials(req.body.email, req.body.password);

    const { accessToken, refreshToken } = await this.authService.login(
      credentials.email,
      credentials.password
    );

    setAuthCookies(res, { accessToken, refreshToken });

    const response: LoginResponse = {
      message: "Login successful",
      user: {
        email: credentials.email
      }
    };

    res.status(200).json({
      ...response
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new AppError("No refresh token provided", 401, "AUTH_TOKEN_MISSING");
    }

    const session = await this.authService.refresh(refreshToken);
    setAuthCookies(res, session.tokens);

    const response: RefreshResponse = {
      message: "Session refreshed",
      user: session.user
    };

    res.status(200).json(response);
  };

  logout = (_req: Request, res: Response): void => {
    clearAuthCookies(res);

    const response: LogoutResponse = {
      message: "Logout successful"
    };

    res.status(200).json(response);
  };

  private validateLoginCredentials(
    email: string | undefined,
    password: string | undefined
  ): { email: string; password: string } {
    const normalizedEmail = email?.trim();

    if (!normalizedEmail || !password) {
      throw new AppError("Email and password are required", 400, "VALIDATION_ERROR");
    }

    return {
      email: normalizedEmail,
      password
    };
  }

  private validateRegisterCredentials(
    email: string | undefined,
    password: string | undefined
  ): { email: string; password: string } {
    const credentials = this.validateLoginCredentials(email, password);

    if (credentials.password.length < 8) {
      throw new AppError("Password must have at least 8 characters", 400, "VALIDATION_ERROR");
    }

    return credentials;
  }
}
