import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller";
import type { UserController } from "../controllers/user.controller";
import type { AuthMiddleware } from "../middlewares/auth.middleware";
import { createAuthRouter } from "./auth.routes";
import { createUserRouter } from "./user.routes";

export interface RouteDependencies {
  authController: AuthController;
  userController: UserController;
  authMiddleware: AuthMiddleware;
}

export const createApiRouter = (dependencies: RouteDependencies): Router => {
  const router = Router();

  router.use("/auth", createAuthRouter(dependencies.authController));
  router.use("/user", createUserRouter(dependencies.userController, dependencies.authMiddleware));

  return router;
};
