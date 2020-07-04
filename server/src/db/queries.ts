import { Document } from "mongoose";

import User from "./models/User";
import Profile from "./models/Profile";
import IUser from "../interfaces/IUser";
import PasswordHandler from "../authentication/password";
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

/**
 * Add or append new education
 * @param userId User's id
 * @param education Education
 * @param requestId Id of the request
 */
export const addEducationToProfile = async (
  userId: string,
  education: IEducation[],
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
  if (!userProfile) {
    throw new Error(USER_NOT_FOUND);
  }

  // check if user already has experience
  userProfile.education
    ? (userProfile.education = [...education, ...userProfile.education])
    : (userProfile.education = [...education]);

  logger.info(`[MONGO][${requestId}] Saving new education`);
  await ((userProfile as unknown) as Document).save();
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
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
  if (!userProfile) {
    throw new Error(PROFILE_NOT_FOUND);
  }

  // check if user already has experience
  userProfile.experience
    ? (userProfile.experience = [...experience, ...userProfile.experience])
    : (userProfile.experience = [...experience]);

  logger.info(`[MONGO][${requestId}] Saving new experience`);
  await ((userProfile as unknown) as Document).save();
  logger.info(`[MONGO][${requestId}] Experience saved`);
};

/**
 * Create a post
 * @param post Post to be created
 * @param requestId Id of the request
 */
