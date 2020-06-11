import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  NO_EXPERIENCE,
  INTERNAL_SERVER_ERROR,
} from "../../../config/custom-error-messages";
import { removeExperienceFromProfile } from "../../../db/queries";
import logger from "../../../helpers/logger";
import RequestValidator from "../../../helpers/RequestValidator";

/**
 * Delete existing experience
 * @param req Request object
 * @param res Response object
 */
const deleteExperience = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
    const { id } = req.user!;
    const exp_id = req.params.exp_id;
    const validation: ValidationResult = RequestValidator.validateId(exp_id);
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    await removeExperienceFromProfile(id!, exp_id);
    logger.info(`User id ${id} has deleted experience id: ${exp_id}`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === NO_EXPERIENCE) {
      return res.status(404).json({ message: NO_EXPERIENCE });
    }

    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteExperience;
