import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import {
  POST_NOT_FOUND,
  POST_NOT_LIKED,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from "../../config/customErrorMessages";
import { RemoveLikeFromPost } from "../../db/queries";
import logger from "../../logger";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Like a post
 * @param req Request object
 * @param res Response object
 */
const unlikePost = async (req: Request, res: Response): Promise<unknown> => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED });
  }

  // request validation
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const validation: ValidationResult = RequestValidator.validateId(postId);
  if (validation.error) {
    logger.error(
      `Attempt to unlike post with invalid parameters. User id: ${userId} post id: ${postId}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    logger.info(`Removing like from post id ${postId} with user id ${userId}`);
    await RemoveLikeFromPost(userId, postId);
    logger.info(`Like removed from post id ${postId} with user id ${userId}`);

    logger.info(`Returning success response for user id ${userId}...`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      logger.error(`Post id ${postId} not found`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === POST_NOT_LIKED) {
      logger.error(
        `Attempt to remove a like from a post id ${postId} which is not yet liked by user id ${userId}`
      );
      return res.status(403).json({ message: POST_NOT_LIKED });
    }

    logger.error(
      `Could not unlike post id ${postId} with user id ${userId}\n${inspect(
        error,
        { depth: null }
      )}`
    );
    logger.error(`Returning error response for user id ${userId}...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default unlikePost;
