import winston from "winston";
import { TransformableInfo } from "logform";
import DailyRotateFile from "winston-daily-rotate-file";
import { inspect } from "util";

import { env } from "../config/envVariables";

const { format } = winston;
const logFormat = format.printf(
  (info: TransformableInfo) =>
    `${info.timestamp}.${info.level.toUpperCase()}: ${info.message}`
);
const rotator = new DailyRotateFile({
  datePattern: "YYYY-MM-DD",
  dirname: "server/logs",
  filename: "log-%DATE%.log",
  maxFiles: "30d",
  maxSize: "50m",
});

const logger = winston.createLogger({
  exceptionHandlers: [rotator],
  format: format.combine(format.timestamp(), logFormat),
  transports: [rotator],
});

logger.exitOnError = false;

if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export const logObject = (
  level: "info" | "warn" | "error",
  message: string,
  object: Record<string, unknown>
): void => {
  if (level === "info") {
    logger.info(`${message} ${inspect(object, { depth: null })}`);
  } else if (level === "warn") {
    logger.warn(`${message} ${inspect(object, { depth: null })}`);
  } else {
    logger.error(`${message} ${inspect(object, { depth: null })}`);
  }
};

export default logger;
