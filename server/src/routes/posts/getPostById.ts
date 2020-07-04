import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { findPostById } from "../../db/queries";
import logger, { logObject } from "../../logger";
import IPost from "../../interfaces/IPost";

import RequestValidator from "../../validation/RequestValidator";

/**
 * Query a post by id
 * @param req Request object
 * @param res Response object
 */
const getPostById = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  const { id: postId } = req.params;
  const validation: ValidationResult = RequestValidator.validateId(postId);
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // find post
    const post: IPost | undefined = await findPostById(postId, req.id);
    if (!post) {
      logger.error(`[NODE][${req.id}] Response status 404`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).json(post);
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default getPostById;
