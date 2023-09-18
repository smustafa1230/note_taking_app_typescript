import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import logger from "../../logger";
import { LOGLEVEL } from "../../logger";
import { SECRET_KEY } from "@/config";

const pathExcludedFromTokenVerification = [
  "/",
  "/ping",
  "/api/login",
  "/api/user",
];

export default async function tokenVerificationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // if token verification needed
  if (pathExcludedFromTokenVerification.indexOf(req.path) === -1) {
    try {
      const headers = req.headers;
      const authHeader = headers.authorization;
      if (!authHeader) {
        throw new Error("No auth header");
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new Error("No auth token");
      }

      // save token for downstream use
      res.locals.token = token;

      const decoded = jwt.decode(token, { json: true });
      if (!decoded) {
        throw new Error("Token decoded on verification is null");
      }

      // secret key can be fetched through AWS secret manager
      jwt.verify(token, SECRET_KEY);

      // save userId for downstream use
      res.locals.userId = decoded.userId;

      res.locals.tokenVerified = true;
    } catch (e) {
      const appSessionId = req.header("x-app-session-id");
      const requestId = req.header("x-request-id");
      const userId = res.locals.userId;

      logger.log({
        level: LOGLEVEL.ERROR,
        path: req.path,
        message: "Failed token verification: " + e.message,
        requestId,
        appSessionId,
        userId,
      });
      return res.sendStatus(401);
    }
  }

  return next();
}
