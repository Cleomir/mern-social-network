import { ErrorObject } from "ajv";
import { Request, Response } from "express";

import PostsSchema from "../../../json-schemas/posts.json";
import ProfilesSchema from "../../../json-schemas/profiles.json";
import {
  FORBIDDEN_OPERATION,
  UNABLE_TO_REMOVE_POST,
  POST_NOT_FOUND,
} from "../../config/custom-error-messages";
import { removePost } from "../../db/queries";
import logger from "../../helpers/logger";
import validateRequest from "../../helpers/validateRequest";

/**
 * Delete a post by ID
 * @param req Request object
 * @param res Response object
 */
const deletePost = async (req: Request, res: Response): Promise<any> => {
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

    await removePost(userId, postId);
    logger.info(`User ${userId} has deleted post ${postId}`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === FORBIDDEN_OPERATION) {
      return res.status(403).json({ message: UNABLE_TO_REMOVE_POST });
    }

    logger.error(`${UNABLE_TO_REMOVE_POST}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_REMOVE_POST });
  }
};

export default deletePost;
