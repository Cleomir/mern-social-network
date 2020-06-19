import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import { NO_PROFILE, NO_USER_PROFILE } from "../../config/customErrorMessages";
import { findProfileById } from "../../db/queries";
import logger from "../../helpers/logger";
import IProfile from "../../interfaces/IProfile";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Query user profile
 * @param req - Request object
 * @param res - Response object
 *
 */
const getCurrentUserProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // request validation
  const { id } = req.user!;
  const validation: ValidationResult = RequestValidator.validateId(id);
  if (validation.error) {
    logger.warn(`Attempt to query profile with invalid id ${id}`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    logger.info(`Querying user with profile ${id}...`);
    const profile: IProfile | null = await findProfileById(id!);
    if (!profile) {
      logger.info(`User profile with id ${id} not found`);
      return res.status(404).json({ message: NO_USER_PROFILE });
    }

    logger.info(`Returning success response...`);
    return res.status(200).json(profile);
  } catch (error) {
    logger.error(
      `Could not query user profile with id ${id}\n${inspect(error, {
        depth: null,
      })}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getCurrentUserProfile;
