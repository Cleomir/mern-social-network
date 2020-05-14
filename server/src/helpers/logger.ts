import winston from "winston";

import { ENVIRONMENT } from "../config";

/**
 * Define logs configuration
 */
const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "./server/logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./server/logs/combined.log" }),
  ],
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
