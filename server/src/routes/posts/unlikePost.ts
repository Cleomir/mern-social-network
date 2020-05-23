import { ErrorObject } from "ajv";
import { Request, Response } from "express";

import PostsSchema from "../../../json-schemas/posts.json";
import ProfilesSchema from "../../../json-schemas/profiles.json";
import {
  POST_NOT_FOUND,
  POST_NOT_LIKED,
  UNABLE_TO_REMOVE_LIKE_FROM_POST,
} from "../../config/custom-error-messages";
import { RemoveLikeFromPost } from "../../db/queries";
import logger from "../../helpers/logger";
import validateRequest from "../../helpers/validateRequest";

/**
 * Like a post
 * @param req Request object
 * @param res Response object
 */
const unlikePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user!;

    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      PostsSchema,
      { get: { user: postId } },
      ProfilesSchema
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
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

    logger.error(`${UNABLE_TO_REMOVE_LIKE_FROM_POST}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_REMOVE_LIKE_FROM_POST });
  }
};

export default unlikePost;