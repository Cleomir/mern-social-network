import { ErrorObject } from "ajv";
import { Request, Response } from "express";

import PostsSchema from "../../../json-schemas/posts.json";
import ProfilesSchema from "../../../json-schemas/profiles.json";
import {
  POST_NOT_FOUND,
  UNABLE_TO_ADD_COMMENT_TO_POST,
} from "../../config/custom-error-messages";
import { addCommentToPost } from "../../db/queries";
import logger from "../../helpers/logger";
import validateRequest from "../../helpers/validateRequest";
import IComment from "../../interfaces/IComment";

/**
 * Add comment to a post
 * @param req Request object
 * @param res Response object
 */
const addComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { post_id } = req.params;
    const { id } = req.user!;
    const comment: IComment = {
      user: id,
      text: req.body.text,
      avatar: req.body.avatar,
      name: req.body.name,
    };
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      PostsSchema,
      { create: comment },
      ProfilesSchema
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    await addCommentToPost(post_id, comment);
    logger.info(`User ${id} has added a comment to post ${post_id}`);

    return res.status(200).end();
  } catch (error) {
    if (error.message === POST_NOT_FOUND) {
      return res.status(404).json({ message: POST_NOT_FOUND });
    }

    logger.error(`${UNABLE_TO_ADD_COMMENT_TO_POST}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_ADD_COMMENT_TO_POST });
  }
};

export default addComment;
