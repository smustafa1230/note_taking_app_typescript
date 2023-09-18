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
 *     summary: Create a new user
 *     description: Create a new user with the provided details.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user object containing user details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             first_name:
 *               type: string
 *               description: The first name of the user.
 *             last_name:
 *               type: string
 *               description: The last name of the user.
 *             email:
 *               type: string
 *               format: email
 *               description: The email address of the user.
 *             password:
 *               type: string
 *               format: password
 *               description: The password for the user.
 *         example:
 *           first_name: John
 *           last_name: Doe
 *           email: johndoe@example.com
 *           password: secret
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Bad request. Invalid input data.
 */
router.post(
  "/signup",
  createUserValidationRules, // Use the validation rules from the module
  validateUser,
  (req: Request, res: Response, next: NextFunction) => {
    userController.signup(req, res, next);
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: login
 *     description: login user to get token
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user object containing user details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: The email address of the user.
 *             password:
 *               type: string
 *               format: password
 *               description: The password for the user.
 *         example:
 *           email: johndoe@example.com
 *           password: secret
 *     responses:
 *       201:
 *         description: token in response.
 *       400:
 *         description: Bad request. Invalid input data.
 */
router.post(
  "/login",
  loginUserValidationRules,
  validateUser,
  (req: Request, res: Response, next: NextFunction) => {
    userController.login(req, res, next);
  }
);

export default router;
