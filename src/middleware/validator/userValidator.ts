import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// validation rule signup
export const createUserValidationRules = [
  check("first_name").notEmpty().isString(),
  check("last_name").notEmpty().isString(),
  check("email").isEmail().withMessage("Email format is invalid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password length should be more then 6 char."),
];

// validation rule
export const loginUserValidationRules = [
  check("email").isEmail(),
  check("password").notEmpty(),
];

// Middleware to handle validation errors
export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
