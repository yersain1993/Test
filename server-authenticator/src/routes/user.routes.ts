import { Router } from "express";
import type { UserController } from "../controllers/user.controller";
import type { AuthMiddleware } from "../middlewares/auth.middleware";

export const createUserRouter = (userController: UserController, authMiddleware: AuthMiddleware): Router => {
  const router = Router();

  router.get("/", authMiddleware.handle, userController.getCurrentUser);

  return router;
};
