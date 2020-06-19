import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import {
  NO_EDUCATION,
  INTERNAL_SERVER_ERROR,
} from "../../../config/customErrorMessages";
import { removeEducationFromProfile } from "../../../db/queries";
import logger from "../../../helpers/logger";
import RequestValidator from "../../../helpers/RequestValidator";

/**
 * Delete existing education
 * @param req Request object
 * @param res Response object
 */
const deleteEducation = async (req: Request, res: Response): Promise<any> => {
  // request validation
  const { id } = req.user!;
  const edu_id = req.params.edu_id;
  const validation: ValidationResult = RequestValidator.validateId(edu_id);
  if (validation.error) {
    logger.info(`Attempt to delete education with invalid id ${id}`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    logger.info(`Deleting education for id ${id}...`);
    await removeEducationFromProfile(id!, edu_id);
    logger.info(`User id ${id} has deleted education id: ${edu_id}`);

    logger.info(`Returning success response...`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === NO_EDUCATION) {
      logger.warn(`Could not find education for id ${id}`);
      return res.status(404).json({ message: NO_EDUCATION });
    }

    logger.error(
      `Could not delete education for id ${id}\nError:\n${inspect(error, {
        depth: null,
      })}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteEducation;
