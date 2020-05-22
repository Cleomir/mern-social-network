import { Request, Response } from "express";

import { NO_PROFILE } from "../../config/custom-error-messages";
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
    const profile: IProfile[] | null = await findAllProfiles();

    if (!profile) {
      return res.status(200).json({ message: NO_PROFILE });
    }

    return res.status(200).json(profile);
  } catch (error) {
    logger.error(`${NO_PROFILE}\n`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getAllProfiles;
