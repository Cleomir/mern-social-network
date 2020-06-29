import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import logger, { logObject } from "../logger";

const requestLogger = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // check if request has an id or create one
    const requestId: string | undefined = req.get("X-Request-ID");
    req.id = requestId ? requestId : uuidv4();

    // log request data
    const { protocol, headers, method, body, originalUrl } = req;
    logger.info(
      `[NODE][${req.id}] Request URL: ${method} ${protocol}://${req.get(
        "host"
      )}${originalUrl}`
    );
    logObject("info", `[NODE][${req.id}] Request headers:`, headers);
    logObject("info", `[NODE][${req.id}] Request body:`, body);

    next();
  };
};

export default requestLogger;
