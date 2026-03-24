import { createApp } from "./app/create-app";
import { env } from "./config/env";
import { AuthController } from "./controllers/auth.controller";
import { UserController } from "./controllers/user.controller";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { InMemoryUserRepository } from "./repositories/in-memory-user.repository";
import { AuthService } from "./services/auth.service";
import { BcryptPasswordHasher } from "./services/bcrypt-password-hasher.service";
import { JwtTokenService } from "./services/jwt-token.service";

export const startServer = (): void => {
  const userRepository = new InMemoryUserRepository();
  const passwordHasher = new BcryptPasswordHasher();

  const tokenService = new JwtTokenService({
    accessSecret: env.ACCESS_SECRET,
    refreshSecret: env.REFRESH_SECRET,
    accessTokenExpiration: env.ACCESS_TOKEN_EXPIRATION,
    refreshTokenExpiration: env.REFRESH_TOKEN_EXPIRATION
  });

  const authService = new AuthService(userRepository, passwordHasher, tokenService);
  const authController = new AuthController(authService);
  const userController = new UserController();
  const authMiddleware = new AuthMiddleware(tokenService);

  const app = createApp(
    {
      authController,
      userController,
      authMiddleware
    },
    env.CORS_ORIGIN
  );

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
};
