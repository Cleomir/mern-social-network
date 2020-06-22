import bcrypt from "bcryptjs";

export default class PasswordHandler {
  /**
   * Compare user password with hashed password
   * @param password - User's password
   */
  public static async compare(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
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
