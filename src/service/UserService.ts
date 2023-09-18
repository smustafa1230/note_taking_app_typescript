import { UserReturnType, User, UserRequestType } from "@/entities/User";
import "reflect-metadata";
import { Service } from "typedi";
import logger from "./../logger";
import AppDataSource from "@/orm";
import { Repository, FindOptionsWhere } from "typeorm";
import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/config";
import { CustomError } from "@/middleware/exception/CustomError";

@Service()
export class UserService {
  userRepository: Repository<User> = AppDataSource.getRepository(User);
  constructor(private customError: CustomError) {}
  async signup(body: UserRequestType): Promise<UserReturnType> {
    try {
      logger.info("body: ", body);

      const user: User = await this.userRepository.findOneBy({
        email: body.email,
      } as FindOptionsWhere<User>);

      if (user) {
        throw new Error("Email already exists");
      }
      const newUser = this.userRepository.create({ ...body });
      const result: User = await this.userRepository.save(newUser);
      return result;
    } catch (ex) {
      logger.error("exception: ", ex);
      throw ex;
    }
  }
  async login(
    body: UserRequestType,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = body;
      const user: User = await this.userRepository
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .addSelect("user.password")
        .getOne();

      if (!user) {
        return next(this.customError.createError("user not found.", 404));
      }

      const passwordMatches = await user.checkPassword(password);

      if (!passwordMatches) {
        return next(this.customError.createError("user not found.", 404));
      }

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    } catch (error) {
      next(this.customError.createError("user not found.", 404));
    }
  }
}
