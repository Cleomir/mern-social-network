import Chance from "chance";
import IComment from "../../src/interfaces/IComment";

const createCommentMock = (commentId: string, userId: string): IComment => {
  const chance = new Chance();
  return {
    _id: commentId,
    avatar: chance.url(),
    name: chance.name(),
    text: chance.string(),
    user: userId,
  };
};

export default createCommentMock;
