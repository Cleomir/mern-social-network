import bcrypt from "bcryptjs";
import logger from "../../logger";

export default class PasswordHandler {
  /**
   * Compare user password with hashed password
   * @param password - User's password
   */
  public static async compare(
    plainPassword: string,
    hashedPassword: string,
    requestId: string
  ): Promise<boolean> {
    const match: boolean = await bcrypt.compare(plainPassword, hashedPassword);
    if (!match) {
      logger.info(`[BCRYPT][${requestId}] Password doesn't match`);
    }
    logger.info(`[BCRYPT][${requestId}] Password matches`);
    return match;
  }

  /**
   * Hash plain text password
   * @param password - User's password
   */
  public static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
