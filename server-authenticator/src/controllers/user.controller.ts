import type { Request, Response } from "express";

export class UserController {
  getCurrentUser = (req: Request, res: Response): void => {
    res.status(200).json({ email: req.user?.email });
  };
}
