import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  PROFILE_EXISTS,
  PROFILE_HANDLE_EXISTS,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { insertProfile } from "../../database/queries";
import logger, { logObject } from "../../logger";
import IProfile from "../../interfaces/IProfile";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Query user profile
 * @param req - Request object
 * @param res - Response object
 */
const createProfile = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  const profile: IProfile = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // save profile
    await insertProfile(profile, req.id);

    logger.info(`[NODE][${req.id}] Response status 201`);
    return res.status(201).end();
  } catch (error) {
    if (
      error.message === PROFILE_EXISTS ||
      error.message === PROFILE_HANDLE_EXISTS
    ) {
      logger.error(`[NODE][${req.id}] Response status 403`);
      return res.status(403).json({ message: error.message });
    }

    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default createProfile;
