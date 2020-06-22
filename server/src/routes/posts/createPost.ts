import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";
import { inspect } from "util";

import {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from "../../config/customErrorMessages";
import { addPost } from "../../db/queries";
import logger from "../../logger";
import IPost from "../../interfaces/IPost";
import RequestValidator from "../../validation/RequestValidator";

/**
 * Create a new post
 * @param req Request object
 * @param res Response object
 */
const createPost = async (req: Request, res: Response): Promise<unknown> => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED });
  }

  // request validation
  const { id } = req.user;
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
    logger.warn(
      `Attempt to create post with invalid parameters for id ${id}. Parameters:\n ${inspect(
        post,
        {
          depth: null,
        }
      )}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // save post
    logger.info(
      `Creating new post for id ${id} with payload ${inspect(post, {
        depth: null,
      })}`
    );
    const postDocument = await addPost(post);
    logger.info(`User ${id} has created post id ${postDocument._id}`);

    logger.info(`Returning success response for user id ${id}...`);
    return res.status(201).end();
  } catch (error) {
    logger.error(
      `Could not create post for id ${id}\nError:\n${inspect(error, {
        depth: null,
      })}`
    );
    logger.error(`Returning error response for user id ${id}...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default createPost;
