import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  USER_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/custom-error-messages";
import { removeProfileAndUser } from "../../db/queries";
import logger from "../../helpers/logger";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Delete Profile and User
 * @param req Request object
 * @param res Response object
 */
const deleteProfileAndUser = async (req: Request, res: Response) => {
  try {
    // request validation
    const { id } = req.user!;
    const validation: ValidationResult = RequestValidator.validateId(id);
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    // delete profile and user
    await removeProfileAndUser(id);
    logger.info(`User id ${id} has been deleted`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === USER_NOT_FOUND) {
      return res.status(403).json({ message: USER_NOT_FOUND });
    }

    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteProfileAndUser;
