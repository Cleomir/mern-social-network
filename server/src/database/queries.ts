import { Document } from "mongoose";

import User from "./models/User";
import Profile from "./models/Profile";
import IUser from "../interfaces/IUser";
import { hashPassword } from "../authentication/password";
import IProfile from "../interfaces/IProfile";
import {
  USER_EXISTS,
  PROFILE_HANDLE_EXISTS,
  PROFILE_EXISTS,
  USER_NOT_FOUND,
  NO_EXPERIENCE,
  NO_EDUCATION,
  POST_NOT_FOUND,
  FORBIDDEN_OPERATION,
  POST_ALREADY_LIKED,
  POST_NOT_LIKED,
  PROFILE_NOT_FOUND,
} from "../config/customErrorMessages";
import IExperience from "../interfaces/IExperience";
import IEducation from "../interfaces/IEducation";
import IPost from "../interfaces/IPost";
import Post from "./models/Post";
import IComment from "../interfaces/IComment";
import logger from "../logger";
import {
  IFindOneUser,
  ISaveOneDocument,
  IFindOneProfile,
  IDeleteOneDocument,
  IFindOnePost,
} from "../interfaces/function-types/Database";

/**
 * Add or append new education
 * @param userId User's id
 * @param education Education
 * @param requestId Id of the request
 */
export const addEducationToProfile = async (
  userId: string,
  education: IEducation[],
  findOneProfileFunc: IFindOneProfile,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | undefined = await findOneProfileFunc(
    { user: userId },
    requestId
  );
  if (!userProfile) {
    throw new Error(PROFILE_NOT_FOUND);
  }

  // check if user already has experience
  userProfile.education
    ? (userProfile.education = [...education, ...userProfile.education])
    : (userProfile.education = [...education]);

  logger.info(`[MONGO][${requestId}] Saving new education`);
  await saveOneDocumentFunc((userProfile as unknown) as Document);
  logger.info(`[MONGO][${requestId}] Education saved`);
};

/**
 * Add or append new work experience
 * @param userId User's id
 * @param experience Work experience
 * @param requestId Id of the request
 */
export const addExperienceToProfile = async (
  userId: string,
  experience: IExperience[],
  findOneProfileFunc: IFindOneProfile,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | undefined = await findOneProfileFunc(
    { user: userId },
    requestId
  );
  if (!userProfile) {
    throw new Error(PROFILE_NOT_FOUND);
  }

  // check if user already has experience
  userProfile.experience
    ? (userProfile.experience = [...experience, ...userProfile.experience])
    : (userProfile.experience = [...experience]);

  logger.info(`[MONGO][${requestId}] Saving new experience`);
  await saveOneDocumentFunc((userProfile as unknown) as Document);
  logger.info(`[MONGO][${requestId}] Experience saved`);
};

/**
 * Create a post
 * @param post Post to be created
 * @param requestId Id of the request
 */
export const addPost = async (
  post: IPost,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  logger.info(`[MONGO][${requestId}] Saving new post`);
  await saveOneDocumentFunc(new Post(post));
  logger.info(`[MONGO][${requestId}] Post saved`);
};

/**
 * Query single post by id
 * @param postId Post id
 * @param requestId Id of the request
 */
