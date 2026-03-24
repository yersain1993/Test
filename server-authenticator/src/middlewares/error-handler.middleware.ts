import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError("Route not found", 404, "ROUTE_NOT_FOUND"));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code
    });
    return;
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";

  res.status(500).json({
    message,
    code: "INTERNAL_ERROR"
  });
};
