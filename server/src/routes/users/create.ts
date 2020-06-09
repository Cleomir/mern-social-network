import { Request, Response } from "express";
import gravatar from "gravatar";

import { insertUser } from "../../db/queries";
import logger from "../../helpers/logger";
import IUser from "../../interfaces/IUser";
import { INTERNAL_SERVER_ERROR } from "../../config/custom-error-messages";
import RequestValidator from "../../helpers/RequestValidator";
import { ValidationResult } from "@hapi/joi";

/**
 * Create new user
 * @param req - Request object
 * @param res - Response object
 * @returns The response of the request
 */
const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    // request validation
    const { name, email, password } = req.body;
    const validation: ValidationResult = RequestValidator.validateNewUser(
      name,
      email,
      password
    );
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    // get avatar and save user
    const avatar: string = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const user: IUser = ((await insertUser({
      name,
      email,
      password,
      avatar,
      date: new Date(),
    })) as unknown) as IUser;
    if (!user) {
      return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }

    // server response
    return res.status(201).json({
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      date: user.date,
    });
  } catch (error) {
    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default create;
