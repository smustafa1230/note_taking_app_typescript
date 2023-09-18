import { Service } from "typedi";

@Service()
export class CustomError extends Error {
  status: number;
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500; // Default to 500 Internal Server Error
    Error.captureStackTrace(this, this.constructor);
  }
  createError(message: string, status: number = 500): CustomError {
    return new CustomError(message, status);
  }
}
