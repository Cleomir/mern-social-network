import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  POST_NOT_FOUND,
  POST_NOT_LIKED,
  INTERNAL_SERVER_ERROR,
} from "../../../config/customErrorMessages";
import { removeLikeFromPost } from "../../../database/queries";
import logger, { logObject } from "../../../logger";
import RequestValidator from "../../../validation/RequestValidator";
import { findOnePost, saveOneDocument } from "../../../database/dbDirectCalls";

/**
 * Like a post
 * @param req Request object
 * @param res Response object
 */
const removeLike = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const { post_id } = req.params;
  const validation: ValidationResult = RequestValidator.validateId(post_id);
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // remove like from post
    await removeLikeFromPost(id, post_id, findOnePost, saveOneDocument, req.id);

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      logger.error(`[NODE][${req.id}] Response status 404`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === POST_NOT_LIKED) {
      logger.error(`[NODE][${req.id}] Response status 403`);
      return res.status(403).json({ message: POST_NOT_LIKED });
    }

    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default removeLike;
