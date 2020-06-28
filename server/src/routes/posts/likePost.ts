import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import {
  POST_NOT_FOUND,
  POST_ALREADY_LIKED,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { addLikeToPost } from "../../db/queries";
import logger from "../../logger";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Like a post
 * @param req Request object
 * @param res Response object
 */
const likePost = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  const { id: postId } = req.params;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id: userId } = req.user!;
  const validation: ValidationResult = RequestValidator.validateId(postId);
  if (validation.error) {
    logger.error(
      `Attempt to like post with invalid parameters. User id: ${userId} post id: ${postId}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    logger.info(`Adding like to post id ${postId} with user id ${userId}...`);
    await addLikeToPost(userId, postId);
    logger.info(`Like added to post id ${postId} with user id ${userId}`);

    logger.info(`Returning success response for user id ${userId}...`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      logger.error(`Post id ${postId} not found for user id ${userId}`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }

    if (error.message === POST_ALREADY_LIKED) {
      logger.error(`User id ${userId} has already liked post id ${postId}`);
      return res.status(403).json({ message: POST_ALREADY_LIKED });
    }

    logger.error(
      `Could not like post id ${postId} with user id ${userId}\nError:${inspect(
        error,
        { depth: null }
      )}`
    );
    logger.error(`Returning error response for user id ${userId}...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default likePost;
