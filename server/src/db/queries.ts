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
} from "../config/custom-error-messages";
import IExperience from "../interfaces/IExperience";
import IEducation from "../interfaces/IEducation";

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
    const currentEducation = userProfile.education
      ? [...education, ...userProfile.education]
      : [...education];

    return updateProfile(userId, { education: currentEducation });
  } catch (error) {
    throw error;
  }
};

/**
 * Add or append new working experience
 * @param userId User's id
 * @param experience Working experience
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
    const currentExperience = userProfile.experience
      ? [...experience, ...userProfile.experience]
      : [...experience];

    return updateProfile(userId, { experience: currentExperience });
  } catch (error) {
    throw error;
  }
};

/**
 * Query user by email
 * @param email - User's email
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return (User.findOne({ email }) as unknown) as IUser;
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
export const insertUser = async (
  user: IUser
): Promise<Document | undefined> => {
  try {
    const { name, email, password, avatar, date } = user;
    const existingUser = await findUserByEmail(user.email);

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

    return newUser.save();
  } catch (error) {
    throw error;
  }
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

export const updateProfile = async (userId: string, fields: object) => {
  return (Profile.findOneAndUpdate(
    { user: userId },
    { $set: fields }
  ) as unknown) as IProfile;
};
