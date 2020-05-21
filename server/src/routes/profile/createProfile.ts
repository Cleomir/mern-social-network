import { Request, Response } from "express";
import { ErrorObject } from "ajv";

import logger from "../../helpers/logger";
import ProfilesSchema from "../../../json-schemas/profiles.json";
import validateRequest from "../../helpers/validateRequest";
import { insertProfile } from "../../db/queries";
import IProfile from "../../interfaces/IProfile";
import {
  PROFILE_EXISTS,
  PROFILE_HANDLE_EXISTS,
} from "../../config/custom-error-messages";

/**
 * Query user profile
 * @param req - Request object
 * @param res - Response object
 */
const createProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    // extract request params
    const profile: IProfile = {
      user: req.user!.id,
      handle: req.body.handle,
      company: req.body.company,
      website: req.body.website,
      location: req.body.location,
      status: req.body.status,
      skills: req.body.skills,
      bio: req.body.bio,
      github_username: req.body.github_username,
      experience: req.body.experience,
      education: req.body.education,
      social: req.body.social,
    };
    const validationResult:
      | ErrorObject[]
      | null
      | undefined = validateRequest(ProfilesSchema, { create: { ...profile } });

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    await insertProfile(profile);
    logger.info(`Profile created for user ${profile.user}`);

    return res.status(201).end();
  } catch (error) {
    logger.error("Could not create profile \n", error);

    if (error.message === PROFILE_EXISTS) {
      return res.status(403).json({ message: PROFILE_EXISTS });
    } else if (error.message === PROFILE_HANDLE_EXISTS) {
      return res.status(403).json({ message: PROFILE_HANDLE_EXISTS });
    }

    return res.status(500).json({ message: "Could not create profile" });
  }
};

export default createProfile;
