import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import { NO_PROFILE } from "../../config/customErrorMessages";
import { findProfileById } from "../../db/queries";
import logger, { logObject } from "../../logger";
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
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    const profile: IProfile | null = await findProfileById(user_id, req.id);
    if (!profile) {
      logger.error(`[NODE][${req.id}] Response status 404`);
      return res.status(404).json({ message: NO_PROFILE });
    }

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).json(profile);
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getProfileByUserId;
