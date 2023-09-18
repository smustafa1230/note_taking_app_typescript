import { check, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// validation rule note creation
export const createNoteValidationRules = [
  check("title").notEmpty().isString(),
  check("description").notEmpty().isString(),
];

export const validateNoteId = [
  param("noteId")
    .notEmpty()
    .withMessage("Note ID is required")
    .isNumeric()
    .withMessage("Note ID must be a number"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

// Middleware to handle validation errors
export const validateNote = (
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
