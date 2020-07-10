import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  NO_EXPERIENCE,
  INTERNAL_SERVER_ERROR,
  PROFILE_NOT_FOUND,
} from "../../../config/customErrorMessages";
import { removeExperienceFromProfile } from "../../../database/queries";
import logger, { logObject } from "../../../logger";
import RequestValidator from "../../../validation/RequestValidator";
import {
  findOneProfile,
  saveOneDocument,
} from "../../../database/dbDirectCalls";

/**
 * Delete existing experience
 * @param req Request object
 * @param res Response object
 */
const deleteExperience = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const exp_id = req.params.exp_id;
  const validation: ValidationResult = RequestValidator.validateId(exp_id);
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    await removeExperienceFromProfile(
      id,
      exp_id,
      findOneProfile,
      saveOneDocument,
      req.id
    );

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === PROFILE_NOT_FOUND || NO_EXPERIENCE) {
      logger.info(`[NODE][${req.id}] Response status 404`);
      return res.status(404).json({ message: error.message });
    }

    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteExperience;
