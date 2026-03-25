import type { Request, Response } from "express";

export class UserController {
  getCurrentUser = (req: Request, res: Response): void => {
    res.status(200).json({
      user: {
        email: req.user?.email
      }
    });
  };
}
