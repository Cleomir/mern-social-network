import { Request, Response } from "express";
import gravatar from "gravatar";
import { ValidationResult } from "@hapi/joi";

import { insertUser } from "../../db/queries";
import logger from "../../helpers/logger";
import IUser from "../../interfaces/IUser";
import {
  INTERNAL_SERVER_ERROR,
  USER_EXISTS,
} from "../../config/custom-error-messages";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Create new user
 * @param req - Request object
 * @param res - Response object
 * @returns The response of the request
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
    logger.warn(
      `Request with invalid parameters: name: ${name}, email: ${email}, password: ${password}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // get gravatar and save user
    logger.info(`Saving user ${name} with email ${email} into database...`);
    const avatar: string = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const user: IUser | undefined = await insertUser({
      name,
      email,
      password,
      avatar,
      date: new Date(),
    });
    logger.info(`User with ${email} saved successfully.`);

    // server response
    logger.info(`Returning success response for email ${email}`);
    return res.status(201).json({
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      date: user.date,
    });
  } catch (error) {
    if (error === USER_EXISTS) {
      logger.info(`Email ${email} already exists`);
      return res.status(403).json({ message: USER_EXISTS });
    }

    logger.error(
      `Could not create user ${name} with email ${email}.\nError:\n`,
      error
    );
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default create;
