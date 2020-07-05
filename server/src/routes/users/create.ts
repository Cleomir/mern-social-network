import { Request, Response } from "express";
import gravatar from "gravatar";
import { ValidationResult } from "@hapi/joi";

import { insertUser } from "../../database/queries";
import logger, { logObject } from "../../logger";
import IUser from "../../interfaces/IUser";
import {
  INTERNAL_SERVER_ERROR,
  USER_EXISTS,
} from "../../config/customErrorMessages";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Create new user
 * @param req - Request object
 * @param res - Response object
 */
const create = async (req: Request, res: Response): Promise<Response> => {
  // request validation
  const { name, email, password } = req.body;
  const validation: ValidationResult = RequestValidator.validateNewUser(
    name,
    email,
    password
  );
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // get gravatar and save user
    const avatar: string = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const user: IUser = await insertUser(
      {
        name,
        email,
        password,
        avatar,
        date: new Date(),
      },
      req.id
    );

    // server response
    logger.info(`[NODE][${req.id}] Response status 201`);
    return res.status(201).json({
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      date: user.date,
    });
  } catch (error) {
    if (error.message === USER_EXISTS) {
      logger.error(`[NODE][${req.id}] Response status 403`);
      return res.status(403).json({ message: USER_EXISTS });
    }

    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default create;
