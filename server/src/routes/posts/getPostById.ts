import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from "../../config/customErrorMessages";
import { findPostById } from "../../db/queries";
import logger from "../../logger";
import IPost from "../../interfaces/IPost";

import RequestValidator from "../../validation/RequestValidator";
import { inspect } from "util";

/**
 * Query a post by id
 * @param req Request object
 * @param res Response object
 */
const getPostById = async (req: Request, res: Response): Promise<unknown> => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED });
  }

  // request validation
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const validation: ValidationResult = RequestValidator.validateId(postId);
  if (validation.error) {
    logger.error(
      `Attempt to query post with invalid parameters. User id ${userId}, post id ${postId}`
    );
    return res.status(400).json({ message: validation.error.message });
  }

  try {
    // find post
    logger.info(`Querying post id ${postId} for user id ${userId}...`);
    const post: IPost | null = await findPostById(postId);
    if (!post) {
      logger.error(`Could not find post id ${postId} for user id ${userId}`);
      return res.status(404).json({ message: POST_NOT_FOUND });
    }

    logger.info(`Returning success response for user id ${userId}`);
    return res.status(200).json(post);
  } catch (error) {
    logger.error(
      `Could not query post id ${postId} for user id ${userId}\nError:\n${inspect(
        error,
        { depth: null }
      )}`
    );
    logger.error(`Returning error response for user id ${userId}...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default getPostById;
