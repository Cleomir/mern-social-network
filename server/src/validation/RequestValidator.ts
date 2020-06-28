import Joi, { ValidationResult } from "@hapi/joi";
import IPost from "../interfaces/IPost";
import IComment from "../interfaces/IComment";
import IProfile from "../interfaces/IProfile";
import IExperience from "../interfaces/IExperience";
import IEducation from "../interfaces/IEducation";

export default class RequestValidator {
  // validation rules
  private static emailPattern = Joi.string().email();
  private static idPattern = Joi.string()
    .pattern(/^[0-9a-f]{24}$/, "id")
    .required();
  private static namePattern = Joi.string().min(2);
  private static passwordPattern = Joi.string().min(8).max(20);
  private static experiencePattern = Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string(),
    from: Joi.date().required(),
    to: Joi.date().greater(Joi.ref("from")).less("now"),
    current: Joi.boolean().required(),
    description: Joi.string(),
  });
  private static educationPattern = Joi.object({
    school: Joi.string().required(),
    degree: Joi.string().required(),
    field_of_study: Joi.string(),
    from: Joi.date().required(),
    to: Joi.date().greater(Joi.ref("from")).less("now"),
    current: Joi.boolean().required(),
    description: Joi.string(),
  });
  private static socialPattern = Joi.object({
    youtube: Joi.string(),
    twitter: Joi.string(),
    facebook: Joi.string(),
    linkedin: Joi.string(),
    instagram: Joi.string(),
  });

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
      avatar: Joi.string(),
      user: this.idPattern.required(),
      test: Joi.string().min(1),
      name: this.namePattern,
    }).validate(post);
  }

  public static validateDeleteComment(
    postId: string,
    commentId: string
  ): Joi.ValidationResult {
    return Joi.object({
      postId: this.idPattern.required(),
      commentId: this.idPattern.required(),
    }).validate({ postId, commentId });
  }

  public static validateId(id: string): ValidationResult {
    return this.idPattern.validate(id);
  }

  public static validateCreateProfile(profile: IProfile): Joi.ValidationResult {
    return Joi.object({
      user: this.idPattern.required(),
      handle: Joi.string().max(40).required(),
      company: Joi.string(),
      website: Joi.string(),
      location: Joi.string(),
      status: Joi.string().required(),
      skills: Joi.array().items(Joi.string()).min(1).max(50).required(),
      bio: Joi.string(),
      github_username: Joi.string(),
      experience: Joi.array().items(this.experiencePattern).max(10),
      education: Joi.array().items(this.educationPattern).max(5),
      social: this.socialPattern,
    }).validate(profile);
  }

  public static validateExperience(
    user: string,
    experience: IExperience
  ): Joi.ValidationResult {
    return Joi.object({
      user: this.idPattern.required(),
      experience: Joi.array().items(this.experiencePattern).min(1).required(),
    }).validate({ user, experience });
  }

  public static validateEducation(
    user: string,
    education: IEducation
  ): Joi.ValidationResult {
    return Joi.object({
      user: this.idPattern.required(),
      education: Joi.array().items(this.educationPattern).min(1).required(),
    }).validate({ user, education });
  }
}
