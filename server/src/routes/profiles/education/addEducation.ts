import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import { INTERNAL_SERVER_ERROR } from "../../../config/customErrorMessages";
import { addEducationToProfile } from "../../../database/queries";
import logger, { logObject } from "../../../logger";
import RequestValidator from "../../../validation/RequestValidator";
import {
  findOneProfile,
  saveOneDocument,
} from "../../../database/dbDirectCalls";

/**
 * Add new education
 * @param req Request object
 * @param res Response object
 */
const addEducation = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const { education } = req.body;
  const validation: ValidationResult = RequestValidator.validateAddEducation(
    id,
    education
  );
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    await addEducationToProfile(
      id,
      education,
      findOneProfile,
      saveOneDocument,
      req.id
    );

    logger.info(`[NODE][${req.id}] Response status 201`);
    return res.status(201).end();
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default addEducation;
