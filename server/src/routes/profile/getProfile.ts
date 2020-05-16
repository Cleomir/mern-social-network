import { Request, Response } from "express";
import Ajv from "ajv";

import logger from "../../helpers/logger";
import ProfilesSchema from "../../../json-schemas/profile.json";
import validateRequest from "../../helpers/validadteRequest";
import IUser from "../../interfaces/IUser";
import { NO_USER_PROFILE } from "../../config/custom-error-messages";
import { findProfileById } from "../../db/queries";
import IProfile from "../../interfaces/IProfile";

/**
 * Query user profile
 * @param req - Request object
 * @param res - Response object
 *
 */
const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as IUser;

    const validationResult:
      | Ajv.ErrorObject[]
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
    return res.status(500).json({ message: "Could not find profile" });
  }
};

export default getProfile;
