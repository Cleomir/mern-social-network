import { Request, Response } from "express";

import {
  NO_PROFILE,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { findAllProfiles } from "../../database/dbDirectCalls";
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
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default getAllProfiles;
