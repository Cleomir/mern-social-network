import { ErrorObject } from "ajv";
import { Request, Response } from "express";

import PostsSchema from "../../../json-schemas/posts.json";
import ProfilesSchema from "../../../json-schemas/profiles.json";
import {
  UNABLE_TO_RETRIEVE_POSTS,
  POST_NOT_FOUND,
} from "../../config/custom-error-messages";
import { findPostById } from "../../db/queries";
import logger from "../../helpers/logger";
import validateRequest from "../../helpers/validateRequest";
import IPost from "../../interfaces/IPost";

/**
 * Query a post by id
 * @param req Request object
 * @param res Response object
 */
const getPostById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const validationResult: ErrorObject[] | null | undefined = validateRequest(
      PostsSchema,
      { get: { id } },
      ProfilesSchema
    );

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    const post: IPost | null = await findPostById(id);

    if (!post) {
      return res.status(404).json({ message: POST_NOT_FOUND });
    }

    return res.status(200).json(post);
  } catch (error) {
    logger.error(`${UNABLE_TO_RETRIEVE_POSTS}\n`, error);
    return res.status(500).json({ message: UNABLE_TO_RETRIEVE_POSTS });
  }
};

export default getPostById;
