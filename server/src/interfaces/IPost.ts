export default interface IPost {
  avatar?: string;
  name?: string;
  text: string;
  user: string;
  likes?: { _id?: string; user: string }[];
  comments?: string[];
}
