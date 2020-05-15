import { Request, Response } from "express";
import Ajv from "ajv";
import { Document } from "mongoose";

import logger from "../../helpers/logger";
import ProfilesSchema from "../../../json-schemas/profile.json";
import validateRequest from "../../helpers/validadteRequest";
import IUser from "../../interfaces/IUser";
import { findProfileById } from "../../db/queries";

/**
 * Query user profile
 * @param req - Request object
 * @param res - Response object
 *
 */
const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as IUser;

    const validationResult:
      | Ajv.ErrorObject[]
      | null
      | undefined = validateRequest(ProfilesSchema, { id });

    // return validation errors
    if (validationResult && validationResult.length > 0) {
      return res.status(400).json({ errors: validationResult });
    }

    const profile: Document | null = await findProfileById(id!);

    if (!profile) {
      return res
        .status(404)
        .json({ message: "There is no profile for this user" });
    }

    return res.status(200).end();
  } catch (error) {
    logger.error("Could not query profile \n", error);
    return res.status(500).end();
  }
};

export default getProfile;
