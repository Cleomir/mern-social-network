import { Document } from "mongoose";

import logger from "../logger";
import Post from "./models/Post";
import IPost from "../interfaces/IPost";
import IProfile from "../interfaces/IProfile";
import Profile from "./models/Profile";
import IUser from "../interfaces/IUser";
import User from "./models/User";

/**
 * Query a post by post id
 * @param id Post id
 * @param requestId Id of the request
 */
export const findOnePost = async (
  id: string,
  requestId: string
): Promise<IPost | undefined> => {
  logger.error(`[MONGO][${requestId}] Querying post with {${id}}`);
  const post: Document | null = await Post.findById(id);
  if (!post) {
    logger.error(`[MONGO][${requestId}] Post not found {${id}}`);
    return;
  }
  logger.error(`[MONGO][${requestId}] Post found {${id}}`);

  return (post as unknown) as IPost;
};

/**
 * Query a profile
 * @param id User's id
 * @param requestId Id of the request
 */
export const findOneProfile = async (
  whereClause: Record<string, unknown>,
  requestId: string
): Promise<IProfile | undefined> => {
  logger.error(`[MONGO][${requestId}] Querying profile by id`);
  const profile: Document | null = await Profile.findOne(
    whereClause
  ).populate("user", ["name", "avatar"]);
  if (!profile) {
    logger.error(`[MONGO][${requestId}] Profile not found`);
  }
  logger.error(`[MONGO][${requestId}] Profile found`);

  return (profile as unknown) as IProfile;
};

/**
 * Database findOne function for easy mocking
 * @param whereClause Query where clause
 */
export const findOneUser = async (
  whereClause: Record<string, unknown>,
  requestId: string
): Promise<IUser | undefined> => {
  logger.info(`[MONGO][${requestId}] Querying user with {${whereClause}}`);
  const user: Document | null = await User.findOne(whereClause);
  if (!user) {
    logger.info(`[MONGO][${requestId}] User not found`);
    return;
  }
  logger.info(`[MONGO][${requestId}] User found`);

  return (user as unknown) as IUser;
};

/**
 *
 * @param document Mongo Document to be saved
 */
export const deleteOneDocument = async (document: Document): Promise<void> => {
  await document.remove();
};

/**
 * Database save function for easy mocking
 * @param document Mongo Document to be saved
 */
export const saveOneDocument = async (document: Document): Promise<void> => {
  await document.save();
};

/**
 * Query all profiles
 * @param requestId Id of the request
 */
export const findAllProfiles = async (
  requestId: string
): Promise<IProfile[] | undefined> => {
  logger.info(`[MONGO][${requestId}] Querying all profiles`);
  const profiles: Document[] = await Profile.find().populate("user", [
    "name",
    "avatar",
  ]);
  if (!profiles) {
    logger.info(`[MONGO][${requestId}] No profiles found`);
    return;
  }
  logger.info(`[MONGO][${requestId}] Profiles found`);

  return (profiles as unknown) as IProfile[];
};

/**
 * Query all posts in descending order
 * @param requestId Id of the request
 */
export const findAllPosts = async (requestId: string): Promise<IPost[]> => {
  logger.info(`[MONGO][${requestId}] Querying all posts`);
  const posts: Document[] = await Post.find().sort({ date: -1 });
  if (!posts || posts.length === 0) {
    logger.info(`[MONGO][${requestId}] No post found`);
  }
  logger.info(`[MONGO][${requestId}] Posts found`);
  return (posts as unknown) as IPost[];
};
