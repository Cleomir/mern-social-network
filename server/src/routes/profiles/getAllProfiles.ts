import { Request, Response } from "express";

import { NO_PROFILE } from "../../config/customErrorMessages";
import { findAllProfiles } from "../../db/queries";
import logger, { logObject } from "../../logger";
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
    const profile: IProfile[] | undefined = await findAllProfiles(req.id);
    if (!profile) {
      logger.warn(`[NODE][${req.id}] Response status 204`);
      return res.status(204).json({ message: NO_PROFILE });
    }

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).json(profile);
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getAllProfiles;
