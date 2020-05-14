import bcrypt from "bcryptjs";

/**
 * Compare user password with hashed password
 * @param password - User's password
 */
const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export default comparePassword;
