import express, { NextFunction, Request, Response } from "express";
import Container from "typedi";
const router = express.Router();
import UserController from "./../controllers/user";
import {
  createUserValidationRules,
  loginUserValidationRules,
  validateUser,
} from "./../middleware/validator/userValidator";
const userController = Container.get(UserController);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: signup
 *     description: signup users
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User signup information in JSON format
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserSignupRequest'
 *     responses:
 *       200:
 *         description: Successful response.
 *         schema:
 *           $ref: '#/definitions/UserSignupResponse'
 */
router.post(
  "/signup",
  createUserValidationRules, // Use the validation rules from the module
  validateUser,
  (req: Request, res: Response, next: NextFunction) => {
    userController.signup(req, res, next);
  }
);

router.post(
  "/login",
  loginUserValidationRules,
  validateUser,
  (req: Request, res: Response, next: NextFunction) => {
    userController.login(req, res, next);
  }
);

export default router;
