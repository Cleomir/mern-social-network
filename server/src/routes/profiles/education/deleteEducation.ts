import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  NO_EDUCATION,
  INTERNAL_SERVER_ERROR,
  PROFILE_NOT_FOUND,
} from "../../../config/customErrorMessages";
import { removeEducationFromProfile } from "../../../database/queries";
import logger, { logObject } from "../../../logger";
import RequestValidator from "../../../validation/RequestValidator";
import {
  findOneProfile,
  saveOneDocument,
} from "../../../database/dbDirectCalls";

/**
 * Delete existing education
 * @param req Request object
 * @param res Response object
 */
const deleteEducation = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const { edu_id } = req.params;
  const validation: ValidationResult = RequestValidator.validateDeleteEducation(
    id,
    edu_id
  );
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    await removeEducationFromProfile(
      id,
      edu_id,
      findOneProfile,
      saveOneDocument,
      req.id
    );

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === PROFILE_NOT_FOUND || error.message === NO_EDUCATION) {
      logger.error(`[NODE][${req.id}] Response status 404`);
      return res.status(404).json({ message: error.message });
    }

    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteEducation;
