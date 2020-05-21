import { Request, Response } from "express";

import { UNABLE_TO_ADD_EXPERIENCE } from "../../../config/custom-error-messages";
import logger from "../../../helpers/logger";
import { ErrorObject } from "ajv";
import validateRequest from "../../../helpers/validateRequest";
import ProfilesSchema from "../../../../json-schemas/profiles.json";
import { addExperienceToProfile } from "../../../db/queries";
import IExperience from "../../../interfaces/IExperience";

/**
 * Add new experiences
 * @param req Request object
 * @param res Response object
 */
const addExperience = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.user!;
    const experience: IExperience[] = req.body.experience;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      ProfilesSchema,
      {
        experience: { user: id, experience },
      }
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    await addExperienceToProfile(id!, experience);
    logger.info(`User id ${id} has added a new experience`, experience);

    return res.status(200).end();
  } catch (error) {
    logger.error(`${UNABLE_TO_ADD_EXPERIENCE}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_ADD_EXPERIENCE });
  }
};

export default addExperience;
