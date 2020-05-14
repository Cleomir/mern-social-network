import User from "./models/User";

import IUser from "../interfaces/IUser";
import hashPassword from "../helpers/hashPassword";
import { Document } from "mongoose";

/**
 * Query user by email
 * @param email - User's email
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return (User.findOne({ email }) as unknown) as IUser;
};

/**
 * Save new user into Database
 * @param user - New user
 */
export const insertNewUser = async (
  user: IUser
): Promise<Document | undefined> => {
  try {
    const { name, email, password, avatar, date } = user;
    const existingUser = await findUserByEmail(user.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword: string = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      avatar,
      password: hashedPassword,
      date,
    });

    return await newUser.save();
  } catch (error) {
    throw error;
  }
};
