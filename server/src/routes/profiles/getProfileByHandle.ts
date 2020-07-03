import { Request, Response } from "express";

import { NO_PROFILE } from "../../config/customErrorMessages";
import { findProfileByHandle } from "../../db/queries";
import logger, { logObject } from "../../logger";
import IProfile from "../../interfaces/IProfile";
import { ValidationResult } from "@hapi/joi";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Query profile by handle
 * @param req Request object
 * @param res Response object
 */
const getProfileByHandle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // request validation
  const { handle } = req.params;
  const validation: ValidationResult = RequestValidator.validateHandle(handle);
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  // find profile
  const profile: IProfile | undefined = await findProfileByHandle(
    handle,
    req.id
  );
  if (!profile) {
    logger.error(`[NODE][${req.id}] Response status 404`);
    return res.status(404).json({ message: NO_PROFILE });
  }

  try {
    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).json(profile);
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: NO_PROFILE });
  }
};

export default getProfileByHandle;
