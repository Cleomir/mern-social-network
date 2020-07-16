import Chance from "chance";
import IPost from "../../src/interfaces/IPost";

const createPostMock = (postId: string, userId: string): IPost => {
  const chance = new Chance();

  return {
    _id: postId,
    avatar: chance.url(),
    name: chance.string(),
    text: chance.string(),
    user: userId,
  };
};

export default createPostMock;