export const addPost = async (
  post: IPost,
  requestId: string
): Promise<void> => {
  logger.info(`[MONGO][${requestId}] Saving new post`);
  await new Post(post).save();
  logger.info(`[MONGO][${requestId}] Post saved`);
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

/**
 * Query single post by id
 * @param postId Post id
 * @param requestId Id of the request
 */
export const findPostById = async (
  postId: string,
  requestId: string
): Promise<IPost | undefined> => {
  logger.error(`[MONGO][${requestId}] Querying post id {${postId}}`);
  const post: Document | null = await Post.findById(postId);
  if (!post) {
    logger.error(`[MONGO][${requestId}] Post not found {${postId}}`);
    return;
  }
  logger.error(`[MONGO][${requestId}] Post found {${postId}}`);

  return (post as unknown) as IPost;
};

/**
 * Query single post by id
 * @param postId Post id
 * @param requestId Id of the request
 */
export const removePost = async (
  userId: string,
  postId: string,
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findPostById(postId, requestId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // check post ownership
  if (post.user.toString() !== userId) {
    logger.error(`[MONGO][${requestId}] Post doesn't belong to user`);
    throw new Error(FORBIDDEN_OPERATION);
  }

  logger.error(`[MONGO][${requestId}] Removing post id {${postId}}`);
  await ((post as unknown) as Document).remove();
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
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findPostById(postId, requestId);
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
  await ((post as unknown) as Document).save();
  logger.info(`[MONGO][${requestId}] Like added`);
};

/**
 * Unlike a post
 * @param userId User id
 * @param postId Post id
 * @param requestId Id of the request
 */
export const RemoveLikeFromPost = async (
  userId: string,
  postId: string,
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findPostById(postId, requestId);
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
    await ((post as unknown) as Document).save();
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
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findPostById(postId, requestId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // add post
  logger.info(`[MONGO][${requestId}] Saving comment`);
  post.comments?.unshift(comment);
  await ((post as unknown) as Document).save();
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
  requestId: string
): Promise<void> => {
  const post: IPost | undefined = await findPostById(postId, requestId);
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
    await ((post as unknown) as Document).save();
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
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
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
  await ((userProfile as unknown) as Document).save();
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
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
  if (!userProfile) {
    throw new Error(PROFILE_NOT_FOUND);
  }
  if (!userProfile.education) {
    logger.error(`[MONGO][${requestId}] No education found`);
    throw new Error(NO_EDUCATION);
  }

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
  await ((userProfile as unknown) as Document).save();
  logger.info(`[MONGO][${requestId}] Education deleted`);
};

/**
 * Remove profile from database
 * @param userId User's id
 * @param requestId Id of the request
 */
export const removeProfile = async (
  userId: string,
  requestId: string
): Promise<void> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
  if (!userProfile) {
    throw new Error(PROFILE_NOT_FOUND);
  }

  logger.info(`[MONGO][${requestId}] Deleting user profile`);
  await ((userProfile as unknown) as Document).remove();
  logger.info(`[MONGO][${requestId}] Profile deleted`);
};

/**
 * Remove user from database
 * @param userId User's id
 * @param requestId Id of the request
 */
export const removeUser = async (
  userId: string,
  requestId: string
): Promise<void> => {
  const user: IUser | undefined = await findUserById(userId, requestId);
  if (!user) {
    throw new Error(USER_NOT_FOUND);
  }

  logger.info(`[MONGO][${requestId}] Deleting user`);
  await ((user as unknown) as Document).remove();
  logger.info(`[MONGO][${requestId}] User deleted`);
};

/**
 * Remove profile and user from database
 * @param userId User's id
 * @param requestId Id of the request
 */
export const removeProfileAndUser = async (
  userId: string,
  requestId: string
): Promise<void> => {
  await removeProfile(userId, requestId);
  await removeUser(userId, requestId);
};

/**
 * Query user by email
 * @param email - User's email
 * @param requestId Id of the request
 */
export const findUserByEmail = async (
  email: string,
  requestId: string
): Promise<IUser | undefined> => {
  logger.info(`[MONGO][${requestId}] Querying user with email {${email}}`);
  const user: Document | null = await User.findOne({ email });
  if (!user) {
    logger.info(`[MONGO][${requestId}] User not found`);
    return;
  }
  logger.info(`[MONGO][${requestId}] User found`);

  return (user as unknown) as IUser;
};

/**
 * Query user by id
 * @param id - User's id
 * @param requestId Id of the request
 */
export const findUserById = async (
  id: string,
  requestId: string
): Promise<IUser | undefined> => {
  logger.info(`[MONGO][${requestId}] Querying user id {${id}}`);
  const user: Document | null = await User.findOne({ _id: id });
  if (!user) {
    logger.info(`[MONGO][${requestId}] User not found`);
    return;
  }
  logger.info(`[MONGO][${requestId}] User found`);

  return (user as unknown) as IUser;
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
 * Query profile by id
 * @param id User's id
 * @param requestId Id of the request
 */
export const findProfileById = async (
  id: string,
  requestId: string
): Promise<IProfile | null> => {
  logger.error(`[MONGO][${requestId}] Querying profile by id`);
  const profile: Document | null = await Profile.findOne({
    user: id,
  }).populate("user", ["name", "avatar"]);
  if (!profile) {
    logger.error(`[MONGO][${requestId}] Profile not found`);
  }
  logger.error(`[MONGO][${requestId}] Profile found`);

  return (profile as unknown) as IProfile;
};

/**
 * Query profile by handle
 * @param handle Url handle
 * @param requestId Id of the request
 */
export const findProfileByHandle = async (
  handle: string,
  requestId: string
): Promise<IProfile | undefined> => {
  logger.info(`[MONGO][${requestId}] Querying profile with handle {${handle}}`);
  const profile: Document | null = await Profile.findOne({
    handle,
  }).populate("user", ["name", "avatar"]);
  if (!profile) {
    logger.info(`[MONGO][${requestId}] No profile found`);
    return;
  }
  logger.info(`[MONGO][${requestId}] Profile found`);

  return (profile as unknown) as IProfile;
};

/**
 * Save new user into Database
 * @param user - New user
 * @param requestId Id of the request
 */
export const insertUser = async (
  user: IUser,
  requestId: string
): Promise<IUser> => {
  // query user
  const { name, email, password, avatar, date } = user;
  logger.info(`[MONGO][${requestId}] Querying email {${email}}`);
  const existingUser: Document | null = await User.findOne({ email: email });
  if (existingUser) {
    logger.error(`[MONGO][${requestId}] Email already exists`);
    throw new Error(USER_EXISTS);
  }

  // save user
  const hashedPassword: string = await PasswordHandler.hash(password);
  const newUser: Document = new User({
    name,
    email,
    avatar,
    password: hashedPassword,
    date,
  });
  logger.info(`[MONGO][${requestId}] Saving new user`);
  await newUser.save();
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
  requestId: string
): Promise<void> => {
  // check profile id
  const existingProfile: IProfile | null = await findProfileById(
    profile.user,
    requestId
  );
  if (existingProfile) {
    logger.error(`[MONGO][${requestId}] ${PROFILE_EXISTS}`);
    throw new Error(PROFILE_EXISTS);
  }

  // check handle
  const existingHandle: IProfile | undefined = await findProfileByHandle(
    profile.handle,
    requestId
  );
  if (existingHandle) {
    logger.error(`[MONGO][${requestId}] ${PROFILE_HANDLE_EXISTS}`);
    throw new Error(PROFILE_HANDLE_EXISTS);
  }

  // save profile
  logger.info(`[MONGO][${requestId}] Saving new profile`);
  const newProfile: Document = new Profile(profile);
  await newProfile.save();
  logger.info(`[MONGO][${requestId}] Profile saved`);
};
