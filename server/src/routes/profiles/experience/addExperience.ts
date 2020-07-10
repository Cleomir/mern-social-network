import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  INTERNAL_SERVER_ERROR,
  PROFILE_NOT_FOUND,
} from "../../../config/customErrorMessages";
import { addExperienceToProfile } from "../../../database/queries";
import logger, { logObject } from "../../../logger";
import RequestValidator from "../../../validation/RequestValidator";
import {
  findOneProfile,
  saveOneDocument,
} from "../../../database/dbDirectCalls";

/**
 * Add new experiences
 * @param req Request object
 * @param res Response object
 */
const addExperience = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const { experience } = req.body;
  const validation: ValidationResult = RequestValidator.validateId(id);
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    await addExperienceToProfile(
      id,
      experience,
      findOneProfile,
      saveOneDocument,
      req.id
    );

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === PROFILE_NOT_FOUND) {
      logger.error(`[NODE][${req.id}] Response status 404`);
    }
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default addExperience;
