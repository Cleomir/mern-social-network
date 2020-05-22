import { Request, Response } from "express";
import { Document } from "mongoose";

import { UNABLE_TO_RETRIEVE_POSTS } from "../../config/custom-error-messages";
import { findAllPosts } from "../../db/queries";
import logger from "../../helpers/logger";

/**
 * Query all posts
 * @param req Request object
 * @param res Response object
 */
const getAllPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    const posts: Document[] = await findAllPosts();
    logger.info(`Querying ${posts.length} posts from db...`);

    return res.status(200).json(posts);
  } catch (error) {
    logger.error(`${UNABLE_TO_RETRIEVE_POSTS}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_RETRIEVE_POSTS });
  }
};

export default getAllPosts;
