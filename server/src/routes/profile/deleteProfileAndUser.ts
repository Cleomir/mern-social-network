import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  USER_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { removeProfileAndUser } from "../../db/queries";
import logger from "../../logger";
import RequestValidator from "../../validation/RequestValidator";
import { inspect } from "util";

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
    logger.warn(`Attempt to delete profile with invalid id: ${id}`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // delete profile and user
    logger.info(`Deleting user ${id} and his profile...`);
    await removeProfileAndUser(id);
    logger.info(`User id ${id} and his profile have been deleted`);

    logger.info(`Returning success response...`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === USER_NOT_FOUND) {
      logger.warn(`Attempt to delete inexistent user with id ${id}`);
      return res.status(403).json({ message: USER_NOT_FOUND });
    }

    logger.error(
      `Could not delete user id ${id}\nError:\n${inspect(error, {
        depth: null,
      })}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteProfileAndUser;
