import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import { INTERNAL_SERVER_ERROR } from "../../../config/custom-error-messages";
import { addEducationToProfile } from "../../../db/queries";
import logger from "../../../helpers/logger";
import IEducation from "../../../interfaces/IEducation";
import RequestValidator from "../../../helpers/RequestValidator";

/**
 * Add new education
 * @param req Request object
 * @param res Response object
 */
const addEducation = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
    const { id } = req.user!;
    const education: IEducation[] = req.body.education;
    const validation: ValidationResult = RequestValidator.validateId(id);
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    await addEducationToProfile(id!, education);
    logger.info(`User id ${id} has added a new education`, education);

    return res.status(200).end();
  } catch (error) {
    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default addEducation;
