import type { AuthenticatedUser } from "../interfaces/domain/user";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
