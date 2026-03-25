import { Router, type RequestHandler } from "express";
import type { AuthController } from "../controllers/auth.controller";

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await Promise.resolve(handler(req, res, next));
    } catch (error) {
      next(error);
    }
  };
};

export const createAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  router.post("/register", asyncHandler(authController.register));
  router.post("/login", asyncHandler(authController.login));
  router.post("/refresh", asyncHandler(authController.refresh));
  router.post("/logout", asyncHandler(authController.logout));

  return router;
};
