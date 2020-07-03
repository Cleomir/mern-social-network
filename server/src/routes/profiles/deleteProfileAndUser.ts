import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  USER_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  PROFILE_NOT_FOUND,
} from "../../config/customErrorMessages";
import { removeProfileAndUser } from "../../db/queries";
import logger, { logObject } from "../../logger";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Delete Profile and User
 * @param req Request object
 * @param res Response object
 */
const deleteProfileAndUser = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const validation: ValidationResult = RequestValidator.validateId(id);
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // delete profile and user
    await removeProfileAndUser(id, req.id);

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === USER_NOT_FOUND || PROFILE_NOT_FOUND) {
      logger.error(`[NODE][${req.id}] Response status 403`);
      return res.status(403).json({ message: error.message });
    }

    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteProfileAndUser;
