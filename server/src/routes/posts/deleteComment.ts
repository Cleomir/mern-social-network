import { ErrorObject } from "ajv";
import { Request, Response } from "express";

import PostsSchema from "../../../json-schemas/posts.json";
import ProfilesSchema from "../../../json-schemas/profiles.json";
import {
  FORBIDDEN_OPERATION,
  POST_NOT_FOUND,
  UNABLE_TO_REMOVE_COMMENT,
} from "../../config/custom-error-messages";
import { removePost, removeCommentFromPost } from "../../db/queries";
import logger from "../../helpers/logger";
import validateRequest from "../../helpers/validateRequest";

/**
 * Delete a comment from a post
 * @param req Request object
 * @param res Response object
 */
const deleteComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { post_id, comment_id } = req.params;
    const { id } = req.user!;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      PostsSchema,
      { deleteComment: { postId: post_id, commentId: comment_id } },
      ProfilesSchema
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    await removeCommentFromPost(post_id, comment_id, id);
    logger.info(
      `User ${id} has deleted comment ${comment_id} from post ${post_id}`
    );

    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      return res.status(404).json({ message: POST_NOT_FOUND });
    }
    if (error.message === FORBIDDEN_OPERATION) {
      return res.status(403).json({ message: UNABLE_TO_REMOVE_COMMENT });
    }

    logger.error(`${UNABLE_TO_REMOVE_COMMENT}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_REMOVE_COMMENT });
  }
};

export default deleteComment;
