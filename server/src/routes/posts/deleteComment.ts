import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  FORBIDDEN_OPERATION,
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { removeCommentFromPost } from "../../database/queries";
import logger, { logObject } from "../../logger";
import RequestValidator from "../../validation/RequestValidator";
import { findOnePost, saveOneDocument } from "../../database/dbDirectCalls";

/**
 * Delete a comment from a post
 * @param req Request object
 * @param res Response object
 */
const deleteComment = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  const { post_id, comment_id } = req.params;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id: user_id } = req.user!;
  const validation: ValidationResult = RequestValidator.validateDeleteComment(
    post_id,
    comment_id
  );
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // delete comment
    await removeCommentFromPost(
      post_id,
      comment_id,
      user_id,
      findOnePost,
      saveOneDocument,
      req.id
    );

    logger.info(`[NODE][${req.id}] Response status 200`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      logger.error(`[NODE][${req.id}] Response status 404`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === FORBIDDEN_OPERATION) {
      logger.error(`[NODE][${req.id}] Response status 403`);
      return res.status(403).json({ message: FORBIDDEN_OPERATION });
    }

    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default deleteComment;
