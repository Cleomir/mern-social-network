import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import { findUserByEmail } from "../../db/queries";
import comparePassword from "../../helpers/comparePassword";
import IUser from "../../interfaces/IUser";
import logger from "../../helpers/logger";
import signJwtToken from "../../helpers/signJwtToken";
import IJwtPayload from "../../interfaces/IJwtPayload";
import {
  USER_NOT_FOUND,
  INVALID_CREDENTIALS,
  INTERNAL_SERVER_ERROR,
} from "../../config/custom-error-messages";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * User login
 * @param req Request
 * @param res Response
 * @returns jwt token
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
    logger.warn(`Login attempt with invalid parameters for email ${email}`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // check if user exists
    const existingUser: IUser | null = await findUserByEmail(email);
    if (!existingUser) {
      logger.warn(
        `Login attempt for email that does not exist. Email: ${email}`
      );
      return res.status(404).json({ message: USER_NOT_FOUND });
    }

    // check if password match
    const isMatch = await comparePassword(password, existingUser.password);
    if (!isMatch) {
      logger.warn(`Login attempt with invalid parameters for email ${email}`);
      return res.status(400).json({ message: INVALID_CREDENTIALS });
    }

    // generate jwt
    logger.info(`Generating JWT for email ${email}...`);
    const payload: IJwtPayload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      avatar: existingUser.avatar,
    };
    const token: string = signJwtToken(payload);
    logger.info(`JWT generated successfully for email ${email}`);

    // server response
    logger.info(`Returning success response for email ${email}`);
    return res.status(200).json({ token });
  } catch (error) {
    logger.error(
      `Could not login with email ${email}\nError:\n${inspect(error, {
        depth: null,
      })}`
    );
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default login;
