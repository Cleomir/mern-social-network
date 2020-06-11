import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  NO_PROFILE,
  NO_USER_PROFILE,
} from "../../config/custom-error-messages";
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
  try {
    // request validation
    const { id } = req.user!;
    const validation: ValidationResult = RequestValidator.validateId(id);
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    const profile: IProfile | null = await findProfileById(id!);
    if (!profile) {
      return res.status(404).json({ message: NO_USER_PROFILE });
    }

    return res.status(200).json(profile);
  } catch (error) {
    logger.error(`${NO_PROFILE}\n`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getCurrentUserProfile;
