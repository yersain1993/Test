import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import { errorHandler, notFoundHandler } from "../middlewares/error-handler.middleware";
import { createApiRouter, type RouteDependencies } from "../routes";

export const createApp = (dependencies: RouteDependencies, corsOrigin: string): Express => {
  const app = express();

  const corsOptions: CorsOptions = {
    origin: corsOrigin === "*" ? true : corsOrigin,
    credentials: true
  };

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsOptions));

  app.use("/api", createApiRouter(dependencies));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
