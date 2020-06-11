import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  POST_NOT_FOUND,
  POST_NOT_LIKED,
  INTERNAL_SERVER_ERROR,
} from "../../config/custom-error-messages";
import { RemoveLikeFromPost } from "../../db/queries";
import logger from "../../helpers/logger";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Like a post
 * @param req Request object
 * @param res Response object
 */
const unlikePost = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
    const { id: postId } = req.params;
    const { id: userId } = req.user!;
    const validation: ValidationResult = RequestValidator.validateId(postId);
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    await RemoveLikeFromPost(userId, postId);
    logger.info(`User ${userId} has unliked post ${postId}`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === POST_NOT_LIKED) {
      return res.status(403).json({ message: POST_NOT_LIKED });
    }

    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default unlikePost;
