import { UserReturnType, User } from "@/entities/User";
import "reflect-metadata";
import { Service } from "typedi";
import logger from "../logger";
import AppDataSource from "@/orm";
import { FindOptionsWhere, Repository, SimpleConsoleLogger } from "typeorm";
import { NextFunction, Response } from "express";
import { CustomError } from "@/middleware/exception/CustomError";
import { Note, NoteReturnType } from "@/entities/Note";
import { RedisUtils } from "@/utils/RedisUtils";
import { REDIS_NOTES_KEY } from "@/utils/Constant";

@Service()
export class NoteService {
  noteRepository: Repository<Note> = AppDataSource.getRepository(Note);
  constructor(
    private customError: CustomError,
    private redisUtils: RedisUtils
  ) {}
  async create(
    body: NoteReturnType,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      body.user = { id: res.locals.userId } as User;
      const newUser = this.noteRepository.create({ ...body });
      await this.noteRepository.save(newUser);
      //invalidate redis cache
      await this.redisUtils.delete(`${REDIS_NOTES_KEY}:${res.locals.userId}`);
      res.status(200).json({ message: "notes created successfully." });
    } catch (ex) {
      logger.error("exception: ", ex);
      next(this.customError.createError("No record found.", 404));
    }
  }
  async getAll(res: Response, next: NextFunction): Promise<Note> {
    try {
      const { userId } = res.locals;
      const redisKey = `${REDIS_NOTES_KEY}:${userId}`;
      logger.info("res.local: ", res.locals);
      // first check in redis cache
      const noteCache: string = await this.redisUtils.get(redisKey);
      let note: Note[] = [];
      if (noteCache == null || noteCache.length == 0) {
        note = await this.noteRepository.find({
          where: { user: { id: userId } },
          // relations: ["user"],
        });
        //set the cache
        await this.redisUtils.set(redisKey, JSON.stringify(note));
      } else {
        logger.info("getting notes from cache.");
        note = JSON.parse(noteCache);
      }

      if (!note) {
        next(this.customError.createError("No record found.", 404));
        return;
      }

      res.status(200).json({ note });
    } catch (error) {
      next(this.customError.createError("Notes not found.", 404));
    }
  }
  async getByNoteId(noteId: string, res: Response, next: NextFunction) {
    try {
      const userWhere = { id: res.locals.userId } as User;
      const note = await this.noteRepository.findOne({
        where: {
          id: parseInt(noteId),
          user: userWhere,
        } as FindOptionsWhere<Note>,
      });

      if (!note) {
        // Return null or throw an exception indicating that the note was not found
        next(this.customError.createError("No record found.", 404));
        return;
      }

      res.status(200).json({ note });
    } catch (ex) {
      logger.error("exception: ", ex);
      next(this.customError.createError("No record found.", 404));
    }
  }
  async update(
    noteId: string,
    body: Note,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userWhere = { id: res.locals.userId } as User;
      const existingNote = await this.noteRepository.findOne({
        where: {
          id: parseInt(noteId),
          user: userWhere,
        } as FindOptionsWhere<Note>,
      });

      if (!existingNote) {
        // Return null or throw an exception indicating that the note was not found
        next(this.customError.createError("No record found.", 404));
        return;
      }
      const { title, description } = body;
      existingNote.title = title;
      existingNote.description = description;
      await this.noteRepository.save(existingNote);
      //invalidate redis cache
      await this.redisUtils.delete(`${REDIS_NOTES_KEY}:${res.locals.userId}`);
      res.status(200).json({ message: "notes updated successfully." });
    } catch (ex) {
      logger.error("exception: ", ex);
      next(this.customError.createError("No record found.", 404));
    }
  }
  async delete(
    noteId: string,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userWhere = { id: res.locals.userId } as User;
      const existingNote = await this.noteRepository.findOne({
        where: {
          id: parseInt(noteId),
          user: userWhere,
        } as FindOptionsWhere<Note>,
      });

      if (!existingNote) {
        // Return null or throw an exception indicating that the note was not found
        next(this.customError.createError("No record found.", 404));
        return;
      }

      await this.noteRepository.remove(existingNote);
      res.status(200).json({ message: "notes deleted successfully." });
    } catch (ex) {
      logger.error("exception: ", ex);
      next(this.customError.createError("No record found.", 404));
    }
  }
}
