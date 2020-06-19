import { Request, Response } from "express";
import { inspect } from "util";

import { NO_PROFILE } from "../../config/customErrorMessages";
import { findProfileByHandle } from "../../db/queries";
import logger from "../../helpers/logger";
import IProfile from "../../interfaces/IProfile";

/**
 * Query profile by handle
 * @param req Request object
 * @param res Response object
 */
const getProfileByHandle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { handle } = req.params;
  logger.info(`Querying profile handle ${handle}...`);
  const profile: IProfile | null = await findProfileByHandle(handle);
  if (!profile) {
    logger.info(`Could not find profile handle ${handle}`);
    return res.status(404).json({ message: NO_PROFILE });
  }

  try {
    logger.info(`Returning success response...`);
    return res.status(200).json(profile);
  } catch (error) {
    logger.error(
      `Could not query profile handle ${handle}\nError:\n${inspect(error, {
        depth: null,
      })}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getProfileByHandle;
