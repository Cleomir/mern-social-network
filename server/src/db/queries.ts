import { Document } from "mongoose";

import User from "./models/User";
import Profile from "./models/Profile";
import IUser from "../interfaces/IUser";
import hashPassword from "../helpers/hashPassword";
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
} from "../config/custom-error-messages";
import IExperience from "../interfaces/IExperience";
import IEducation from "../interfaces/IEducation";
import IPost from "../interfaces/IPost";
import Post from "./models/Post";
import IComment from "../interfaces/IComment";

/**
 * Add or append new education
 * @param userId User's id
 * @param education Education
 */
export const addEducationToProfile = async (
  userId: string,
  education: IEducation[]
) => {
  try {
    const userProfile: IProfile | null = await findProfileById(userId);

    if (!userProfile) {
      throw new Error(USER_NOT_FOUND);
    }

    // check if user already has experience
    userProfile.education
      ? (userProfile.education = [...education, ...userProfile.education])
      : (userProfile.education = [...education]);

    return ((userProfile as unknown) as Document).save();
  } catch (error) {
    throw error;
  }
};

/**
 * Add or append new work experience
 * @param userId User's id
 * @param experience Work experience
 */
export const addExperienceToProfile = async (
  userId: string,
  experience: IExperience[]
) => {
  try {
    const userProfile: IProfile | null = await findProfileById(userId);

    if (!userProfile) {
      throw new Error(USER_NOT_FOUND);
    }

    // check if user already has experience
    userProfile.experience
      ? (userProfile.experience = [...experience, ...userProfile.experience])
      : (userProfile.experience = [...experience]);

    return ((userProfile as unknown) as Document).save();
  } catch (error) {
    throw error;
  }
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
  try {
    const post: IPost | null = await findPostById(postId);

    if (!post) {
      throw new Error(POST_NOT_FOUND);
    }

    // check post ownership
    if (post.user.toString() !== userId) {
      throw new Error(FORBIDDEN_OPERATION);
    }

    return ((post as unknown) as Document).remove();
  } catch (error) {
    throw error;
  }
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
  try {
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
  } catch (error) {
    throw error;
  }
};

/**
 * Unlike a post
 * @param userId User ID
 * @param postId Post ID
 */
export const RemoveLikeFromPost = async (
  userId: string,
  postId: string
): Promise<Document> => {
  try {
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
    }

    if (userIdIndex === -1) {
      throw new Error(POST_NOT_LIKED);
    }

    post.likes!.splice(userIdIndex, 1);

    return ((post as unknown) as Document).save();
  } catch (error) {
    throw error;
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
  try {
    const post: IPost | null = await findPostById(postId);

    if (!post) {
      throw new Error(POST_NOT_FOUND);
    }

    // add comment to array
    post.comments?.unshift(comment);

    return ((post as unknown) as Document).save();
  } catch (error) {
    throw error;
  }
};

export const removeCommentFromPost = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<Document> => {
  try {
    const post: IPost | null = await findPostById(postId);

    if (!post) {
      throw new Error(POST_NOT_FOUND);
    }

    // check if user has commented the post
    let commentIndex = -1;
    if (post.comments) {
      commentIndex = post.comments.findIndex(
        (comment) =>
          comment._id!.toString() === commentId &&
          comment.user.toString() === userId
      );
    }

    if (commentIndex === -1) {
      throw new Error(FORBIDDEN_OPERATION);
    }

    post.comments!.splice(commentIndex, 1);

    return ((post as unknown) as Document).save();
  } catch (error) {
    throw error;
  }
};

/**
 * Remove work experience
 * @param userId User's id
 * @param experience Work experience
 */
export const removeExperienceFromProfile = async (
  userId: string,
  experienceId: string
) => {
  try {
    const userProfile: IProfile | null = await findProfileById(userId);

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
  } catch (error) {
    throw error;
  }
};

/**
 * Remove education
 * @param userId User's id
 * @param experience Work experience
 */
export const removeEducationFromProfile = async (
  userId: string,
  educationId: string
) => {
  try {
    const userProfile: IProfile | null = await findProfileById(userId);

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
  } catch (error) {
    throw error;
  }
};

/**
 * Remove profile from database
 * @param userId User's id
 */
export const removeProfile = async (userId: string) => {
  try {
    const userProfile: IProfile | null = await findProfileById(userId);

    if (!userProfile) {
      throw new Error(USER_NOT_FOUND);
    }

    return ((userProfile as unknown) as Document).remove();
  } catch (error) {
    throw error;
  }
};

/**
 * Remove user from database
 * @param userId User's id
 */
export const removeUser = async (userId: string) => {
  try {
    const user: IUser | null = await findUserById(userId);

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    return ((user as unknown) as Document).remove();
  } catch (error) {
    throw error;
  }
};

/**
 * Remove profile and user from database
 * @param userId User's id
 */
export const removeProfileAndUser = async (userId: string): Promise<void> => {
  try {
    await removeProfile(userId);
    await removeUser(userId);
  } catch (error) {
    throw error;
  }
};

/**
 * Query user by id
 * @param email - User's email
 */
export const findUserById = async (id: string): Promise<IUser | null> => {
  return (User.findOne({ _id: id }) as unknown) as IUser;
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
 */
export const findProfileById = async (id: string): Promise<IProfile | null> => {
  return (Profile.findOne({ user: id }).populate("user", [
    "name",
    "avatar",
  ]) as unknown) as IProfile;
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
 */
export const insertUser = async (user: IUser): Promise<IUser> => {
  const { name, email, password, avatar, date } = user;
  const existingUser: Document | null = await User.findOne({ email: email });

  if (existingUser) {
    throw new Error(USER_EXISTS);
  }

  const hashedPassword: string = await hashPassword(password);
  const newUser: Document = new User({
    name,
    email,
    avatar,
    password: hashedPassword,
    date,
  });

  await newUser.save();

  return (newUser as unknown) as IUser;
};

/**
 * Save new Profile
 * @param userId User's id
 * @param fields profile fields
 */
export const insertProfile = async (profile: IProfile) => {
  try {
    const existingProfile: IProfile | null = await findProfileById(
      profile.user
    );
    if (existingProfile) {
      throw new Error(PROFILE_EXISTS);
    }

    const existingHandle: IProfile | null = await findProfileByHandle(
      profile.handle
    );
    if (existingHandle) {
      throw new Error(PROFILE_HANDLE_EXISTS);
    }

    const newProfile: Document = new Profile(profile);

    return newProfile.save();
  } catch (error) {
    throw error;
  }
};
