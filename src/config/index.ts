import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
console.log("NODE_ENV: ", process.env.NODE_ENV);
export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  CM_BASE_URL,
  BANKINGMOBILE_URL,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;
export const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } =
  process.env;
