import { NextFunction, Request, Response } from "express";
import { inspect } from "util";

import logger from "../helpers/logger";

const requestLogger = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { protocol, headers, method, body, originalUrl } = req;
    const inspectOptions = { depth: null };

    logger.info(
      `Request URL: ${method} ${protocol}://${req.get("host")}${originalUrl}`
    );
    logger.info(`Request headers: ${inspect(headers, inspectOptions)}`);
    logger.info(`Request body: ${inspect(body, inspectOptions)}`);

    next();
  };
};

export default requestLogger;
