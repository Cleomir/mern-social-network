import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  FORBIDDEN_OPERATION,
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/custom-error-messages";
import { removeCommentFromPost } from "../../db/queries";
import logger from "../../helpers/logger";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Delete a comment from a post
 * @param req Request object
 * @param res Response object
 */
const deleteComment = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
    const { post_id, comment_id } = req.params;
    const { id } = req.user!;
    const validation: ValidationResult = RequestValidator.validateDeleteComment(
      post_id,
      comment_id
    );
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    // delete comment
    await removeCommentFromPost(post_id, comment_id, id);
    logger.info(
      `User ${id} has deleted comment ${comment_id} from post ${post_id}`
    );

    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === FORBIDDEN_OPERATION) {
      return res.status(403).json({ message: FORBIDDEN_OPERATION });
    }

    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteComment;
