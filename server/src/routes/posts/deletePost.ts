import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import {
  FORBIDDEN_OPERATION,
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from "../../config/customErrorMessages";
import { removePost } from "../../db/queries";
import logger from "../../logger";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Delete a post by ID
 * @param req Request object
 * @param res Response object
 */
const deletePost = async (req: Request, res: Response): Promise<unknown> => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED });
  }

  // request validation
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const validation: ValidationResult = RequestValidator.validateId(userId);
  if (validation.error) {
    logger.error(
      `Attempt to delete post with invalid parameters. Id: ${userId} post id: ${postId}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // delete post
    logger.info(`Deleting post id ${postId} for user id ${userId}`);
    await removePost(userId, postId);
    logger.info(`Post id ${postId} deleted for user id ${userId}`);

    logger.info(`Returning success response for user id ${userId}...`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      logger.error(`Post id ${postId} for user id ${userId} not found`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === FORBIDDEN_OPERATION) {
      `Attempt to delete an inexistent post with id ${postId} for user id ${userId}`;
      return res.status(403).json({ message: FORBIDDEN_OPERATION });
    }

    logger.error(
      `Could not delete post id ${postId} for user id ${userId}\nError:${inspect(
        error,
        { depth: null }
      )}`
    );
    logger.error(`Returning error response for user id ${userId}...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deletePost;
