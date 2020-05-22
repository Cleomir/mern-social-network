import { ErrorObject } from "ajv";
import { Request, Response } from "express";

import ProfilesSchema from "../../../json-schemas/profiles.json";
import {
  UNABLE_TO_REMOVE_PROFILE,
  USER_NOT_FOUND,
} from "../../config/custom-error-messages";
import { removeProfileAndUser } from "../../db/queries";
import logger from "../../helpers/logger";
import validateRequest from "../../helpers/validateRequest";

/**
 * Delete Profile and User
 * @param req Request object
 * @param res Response object
 */
const deleteProfileAndUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.user!;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      ProfilesSchema,
      {
        delete: { id },
      }
    );
    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    await removeProfileAndUser(id);
    logger.info(`User id ${id} has been deleted`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === USER_NOT_FOUND) {
      return res.status(403).json({ message: USER_NOT_FOUND });
    }
    logger.error(`${UNABLE_TO_REMOVE_PROFILE}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_REMOVE_PROFILE });
  }
};

export default deleteProfileAndUser;
