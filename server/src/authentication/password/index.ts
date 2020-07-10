import bcrypt from "bcryptjs";
import logger from "../../logger";

/**
 * Compare user password with hashed password
 * @param password - User's password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
  requestId: string
): Promise<boolean> => {
  const match: boolean = await bcrypt.compare(plainPassword, hashedPassword);
  if (!match) {
    logger.info(`[BCRYPT][${requestId}] Password doesn't match`);
  }
  logger.info(`[BCRYPT][${requestId}] Password matches`);
  return match;
};

/**
 * Hash plain text password
 * @param password - User's password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
