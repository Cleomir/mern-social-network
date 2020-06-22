import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import {
  FORBIDDEN_OPERATION,
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from "../../config/customErrorMessages";
import { removeCommentFromPost } from "../../db/queries";
import logger from "../../logger";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Delete a comment from a post
 * @param req Request object
 * @param res Response object
 */
const deleteComment = async (req: Request, res: Response): Promise<unknown> => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED });
  }

  // request validation
  const { post_id, comment_id } = req.params;
  const { id } = req.user;
  const validation: ValidationResult = RequestValidator.validateDeleteComment(
    post_id,
    comment_id
  );
  if (validation.error) {
    logger.error(
      `Attempt to delete comment with invalid Parameters: Id: ${id} post id: ${post_id} comment id: ${comment_id}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // delete comment
    logger.info(
      `Deleting comment id ${comment_id} from post id ${post_id} for user id ${id}`
    );
    await removeCommentFromPost(post_id, comment_id, id);
    logger.info(
      `Comment id ${comment_id} deleted from post id ${post_id} for user id ${id}`
    );

    logger.info(`Returning success response for user id ${id}...`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      logger.error(`Post id ${post_id} not found`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === FORBIDDEN_OPERATION) {
      logger.error(
        `Attempt to delete an inexistent comment with id ${comment_id}`
      );
      return res.status(403).json({ message: FORBIDDEN_OPERATION });
    }

    logger.error(
      `Could not delete comment id ${comment_id} from post id ${post_id} for user id ${id}\nError:\n${inspect(
        error,
        { depth: null }
      )}`
    );
    logger.error(`Returning error response for user id ${id}...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteComment;
