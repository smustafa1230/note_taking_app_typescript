import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { NoteService } from "@/service/NoteService";

@Service()
class NoteController {
  constructor(private noteService: NoteService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    await this.noteService.create(req.body, res, next);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { body, params } = req;
    return await this.noteService.update(params.noteId, body, res, next);
  }

  async getAllByUserId(res: Response, next: NextFunction) {
    return await this.noteService.getAll(res, next);
  }

  async getByNoteId(noteId: string, res: Response, next: NextFunction) {
    return await this.noteService.getByNoteId(noteId, res, next);
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    return await this.noteService.delete(req.params.noteId, res, next);
  }
}

export default NoteController;
