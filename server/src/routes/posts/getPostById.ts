import { Request, Response } from "express";
import { ValidationResult } from "@hapi/joi";

import {
  POST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/custom-error-messages";
import { findPostById } from "../../db/queries";
import logger from "../../helpers/logger";
import IPost from "../../interfaces/IPost";

import RequestValidator from "../../helpers/RequestValidator";

/**
 * Query a post by id
 * @param req Request object
 * @param res Response object
 */
const getPostById = async (req: Request, res: Response): Promise<any> => {
  try {
    // request validation
    const { id } = req.params;
    const validation: ValidationResult = RequestValidator.validateId(id);
    if (validation.error) {
      return res.status(400).json({ message: validation.error.message });
    }

    // find post
    const post: IPost | null = await findPostById(id);
    if (!post) {
      return res.status(404).json({ message: POST_NOT_FOUND });
    }

    return res.status(200).json(post);
  } catch (error) {
    logger.error(`${INTERNAL_SERVER_ERROR}\n`, error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export default getPostById;
