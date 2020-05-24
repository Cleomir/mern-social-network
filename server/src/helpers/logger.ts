import winston from "winston";
import { TransformableInfo } from "logform";
import DailyRotateFile from "winston-daily-rotate-file";

import { ENVIRONMENT } from "../config/env-variables";

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

if (ENVIRONMENT !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
