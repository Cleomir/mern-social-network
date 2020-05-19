import { Request, Response } from "express";

import {
  UNABLE_TO_REMOVE_EXPERIENCE,
  NO_EXPERIENCE,
} from "../../../config/custom-error-messages";
import logger from "../../../helpers/logger";
import { ErrorObject } from "ajv";
import validateRequest from "../../../helpers/validadteRequest";
import ProfilesSchema from "../../../../json-schemas/profile.json";
import { removeExperienceFromProfile } from "../../../db/queries";

/**
 * Delete existing experience
 * @param req Request object
 * @param res Response object
 */
const deleteExperience = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.user!;
    const exp_id = req.params.exp_id;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      ProfilesSchema,
      {
        delete: { id: exp_id },
      }
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    await removeExperienceFromProfile(id!, exp_id);
    logger.info(`User id ${id} has deleted experience id: ${exp_id}`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === NO_EXPERIENCE) {
      return res.status(404).json({ message: NO_EXPERIENCE });
    }

    logger.error(`${UNABLE_TO_REMOVE_EXPERIENCE}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_REMOVE_EXPERIENCE });
  }
};

export default deleteExperience;
