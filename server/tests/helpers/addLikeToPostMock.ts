import IPost from "../../src/interfaces/IPost";

import Chance from "chance";

const addLikeToPostMock = (post: IPost, userId: string): IPost => {
  const chance = new Chance();
  post.likes = [{ _id: chance.guid({ version: 4 }), user: userId }];

  return post;
};

export default addLikeToPostMock;
