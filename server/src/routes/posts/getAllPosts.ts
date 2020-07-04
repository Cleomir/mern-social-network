import { Request, Response } from "express";

import { INTERNAL_SERVER_ERROR } from "../../config/customErrorMessages";
import { findAllPosts } from "../../db/queries";
import logger, { logObject } from "../../logger";
import IPost from "../../interfaces/IPost";

/**
 * Query all posts
 * @param req Request object
 * @param res Response object
 */
const getAllPosts = async (req: Request, res: Response): Promise<unknown> => {
  try {
    const posts: IPost[] = await findAllPosts(req.id);
    if (!posts || posts.length === 0) {
      logger.info(`[NODE][${req.id}] Response status 204`);
      return res.status(204).end();
    }

    logger.info(`[NODE][${req.id}] Response status 201`);
    return res.status(200).json(posts);
  } catch (error) {
    logObject("error", `[NODE][${req.id}] Response status 500`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default getAllPosts;
