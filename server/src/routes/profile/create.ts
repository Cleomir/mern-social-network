import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import {
  PROFILE_EXISTS,
  PROFILE_HANDLE_EXISTS,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { insertProfile } from "../../db/queries";
import logger from "../../logger";
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
    logger.warn(
      `Attempt to create profile with invalid parameters: ${inspect(profile, {
        depth: null,
      })}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // save profile
    logger.info(`Creating profile for user id : ${profile.user}...`);
    await insertProfile(profile);
    logger.info(`Profile created for user ${profile.user}`);

    logger.info(`Returning success response for user id: ${profile.user}`);
    return res.status(201).end();
  } catch (error) {
    if (error.message === PROFILE_EXISTS) {
      logger.info(`Profile for user ${profile.user} already exists`);
      return res.status(403).json({ message: PROFILE_EXISTS });
    } else if (error.message === PROFILE_HANDLE_EXISTS) {
      logger.info(`Profile handle for user ${profile.handle} already exists`);
      return res.status(403).json({ message: PROFILE_HANDLE_EXISTS });
    }

    logger.error(
      `Could not create profile for user id ${
        profile.user
      }.\nError:\n${inspect(error, { depth: null })}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default createProfile;
