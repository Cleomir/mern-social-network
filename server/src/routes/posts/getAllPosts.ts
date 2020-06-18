import { Request, Response } from "express";
import { Document } from "mongoose";
import { inspect } from "util";

import { INTERNAL_SERVER_ERROR } from "../../config/custom-error-messages";
import { findAllPosts } from "../../db/queries";
import logger from "../../helpers/logger";

/**
 * Query all posts
 * @param req Request object
 * @param res Response object
 */
const getAllPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    logger.info(`Querying all posts...`);
    const posts: Document[] = await findAllPosts();
    logger.info(
      `Queried ${posts.length} posts from db.\nReturning success response...`
    );
    return res.status(200).json(posts);
  } catch (error) {
    logger.error(
      `Could not query posts\nError:\n${inspect(error, { depth: null })}`
    );
    logger.error(`Returning error response...`);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default getAllPosts;
