import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { UserService } from "@/service/UserService";
import logger from "@/logger";

@Service()
class UserController {
  constructor(private userService: UserService) {}
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.signup(req.body);
      res.status(201).json({ message: "User Created successfully." });
    } catch (error) {
      logger.error("error: ", error);
      res.status(400).json({ error: error.message && "User creation failed" }); // can generalize it
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    return await this.userService.login(req.body, res, next);
  }
}

export default UserController;
