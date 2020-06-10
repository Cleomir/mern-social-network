import { Request, Response } from "express";

import {
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/custom-error-messages";
import { addCommentToPost } from "../../db/queries";
import logger from "../../helpers/logger";
import IComment from "../../interfaces/IComment";
import { ValidationResult } from "@hapi/joi";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Add comment to a post
 * @param req Request object
 * @param res Response object
 */
const addComment = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
    const { post_id } = req.params;
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
      return res.status(400).json({ message: validation.error.message });
    }

    // save comment
    await addCommentToPost(post_id, comment);
    logger.info(`User ${id} has added a comment to post ${post_id}`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      return res.status(404).json({ message: POST_NOT_FOUND });
    }

    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default addComment;
