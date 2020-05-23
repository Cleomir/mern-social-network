import IComment from "./IComment";

export default interface IPost extends IComment {
  likes?: { _id?: string; user: string }[];
  comments?: IComment[];
}
