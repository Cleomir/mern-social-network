import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import { INTERNAL_SERVER_ERROR } from "../../../config/customErrorMessages";
import { addEducationToProfile } from "../../../db/queries";
import logger from "../../../logger";
import IEducation from "../../../interfaces/IEducation";
import RequestValidator from "../../../validation/RequestValidator";

/**
 * Add new education
 * @param req Request object
 * @param res Response object
 */
const addEducation = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const education: IEducation[] = req.body.education;
  const validation: ValidationResult = RequestValidator.validateId(id);
  if (validation.error) {
    logger.info(
      `Attempt to add education for id ${id} with invalid fields: ${inspect(
        education,
        { depth: null }
      )}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    logger.info(`Adding education for id ${id}...`);
    await addEducationToProfile(id, education);
    logger.info(
      `User id ${id} has added education with payload: ${inspect(education, {
        depth: null,
      })}`
    );

    logger.info(`Returning success response...`);
    return res.status(200).end();
  } catch (error) {
    logger.error(
      `Could not add education for id ${id}\nError:\n${inspect(error, {
        depth: null,
      })}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default addEducation;
