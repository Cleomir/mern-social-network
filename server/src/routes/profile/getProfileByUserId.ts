import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import { NO_PROFILE } from "../../config/customErrorMessages";
import { findProfileById } from "../../db/queries";
import logger from "../../logger";
import IProfile from "../../interfaces/IProfile";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Query profile by user ID
 * @param req Request object
 * @param res Response object
 */
const getProfileByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // request validation
  const { user_id } = req.params;
  const validation: ValidationResult = RequestValidator.validateId(user_id);
  if (validation.error) {
    logger.warn(`Attempt to query profile with invalid user id ${user_id}`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    logger.info(`Querying profile with user id ${user_id}...`);
    const profile: IProfile | null = await findProfileById(user_id);
    if (!profile) {
      logger.warn(`User id ${user_id} not found`);
      return res.status(404).json({ message: NO_PROFILE });
    }

    logger.info(`Returning success response...`);
    return res.status(200).json(profile);
  } catch (error) {
    logger.error(
      `Could not query profile with user id ${user_id}\nError:\n${inspect(
        error,
        { depth: null }
      )}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getProfileByUserId;
