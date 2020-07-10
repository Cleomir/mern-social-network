import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import { NO_PROFILE, NO_USER_PROFILE } from "../../config/customErrorMessages";
import logger, { logObject } from "../../logger";
import IProfile from "../../interfaces/IProfile";
import RequestValidator from "../../validation/RequestValidator";
import { findOneProfile } from "../../database/dbDirectCalls";

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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const validation: ValidationResult = RequestValidator.validateId(id);
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    const profile: IProfile | undefined = await findOneProfile({ id }, req.id);
    if (!profile) {
      logger.error(`[NODE][${req.id}] Response status 404`);
      return res.status(404).json({ message: NO_USER_PROFILE });
    }

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).json(profile);
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getCurrentUserProfile;
