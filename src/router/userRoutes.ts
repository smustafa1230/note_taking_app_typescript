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

/**
 * @swagger
 * /api/user/note/{noteId}:
 *   get:
 *     summary: get note by id
 *     description: Get note details by id.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         description: The path containing note id.
 *         required: true
 *
 *     responses:
 *       201:
 *         description: note object.
 *       400:
 *         description: Bad request. Invalid input data.
 */
router.get(
  "/note/:noteId",
  validateNoteId,
  (req: Request, res: Response, next: NextFunction) => {
    const noteId: string = req.params.noteId;
    return noteController.getByNoteId(noteId, res, next);
  }
);

/**
 * @swagger
 * /api/user/note:
 *   get:
 *     summary: get all note by user id
 *     description: Get all notes details by user id.
 *     security:
 *       - JWT: [] 

 *     responses:
 *       201:
 *         description: notes object.
 *       400:
 *         description: Bad request. Invalid input data.
 */
router.get("/note", (req: Request, res: Response, next: NextFunction) => {
  return noteController.getAllByUserId(res, next);
});

/**
 * @swagger
 * /api/user/note:
 *   post:
 *     summary: create new note
 *     description: Create a new note with the provided details.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: body
 *         name: note
 *         description: The note object containing user details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: The title.
 *             description:
 *               type: string
 *               description: The desc.
 *
 *     responses:
 *       201:
 *         description: Note created successfully.
 *       400:
 *         description: Bad request. Invalid input data.
 */
router.post(
  "/note",
  createNoteValidationRules, // Use the validation rules from the module
  validateNote,
  (req: Request, res: Response, next: NextFunction) => {
    noteController.create(req, res, next);
  }
);

/**
 * @swagger
 * /api/user/note/{noteId}:
 *   patch:
 *     summary: Update a note.
 *     description: Update note details.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note to update.
 *       - in: body
 *         name: note
 *         required: true
 *         description: The note object to update.
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 
 *     responses:
 *       200:
 *         description: note updated successfully.
 *       400:
 *         description: Bad request. Invalid input data.

 */

router.patch(
  "/note/:noteId",
  validateNoteId,
  createNoteValidationRules,
  validateNote,
  (req: Request, res: Response, next: NextFunction) => {
    noteController.update(req, res, next);
  }
);

/**
 * @swagger
 * /api/user/note/{noteId}:
 *   delete:
 *     summary: delete note details
 *     description: delete note details.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         description: The path containing note id.
 *         required: true
 *
 *     responses:
 *       201:
 *         description: success message.
 *       400:
 *         description: Bad request. Invalid input data.
 */
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
