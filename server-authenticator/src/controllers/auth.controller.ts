import type { Request, Response } from "express";
import { AppError } from "../errors/app-error";
import type { LoginRequestBody, RegisterRequestBody } from "../interfaces/http/auth.dto";
import type { IAuthService } from "../interfaces/services/auth-service.interface";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (req: Request<unknown, unknown, RegisterRequestBody>, res: Response): Promise<void> => {
    const credentials = this.validateAndNormalizeCredentials(req.body.email, req.body.password);

    await this.authService.register(credentials.email, credentials.password);

    res.status(201).json({ message: "User registered" });
  };

  login = async (req: Request<unknown, unknown, LoginRequestBody>, res: Response): Promise<void> => {
    const credentials = this.validateAndNormalizeCredentials(req.body.email, req.body.password);

    const { accessToken, refreshToken } = await this.authService.login(
      credentials.email,
      credentials.password
    );

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });
  };

  private validateAndNormalizeCredentials(
    email: string | undefined,
    password: string | undefined
  ): { email: string; password: string } {
    const normalizedEmail = email?.trim();

    if (!normalizedEmail || !password) {
      throw new AppError("Email and password are required", 400, "VALIDATION_ERROR");
    }

    if (password.length < 8) {
      throw new AppError("Password must have at least 8 characters", 400, "VALIDATION_ERROR");
    }

    return {
      email: normalizedEmail,
      password
    };
  }
}
