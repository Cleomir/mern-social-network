import { Request, Response } from "express";
import gravatar from "gravatar";
import { ErrorObject } from "ajv";

import { insertUser } from "../../db/queries";
import logger from "../../helpers/logger";
import IUser from "../../interfaces/IUser";
import UsersSchema from "../../../json-schemas/users.json";
import validateRequest from "../../helpers/validateRequest";
import { USER_NOT_SAVED } from "../../config/custom-error-messages";

/**
 * Create new user
 * @param req - Request object
 * @param res - Response object
 * @returns The response of the request
 */
const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      UsersSchema,
      {
        user: { name, email, password },
      }
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

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
      return res.status(500).json({ message: USER_NOT_SAVED });
    }

    return res.status(201).json({
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      date: user.date,
    });
  } catch (error) {
    logger.error(`${USER_NOT_SAVED}\n`, error);
    return res.status(500).json({ message: USER_NOT_SAVED });
  }
};

export default create;
