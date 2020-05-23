import { ErrorObject } from "ajv";
import { Request, Response } from "express";

import PostsSchema from "../../../json-schemas/posts.json";
import { UNABLE_TO_CREATE_POST } from "../../config/custom-error-messages";
import { addPost } from "../../db/queries";
import logger from "../../helpers/logger";
import validateRequest from "../../helpers/validateRequest";
import IPost from "../../interfaces/IPost";

/**
 * Create a new post
 * @param req Request object
 * @param res Response object
 */
const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const post: IPost = {
      text: req.body.text,
      user: req.user!.id,
      avatar: req.body.avatar,
      name: req.body.name,
    };

    const validationResult:
      | ErrorObject[]
      | null
      | undefined = validateRequest(PostsSchema, { create: post });

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    const postDocument = await addPost(post);
    logger.info(`User ${req.user!.id} has created post id ${postDocument._id}`);

    return res.status(201).end();
  } catch (error) {
    logger.error(`${UNABLE_TO_CREATE_POST}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_CREATE_POST });
  }
};

export default createPost;