import { AppError } from "../errors/app-error";
import type { AuthSession } from "../interfaces/services/auth-service.interface";
import type { IUserRepository } from "../interfaces/repositories/user-repository.interface";
import type { IAuthService } from "../interfaces/services/auth-service.interface";
import type { IPasswordHasher } from "../interfaces/services/password-hasher.interface";
import type { AuthTokens, ITokenService } from "../interfaces/services/token-service.interface";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async register(email: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("User already exists", 400, "USER_ALREADY_EXISTS");
    }

    const passwordHash = await this.passwordHasher.hash(password);

    await this.userRepository.create({
      email,
      passwordHash
    });
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials", 400, "INVALID_CREDENTIALS");
    }

    const isPasswordValid = await this.passwordHasher.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 400, "INVALID_CREDENTIALS");
    }

    return this.tokenService.generateTokens({ email: user.email });
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      throw new AppError("Invalid credentials", 403, "INVALID_CREDENTIALS");
    }

    return {
      user: { email: user.email },
      tokens: this.tokenService.generateTokens({ email: user.email })
    };
  }
}
