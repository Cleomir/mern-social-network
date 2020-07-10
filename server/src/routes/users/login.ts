import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import { comparePassword } from "../../authentication/password";
import IUser from "../../interfaces/IUser";
import logger, { logObject } from "../../logger";
import { signJWT } from "../../authentication/jwt";
import IJwtPayload from "../../interfaces/IJwtPayload";
import {
  USER_NOT_FOUND,
  INVALID_CREDENTIALS,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import RequestValidator from "../../validation/RequestValidator";
import { findOneUser } from "../../database/dbDirectCalls";

/**
 * User login
 * @param req Request
 * @param res Response
 */
const login = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  // request validation
  const { email, password } = req.body;
  const validation: ValidationResult = RequestValidator.validateLogin(
    email,
    password
  );
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // check if password match
    const existingUser: IUser | undefined = await findOneUser(
      { email },
      req.id
    );
    if (!existingUser) {
      logger.error(`[NODE][${req.id}] Response status 404`);
      return res.status(404).json({ message: USER_NOT_FOUND });
    }
    const isMatch = await comparePassword(
      password,
      existingUser.password,
      req.id
    );
    if (!isMatch) {
      logger.error(`[NODE][${req.id}] Response status 400`);
      return res.status(400).json({ message: INVALID_CREDENTIALS });
    }

    // generate jwt
    const payload: IJwtPayload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      avatar: existingUser.avatar,
    };
    const token: string = signJWT(payload, req.id);

    // server response
    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).json({ token });
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default login;
