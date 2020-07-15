import Chance from "chance";
import IPost from "../../src/interfaces/IPost";

const createPostMock = (postId: string): IPost => {
  const chance = new Chance();

  return {
    _id: postId,
    avatar: chance.url(),
    name: chance.string(),
    text: chance.string(),
    user: chance.name(),
  };
};

export default createPostMock;
