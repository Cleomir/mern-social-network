import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  NO_EXPERIENCE,
  INTERNAL_SERVER_ERROR,
} from "../../../config/customErrorMessages";
import { removeExperienceFromProfile } from "../../../db/queries";
import logger from "../../../helpers/logger";
import RequestValidator from "../../../helpers/RequestValidator";
import { inspect } from "util";

/**
 * Delete existing experience
 * @param req Request object
 * @param res Response object
 */
const deleteExperience = async (req: Request, res: Response): Promise<any> => {
  // request validation
  const { id } = req.user!;
  const exp_id = req.params.exp_id;
  const validation: ValidationResult = RequestValidator.validateId(exp_id);
  if (validation.error) {
    logger.warn(`Attempt to delete experience with invalid id ${id}`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    logger.info(`Deleting experience for id ${id}...`);
    await removeExperienceFromProfile(id!, exp_id);
    logger.info(`User id ${id} has deleted experience id: ${exp_id}`);

    logger.info(`Returning success response...`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === NO_EXPERIENCE) {
      return res.status(404).json({ message: NO_EXPERIENCE });
    }

    logger.error(
      `Could not delete experience for id ${id}\nError:\n${inspect(error, {
        depth: null,
      })}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteExperience;
