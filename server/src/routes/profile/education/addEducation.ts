import { Request, Response } from "express";

import { UNABLE_TO_ADD_EDUCATION } from "../../../config/custom-error-messages";
import logger from "../../../helpers/logger";
import { ErrorObject } from "ajv";
import validateRequest from "../../../helpers/validadteRequest";
import ProfilesSchema from "../../../../json-schemas/profile.json";
import { addEducationToProfile } from "../../../db/queries";
import IEducation from "../../../interfaces/IEducation";

/**
 * Add new education
 * @param req Request object
 * @param res Response object
 */
const addEducation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.user!;
    const education: IEducation[] = req.body.education;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      ProfilesSchema,
      {
        education: { user: id, education },
      }
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    await addEducationToProfile(id!, education);
    logger.info(`User id ${id} has added a new education`, education);

    return res.status(200).end();
  } catch (error) {
    logger.error(`${UNABLE_TO_ADD_EDUCATION}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_ADD_EDUCATION });
  }
};

export default addEducation;
