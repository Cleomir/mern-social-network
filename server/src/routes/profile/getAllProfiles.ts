import { Request, Response } from "express";
import { inspect } from "util";

import { NO_PROFILE } from "../../config/customErrorMessages";
import { findAllProfiles } from "../../db/queries";
import logger from "../../helpers/logger";
import IProfile from "../../interfaces/IProfile";

/**
 * Query all profiles
 * @param req Request object
 * @param res Response object
 */
const getAllProfiles = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    logger.info(`Querying all profiles...`);
    const profile: IProfile[] | null = await findAllProfiles();
    if (!profile) {
      logger.error(`No profile found.`);
      return res.status(204).json({ message: NO_PROFILE });
    }

    logger.info(`Returning success response...`);
    return res.status(200).json(profile);
  } catch (error) {
    logger.error(`${NO_PROFILE}\n${inspect(error, { depth: null })}`);
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getAllProfiles;
