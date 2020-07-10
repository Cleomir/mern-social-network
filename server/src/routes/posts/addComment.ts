import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { addCommentToPost } from "../../database/queries";
import logger, { logObject } from "../../logger";
import IComment from "../../interfaces/IComment";
import RequestValidator from "../../validation/RequestValidator";
import { findOnePost, saveOneDocument } from "../../database/dbDirectCalls";

/**
 * Add comment to a post
 * @param req Request object
 * @param res Response object
 */
const addComment = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const { post_id } = req.params;
  const comment: IComment = {
    user: id,
    text: req.body.text,
    avatar: req.body.avatar,
    name: req.body.name,
  };
  const validation: ValidationResult = RequestValidator.validateNewPostOrComment(
    comment
  );
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // save comment
    await addCommentToPost(
      post_id,
      comment,
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

    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default addComment;
