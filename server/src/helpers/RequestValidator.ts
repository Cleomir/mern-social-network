import Joi, { ValidationResult } from "@hapi/joi";
import IPost from "../interfaces/IPost";

export default class RequestValidator {
  private static idPattern = Joi.string()
    .pattern(/^[0-9a-f]{24}$/, "id")
    .required();
  private static userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({}).required(),
    password: Joi.string().min(8).max(20).required(),
  })
    .with("name", ["email", "password"])
    .with("email", "password");
  private static postSchema = Joi.object({
    userId: RequestValidator.idPattern,
    postId: RequestValidator.idPattern,
    avatar: Joi.string(),
    name: Joi.string().min(1),
    text: Joi.string().min(1).required(),
  }).with("postId", "userId");

  public static validateNewUser(
    name: string,
    email: string,
    password: string
  ): ValidationResult {
    return this.userSchema.validate({ name, email, password });
  }

  public static validateLogin(
    email: string,
    password: string
  ): ValidationResult {
    return this.userSchema.validate({ email, password });
  }

  public static validateNewPost(post: IPost): ValidationResult {
    return this.postSchema.validate(post);
  }

  public static validateDeleteComment(postId: string, commentId: string) {
    return this.postSchema.validate({ postId, commentId });
  }

  public static validateId(id: string): ValidationResult {
    return this.idPattern.validate(id);
  }
}
