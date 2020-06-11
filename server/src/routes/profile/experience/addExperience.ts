import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import { INTERNAL_SERVER_ERROR } from "../../../config/custom-error-messages";
import { addExperienceToProfile } from "../../../db/queries";
import logger from "../../../helpers/logger";
import IExperience from "../../../interfaces/IExperience";
import RequestValidator from "../../../helpers/RequestValidator";

/**
 * Add new experiences
 * @param req Request object
 * @param res Response object
 */
const addExperience = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
    const { id } = req.user!;
    const experience: IExperience[] = req.body.experience;
    const validation: ValidationResult = RequestValidator.validateId(id);
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    await addExperienceToProfile(id!, experience);
    logger.info(`User id ${id} has added a new experience`, experience);

    return res.status(200).end();
  } catch (error) {
    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default addExperience;