export const removePost = async (
  userId: string,
  postId: string,
  findOnePostFunc: IFindOnePost,
  deleteOneDocumentFunc: IDeleteOneDocument,
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findOnePostFunc(postId, requestId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // check post ownership
  if (post.user.toString() !== userId) {
    logger.error(`[MONGO][${requestId}] Post doesn't belong to user`);
    throw new Error(FORBIDDEN_OPERATION);
  }

  logger.error(`[MONGO][${requestId}] Removing post id {${postId}}`);
  await deleteOneDocumentFunc((post as unknown) as Document);
  logger.error(`[MONGO][${requestId}] Post removed`);
};

/**
 * Like a post
 * @param userId User id
 * @param postId Post id
 * @param requestId Id of the request
 */
export const addLikeToPost = async (
  userId: string,
  postId: string,
  findOnePostFunc: IFindOnePost,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findOnePostFunc(postId, requestId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // check if user has already liked the post
  if (
    post.likes &&
    post.likes.findIndex(
      (likedUserId) => likedUserId.user.toString() === userId
    ) !== -1
  ) {
    logger.error(`[MONGO][${requestId}] Post already liked`);
    throw new Error(POST_ALREADY_LIKED);
  }

  post.likes?.unshift({ user: userId });
  logger.info(`[MONGO][${requestId}] Adding like to post`);
  await saveOneDocumentFunc((post as unknown) as Document);
  logger.info(`[MONGO][${requestId}] Like added`);
};

/**
 * Unlike a post
 * @param userId User id
 * @param postId Post id
 * @param requestId Id of the request
 */
export const removeLikeFromPost = async (
  userId: string,
  postId: string,
  findOnePostFunc: IFindOnePost,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findOnePostFunc(postId, requestId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // check if user didn't like the post yet
  let userIdIndex = -1;
  if (post.likes) {
    userIdIndex = post.likes.findIndex(
      (likedUserId) => likedUserId.user.toString() === userId
    );
    if (userIdIndex === -1) {
      logger.error(`[MONGO][${requestId}] Post not liked yet`);
      throw new Error(POST_NOT_LIKED);
    }
    post.likes.splice(userIdIndex, 1);

    logger.error(`[MONGO][${requestId}] Removing like from post`);
    await saveOneDocumentFunc((post as unknown) as Document);
    logger.error(`[MONGO][${requestId}] Like removed`);
  }
};

/**
 * Add comment to a post
 * @param postId Post id
 * @param comment Comment to add
 * @param requestId Id of the request
 */
export const addCommentToPost = async (
  postId: string,
  comment: IComment,
  findOnePostFunc: IFindOnePost,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findOnePostFunc(postId, requestId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // add post
  logger.info(`[MONGO][${requestId}] Saving comment`);
  post.comments?.unshift(comment);
  await saveOneDocumentFunc((post as unknown) as Document);
  logger.info(`[MONGO][${requestId}] Comment saved`);
};

/**
 * Remove a comment from a post
 * @param postId Post id
 * @param commentId Comment id
 * @param userId User id
 * @param requestId Id of the request
 */
export const removeCommentFromPost = async (
  postId: string,
  commentId: string,
  userId: string,
  findOnePostFunc: IFindOnePost,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findOnePostFunc(postId, requestId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // check if user has commented the post
  let commentIndex = -1;
  if (post.comments) {
    commentIndex = post.comments.findIndex((comment) => {
      if (comment._id) {
        return (
          comment._id.toString() === commentId &&
          comment.user.toString() === userId
        );
      }

      return;
    });
    if (commentIndex === -1) {
      logger.error(
        `[MONGO][${requestId}] Comment doesn't exist or belongs to another user`
      );
      throw new Error(FORBIDDEN_OPERATION);
    }

    logger.info(
      `[MONGO][${requestId}] Deleting comment id {${commentId}} from post id {${postId}}`
    );
    post.comments.splice(commentIndex, 1);
    await saveOneDocumentFunc((post as unknown) as Document);
    logger.info(`[MONGO][${requestId}] Comment deleted`);
  }
};

/**
 * Remove work experience
 * @param userId User's id
 * @param experience Work experience
 * @param requestId Id of the request
 */
export const removeExperienceFromProfile = async (
  userId: string,
  experienceId: string,
  findOneProfileFunc: IFindOneProfile,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | undefined = await findOneProfileFunc(
    { user: userId },
    requestId
  );
  if (!userProfile) {
    throw new Error(PROFILE_NOT_FOUND);
  }
  if (!userProfile.experience) {
    logger.error(`[MONGO][${requestId}] No experience found`);
    throw new Error(NO_EXPERIENCE);
  }

  const ExperienceIndex: number = userProfile.experience.findIndex(
    (experience) => experience.id === experienceId
  );
  if (ExperienceIndex === -1) {
    logger.error(
      `[MONGO][${requestId}] Experience id {${experienceId}} not found`
    );
    throw new Error(NO_EXPERIENCE);
  }

  logger.info(`[MONGO][${requestId}] Deleting experience id {${experienceId}}`);
  userProfile.experience.splice(ExperienceIndex, 1);
  await saveOneDocumentFunc((userProfile as unknown) as Document);
  logger.info(`[MONGO][${requestId}] Experience deleted`);
};

/**
 * Remove education
 * @param userId User's id
 * @param experience Work experience
 * @param requestId Id of the request
 */
export const removeEducationFromProfile = async (
  userId: string,
  educationId: string,
  findOneProfileFunc: IFindOneProfile,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  // find profile
  const userProfile: IProfile | undefined = await findOneProfileFunc(
    { user: userId },
    requestId
  );
  if (!userProfile) {
    throw new Error(PROFILE_NOT_FOUND);
  }
  if (!userProfile.education) {
    logger.error(`[MONGO][${requestId}] No education found`);
    throw new Error(NO_EDUCATION);
  }

  // remove education
  const EducationIndex: number = userProfile.education.findIndex(
    (education) => education.id === educationId
  );
  if (EducationIndex === -1) {
    logger.error(
      `[MONGO][${requestId}] Education id {${educationId}} not found`
    );
    throw new Error(NO_EDUCATION);
  }
  logger.info(`[MONGO][${requestId}] Deleting education id {${educationId}}`);
  userProfile.education.splice(EducationIndex, 1);

  // save profile
  await saveOneDocumentFunc((userProfile as unknown) as Document);
  logger.info(`[MONGO][${requestId}] Education deleted`);
};

/**
 * Remove profile from database
 * @param userId User's id
 * @param requestId Id of the request
 */
export const removeProfile = async (
  userId: string,
  findOneProfileFunc: IFindOneProfile,
  deleteOneDocumentFunc: IDeleteOneDocument,
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | undefined = await findOneProfileFunc(
    { user: userId },
    requestId
  );
  if (!userProfile) {
    throw new Error(PROFILE_NOT_FOUND);
  }

  logger.info(`[MONGO][${requestId}] Deleting user profile`);
  await deleteOneDocumentFunc((userProfile as unknown) as Document);
  logger.info(`[MONGO][${requestId}] Profile deleted`);
};

/**
 * Remove user from database
 * @param userId User's id
 * @param requestId Id of the request
 */
export const removeUser = async (
  userId: string,
  findOneUserFunc: IFindOneUser,
  deleteOneDocumentFunc: IDeleteOneDocument,
  requestId: string
): Promise<void> => {
  const user: IUser | undefined = await findOneUserFunc(
    { _id: userId },
    requestId
  );
  if (!user) {
    throw new Error(USER_NOT_FOUND);
  }

  logger.info(`[MONGO][${requestId}] Deleting user`);
  await deleteOneDocumentFunc((user as unknown) as Document);
  logger.info(`[MONGO][${requestId}] User deleted`);
};

/**
 * Remove profile and user from database
 * @param userId User's id
 * @param requestId Id of the request
 */
export const removeProfileAndUser = async (
  userId: string,
  findOneProfileFunc: IFindOneProfile,
  findOneUserFunc: IFindOneUser,
  deleteOneDocumentFunc: IDeleteOneDocument,
  requestId: string
): Promise<void> => {
  await removeProfile(
    userId,
    findOneProfileFunc,
    deleteOneDocumentFunc,
    requestId
  );
  await removeUser(userId, findOneUserFunc, deleteOneDocumentFunc, requestId);
};

/**
 * Save new user into Database
 * @param user - New user
 * @param requestId Id of the request
 */
export const insertUser = async (
  user: IUser,
  findOneUserFunc: IFindOneUser,
  saveOneUserFunc: ISaveOneDocument,
  requestId: string
): Promise<IUser> => {
  // query user
  const { name, email, password, avatar, date } = user;
  logger.info(`[MONGO][${requestId}] Querying email {${email}}`);
  const existingUser: IUser | undefined = await findOneUserFunc(
    { email: email },
    requestId
  );
  if (existingUser) {
    logger.error(`[MONGO][${requestId}] Email already exists`);
    throw new Error(USER_EXISTS);
  }

  // save user
  const hashedPassword: string = await hashPassword(password);
  const newUser: Document = new User({
    name,
    email,
    avatar,
    password: hashedPassword,
    date,
  });
  logger.info(`[MONGO][${requestId}] Saving new user`);
  await saveOneUserFunc(newUser);
  logger.info(`[MONGO][${requestId}] User Saved`);
  return (newUser as unknown) as IUser;
};

/**
 * Save new Profile
 * @param userId User's id
 * @param fields profile fields
 * @param requestId Id of the request
 */
export const insertProfile = async (
  profile: IProfile,
  findOneProfileFunc: IFindOneProfile,
  saveOneDocumentFunc: ISaveOneDocument,
  requestId: string
): Promise<void> => {
  // check profile id
  const existingProfile: IProfile | undefined = await findOneProfileFunc(
    { user: profile.user },
    requestId
  );
  if (existingProfile) {
    logger.error(`[MONGO][${requestId}] ${PROFILE_EXISTS}`);
    throw new Error(PROFILE_EXISTS);
  }

  // check handle
  const existingHandle: IProfile | undefined = await findOneProfileFunc(
    { handle: profile.handle },
    requestId
  );
  if (existingHandle) {
    logger.error(`[MONGO][${requestId}] ${PROFILE_HANDLE_EXISTS}`);
    throw new Error(PROFILE_HANDLE_EXISTS);
  }

  // save profile
  logger.info(`[MONGO][${requestId}] Saving new profile`);
  const newProfile: Document = new Profile(profile);
  await saveOneDocumentFunc(newProfile);
  logger.info(`[MONGO][${requestId}] Profile saved`);
};
