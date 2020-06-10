import Joi, { ValidationResult } from "@hapi/joi";
import IPost from "../interfaces/IPost";
import IComment from "../interfaces/IComment";

export default class RequestValidator {
  // validation rules
  private static avatarPattern = Joi.string();
  private static emailPattern = Joi.string().email();
  private static idPattern = Joi.string()
    .pattern(/^[0-9a-f]{24}$/, "id")
    .required();
  private static namePattern = Joi.string().min(2);
  private static passwordPattern = Joi.string().min(8).max(20);
  private static textPattern = Joi.string().min(1);

  public static validateNewUser(
    name: string,
    email: string,
    password: string
  ): ValidationResult {
    return Joi.object({
      name: this.namePattern.required(),
      email: this.emailPattern.required(),
      password: this.passwordPattern.required(),
    }).validate({ name, email, password });
  }

  public static validateLogin(
    email: string,
    password: string
  ): ValidationResult {
    return Joi.object({
      email: this.emailPattern.required(),
      password: this.passwordPattern.required(),
    }).validate({ email, password });
  }

  public static validateNewPostOrComment(
    post: IPost | IComment
  ): ValidationResult {
    return Joi.object({
      avatar: this.avatarPattern,
      user: this.idPattern.required(),
      test: this.textPattern.required(),
      name: this.namePattern,
    }).validate(post);
  }

  public static validateDeleteComment(postId: string, commentId: string) {
    return Joi.object({
      postId: this.idPattern.required(),
      commentId: this.idPattern.required(),
    }).validate({ postId, commentId });
  }

  public static validateId(id: string): ValidationResult {
    return this.idPattern.validate(id);
  }
}
