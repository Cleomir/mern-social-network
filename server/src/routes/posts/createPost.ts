import { Request, Response } from "express";

import { INTERNAL_SERVER_ERROR } from "../../config/custom-error-messages";
import { addPost } from "../../db/queries";
import logger from "../../helpers/logger";
import IPost from "../../interfaces/IPost";
import { ValidationResult } from "@hapi/joi";
import RequestValidator from "../../helpers/RequestValidator";

/**
 * Create a new post
 * @param req Request object
 * @param res Response object
 */
const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
    const post: IPost = {
      text: req.body.text,
      user: req.user!.id,
      avatar: req.body.avatar,
      name: req.body.name,
    };
    const validation: ValidationResult = RequestValidator.validateNewPostOrComment(
      post
    );
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    // save post
    const postDocument = await addPost(post);
    logger.info(`User ${req.user!.id} has created post id ${postDocument._id}`);

    return res.status(201).end();
  } catch (error) {
    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default createPost;
