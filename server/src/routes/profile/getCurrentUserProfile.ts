import { Request, Response } from "express";
import { ErrorObject } from "ajv";

import logger from "../../helpers/logger";
import ProfilesSchema from "../../../json-schemas/profiles.json";
import validateRequest from "../../helpers/validateRequest";
import {
  NO_USER_PROFILE,
  NO_PROFILE,
} from "../../config/custom-error-messages";
import { findProfileById } from "../../db/queries";
import IProfile from "../../interfaces/IProfile";

/**
 * Query user profile
 * @param req - Request object
 * @param res - Response object
 *
 */
const getCurrentUserProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.user!;
    const validationResult:
      | ErrorObject[]
      | null
      | undefined = validateRequest(ProfilesSchema, { get: { user: id } });

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    const profile: IProfile | null = await findProfileById(id!);

    if (!profile) {
      return res.status(404).json({ message: NO_USER_PROFILE });
    }

    return res.status(200).json(profile);
  } catch (error) {
    logger.error("Could not query profile \n", error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getCurrentUserProfile;
