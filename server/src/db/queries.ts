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
): Promise<Document> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
  if (!userProfile) {
    throw new Error(USER_NOT_FOUND);
  }

  // check if user already has experience
  userProfile.education
    ? (userProfile.education = [...education, ...userProfile.education])
    : (userProfile.education = [...education]);

  return ((userProfile as unknown) as Document).save();
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
): Promise<Document> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
  if (!userProfile) {
    throw new Error(USER_NOT_FOUND);
  }

  // check if user already has experience
  userProfile.experience
    ? (userProfile.experience = [...experience, ...userProfile.experience])
    : (userProfile.experience = [...experience]);

  return ((userProfile as unknown) as Document).save();
};

/**
 * Create a post
 * @param post Post to be created
 */
export const addPost = async (post: IPost): Promise<Document> => {
  return new Post(post).save();
};

/**
 * Query all posts in descending order
 */
export const findAllPosts = async (): Promise<Document[]> => {
  return Post.find().sort({ date: -1 });
};

/**
 * Query single post by ID
 * @param postId Post ID
 */
export const findPostById = async (postId: string): Promise<IPost | null> => {
  return (Post.findById(postId) as unknown) as IPost;
};

/**
 * Query single post by ID
 * @param postId Post ID
 */
export const removePost = async (
  userId: string,
  postId: string
): Promise<Document> => {
  const post: IPost | null = await findPostById(postId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // check post ownership
  if (post.user.toString() !== userId) {
    throw new Error(FORBIDDEN_OPERATION);
  }

  return ((post as unknown) as Document).remove();
};

/**
 * Like a post
 * @param userId User ID
 * @param postId Post ID
 */
export const addLikeToPost = async (
  userId: string,
  postId: string
): Promise<Document> => {
  const post: IPost | null = await findPostById(postId);
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
    throw new Error(POST_ALREADY_LIKED);
  }

  post.likes?.unshift({ user: userId });
  return ((post as unknown) as Document).save();
};

/**
 * Unlike a post
 * @param userId User ID
 * @param postId Post ID
 */
export const RemoveLikeFromPost = async (
  userId: string,
  postId: string
): Promise<Document | undefined> => {
  const post: IPost | null = await findPostById(postId);
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
      throw new Error(POST_NOT_LIKED);
    }

    post.likes.splice(userIdIndex, 1);
    return ((post as unknown) as Document).save();
  }
};

/**
 * Add comment to a post
 * @param postId Post ID
 * @param comment Comment to add
 */
export const addCommentToPost = async (
  postId: string,
  comment: IComment
): Promise<Document> => {
  const post: IPost | null = await findPostById(postId);
  if (!post) {
    throw new Error(POST_NOT_FOUND);
  }

  // add comment to array
  post.comments?.unshift(comment);
  return ((post as unknown) as Document).save();
};

export const removeCommentFromPost = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<Document | undefined> => {
  const post: IPost | null = await findPostById(postId);
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
      throw new Error(FORBIDDEN_OPERATION);
    }

    post.comments.splice(commentIndex, 1);
    return ((post as unknown) as Document).save();
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
): Promise<Document> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
  if (!userProfile) {
    throw new Error(USER_NOT_FOUND);
  }
  if (!userProfile.experience) {
    throw new Error(NO_EXPERIENCE);
  }

  const ExperienceIndex: number = userProfile.experience.findIndex(
    (experience) => experience.id === experienceId
  );
  if (ExperienceIndex === -1) {
    throw new Error(NO_EXPERIENCE);
  }

  userProfile.experience.splice(ExperienceIndex, 1);
  return ((userProfile as unknown) as Document).save();
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
): Promise<Document> => {
  const userProfile: IProfile | null = await findProfileById(userId, requestId);
  if (!userProfile) {
    throw new Error(USER_NOT_FOUND);
  }
  if (!userProfile.education) {
    throw new Error(NO_EDUCATION);
  }

  const EducationIndex: number = userProfile.education.findIndex(
    (education) => education.id === educationId
  );
  if (EducationIndex === -1) {
    throw new Error(NO_EDUCATION);
  }

  userProfile.education.splice(EducationIndex, 1);
  return ((userProfile as unknown) as Document).save();
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
  logger.info(`[MONGO][${requestId}] Querying user`);
  const user: Document | null = await User.findOne({ email });
  if (!user) {
    logger.info(`[MONGO][${requestId}] ${USER_NOT_FOUND}`);
    return;
  }

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

  return (user as unknown) as IUser;
};

/**
 * Query all profiles
 */
export const findAllProfiles = async (): Promise<IProfile[] | null> => {
  return (Profile.find().populate("user", [
    "name",
    "avatar",
  ]) as unknown) as IProfile[];
};

/**
 * Query profile by ID
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
 */
export const findProfileByHandle = async (
  handle: string
): Promise<IProfile | null> => {
  return (Profile.findOne({ handle }).populate("user", [
    "name",
    "avatar",
  ]) as unknown) as IProfile;
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
  const { name, email, password, avatar, date } = user;
  logger.info(`[MONGO][${requestId}] Querying email {${email}}`);
  const existingUser: Document | null = await User.findOne({ email: email });

  if (existingUser) {
    logger.error(`[MONGO][${requestId}] Email already exists`);
    throw new Error(USER_EXISTS);
  }

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
  const existingHandle: IProfile | null = await findProfileByHandle(
    profile.handle
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
