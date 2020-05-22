import { ErrorObject } from "ajv";
import { Request, Response } from "express";

import ProfilesSchema from "../../../../json-schemas/profiles.json";
import {
  NO_EDUCATION,
  UNABLE_TO_REMOVE_EDUCATION,
} from "../../../config/custom-error-messages";
import { removeEducationFromProfile } from "../../../db/queries";
import logger from "../../../helpers/logger";
import validateRequest from "../../../helpers/validateRequest";

/**
 * Delete existing education
 * @param req Request object
 * @param res Response object
 */
const deleteEducation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.user!;
    const edu_id = req.params.edu_id;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      ProfilesSchema,
      {
        delete: { id: edu_id },
      }
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    await removeEducationFromProfile(id!, edu_id);
    logger.info(`User id ${id} has deleted education id: ${edu_id}`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === NO_EDUCATION) {
      return res.status(404).json({ message: NO_EDUCATION });
    }

    logger.error(`${UNABLE_TO_REMOVE_EDUCATION}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_REMOVE_EDUCATION });
  }
};

export default deleteEducation;
