import { Request, Response } from "express";
import { ErrorObject } from "ajv";

import { findUserByEmail } from "../../db/queries";
import comparePassword from "../../helpers/comparePassword";
import IUser from "../../interfaces/IUser";
import logger from "../../helpers/logger";
import signJwtToken from "../../helpers/signJwtToken";
import IJwtPayload from "../../interfaces/IJwtPayload";
import UsersSchema from "../../../json-schemas/users.json";
import validateRequest from "../../helpers/validadteRequest";
import {
  USER_NOT_FOUND,
  INVALID_CREDENTIALS,
  UNABLE_TO_LOGIN,
} from "../../config/custom-error-messages";

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
  try {
    const { email, password } = req.body;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      UsersSchema,
      {
        login: { email, password },
      }
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    const existingUser: IUser | null = await findUserByEmail(email);

    // check if user exists
    if (!existingUser) {
      return res.status(404).json({ message: USER_NOT_FOUND });
    }

    // check if password match
    const isMatch = await comparePassword(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: INVALID_CREDENTIALS });
    }

    // generate jwt
    const payload: IJwtPayload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      avatar: existingUser.avatar,
    };
    const token: string = signJwtToken(payload);

    return res.status(200).json({ token });
  } catch (error) {
    logger.error(`${UNABLE_TO_LOGIN}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_LOGIN });
  }
};

export default login;
