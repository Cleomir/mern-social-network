import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import { NO_PROFILE } from "../../config/custom-error-messages";
import { findProfileById } from "../../db/queries";
import logger from "../../helpers/logger";
import IProfile from "../../interfaces/IProfile";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Query profile by user ID
 * @param req Request object
 * @param res Response object
 */
const getProfileByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // request validation
    const { user_id } = req.params;
    const validation: ValidationResult = RequestValidator.validateId(user_id);
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    const profile: IProfile | null = await findProfileById(user_id);
    if (!profile) {
      return res.status(404).json({ message: NO_PROFILE });
    }

    return res.status(200).json(profile);
  } catch (error) {
    logger.error(`${NO_PROFILE}\n`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getProfileByUserId;
