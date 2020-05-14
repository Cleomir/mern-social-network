import bcrypt from "bcryptjs";

/**
 * Hash plain text password
 * @param password - User's password
 */
const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
};

export default hashPassword;
