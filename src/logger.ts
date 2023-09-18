import { createLogger, format, transports } from "winston";

// https://github.com/winstonjs/winston#logging-levels
export enum LOGLEVEL {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

const logger = createLogger({
  level: LOGLEVEL.INFO,
  transports: [
    new transports.Console({
      format: format.json(),
    }),
  ],
});

export default logger;
