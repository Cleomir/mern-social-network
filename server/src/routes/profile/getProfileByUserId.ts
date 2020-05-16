import { Request, Response } from "express";
import { ErrorObject } from "ajv";

import IProfile from "../../interfaces/IProfile";
import { findProfileById } from "../../db/queries";
import { NO_PROFILE } from "../../config/custom-error-messages";
import logger from "../../helpers/logger";
import validateRequest from "../../helpers/validadteRequest";
import ProfilesSchema from "../../../json-schemas/profile.json";

/**
 * Query profile by user ID
 * @param req Request object
 * @param res Response object
 */
const getProfileByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_id } = req.params;
    const validationResult:
      | ErrorObject[]
      | null
      | undefined = validateRequest(ProfilesSchema, { get: { user: user_id } });

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }
    const profile: IProfile | null = await findProfileById(user_id);

    if (!profile) {
      return res.status(404).json({ message: NO_PROFILE });
    }

    return res.status(200).json(profile);
  } catch (error) {
    logger.error(`${NO_PROFILE}\n`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getProfileByUserId;
