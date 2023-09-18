import express, { NextFunction, Request, Response } from "express";
import Container from "typedi";
const router = express.Router();
import {
  createNoteValidationRules,
  validateNote,
  validateNoteId,
} from "../middleware/validator/noteValidator";
import NoteController from "@/controllers/note";

const noteController = Container.get(NoteController);

router.get(
  "/note/:noteId",
  validateNoteId,
  (req: Request, res: Response, next: NextFunction) => {
    const noteId: string = req.params.noteId;
    return noteController.getByNoteId(noteId, res, next);
  }
);

router.get("/note", (req: Request, res: Response, next: NextFunction) => {
  return noteController.getAllByUserId(res, next);
});
// @route   POST api/users/register
router.post(
  "/note",
  createNoteValidationRules, // Use the validation rules from the module
  validateNote,
  (req: Request, res: Response, next: NextFunction) => {
    noteController.create(req, res, next);
  }
);

router.patch(
  "/note/:noteId",
  validateNoteId,
  createNoteValidationRules,
  validateNote,
  (req: Request, res: Response, next: NextFunction) => {
    noteController.update(req, res, next);
  }
);

router.delete(
  "/note/:noteId",
  validateNoteId,
  createNoteValidationRules,
  validateNote,
  (req: Request, res: Response, next: NextFunction) => {
    noteController.delete(req, res, next);
  }
);

export default router;
