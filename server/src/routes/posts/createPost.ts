import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import { INTERNAL_SERVER_ERROR } from "../../config/customErrorMessages";
import { addPost } from "../../database/queries";
import logger, { logObject } from "../../logger";
import IPost from "../../interfaces/IPost";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Create a new post
 * @param req Request object
 * @param res Response object
 */
const createPost = async (req: Request, res: Response): Promise<unknown> => {
  // request validation
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = req.user!;
  const post: IPost = {
    text: req.body.text,
    user: id,
    avatar: req.body.avatar,
    name: req.body.name,
  };
  const validation: ValidationResult = RequestValidator.validateNewPostOrComment(
    post
  );
  if (validation.error) {
    logger.error(`[NODE][${req.id}] Response status 400`);
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // save post
    await addPost(post, req.id);

    logger.info(`[NODE][${req.id}] Response status 201`);
    return res.status(201).end();
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default createPost;
