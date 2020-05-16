import { Request, Response } from "express";

import IProfile from "../../interfaces/IProfile";
import { findProfileByHandle } from "../../db/queries";
import { NO_PROFILE } from "../../config/custom-error-messages";
import logger from "../../helpers/logger";

/**
 * Query profile by handle
 * @param req Request object
 * @param res Response object
 */
const getProfileByHandle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { handle } = req.params;
    const profile: IProfile | null = await findProfileByHandle(handle);

    if (!profile) {
      return res.status(404).json({ message: NO_PROFILE });
    }

    return res.status(200).json(profile);
  } catch (error) {
    logger.error(`${NO_PROFILE}\n`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getProfileByHandle;
