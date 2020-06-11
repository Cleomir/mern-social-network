import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  PROFILE_EXISTS,
  PROFILE_HANDLE_EXISTS,
  INTERNAL_SERVER_ERROR,
} from "../../config/custom-error-messages";
import { insertProfile } from "../../db/queries";
import logger from "../../helpers/logger";
import IProfile from "../../interfaces/IProfile";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Query user profile
 * @param req - Request object
 * @param res - Response object
 */
const createProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
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
    const validation: ValidationResult = RequestValidator.validateCreateProfile(
      profile
    );
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    // save profile
    await insertProfile(profile);
    logger.info(`Profile created for user ${profile.user}`);

    return res.status(201).end();
  } catch (error) {
    if (error.message === PROFILE_EXISTS) {
      return res.status(403).json({ message: PROFILE_EXISTS });
    } else if (error.message === PROFILE_HANDLE_EXISTS) {
      return res.status(403).json({ message: PROFILE_HANDLE_EXISTS });
    }

    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default createProfile;
