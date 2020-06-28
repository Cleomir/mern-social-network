import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import {
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/customErrorMessages";
import { addCommentToPost } from "../../db/queries";
import logger from "../../logger";
import IComment from "../../interfaces/IComment";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Add comment to a post
 * @param req Request object
 * @param res Response object
 */
const addComment = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  const { post_id } = req.params;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
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
    logger.warn(
      `Attempt to add comment with invalid parameters for id ${id}. Parameters: ${inspect(
        comment,
        { depth: null }
      )}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // save comment
    logger.info(`Adding comment for user id ${id} on post ${post_id}...`);
    await addCommentToPost(post_id, comment);
    logger.info(`Comment added for user id ${id} on post ${post_id}`);

    logger.info(`Returning success response for user id ${id}`);
    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      logger.error(`Post id ${post_id} not found`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }

    logger.error(
      `Could not add comment for id ${id} on post ${post_id}\nError:\n${inspect(
        error,
        { depth: null }
      )}`
    );
    logger.error(`Returning error response for user id ${id}...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default addComment;
