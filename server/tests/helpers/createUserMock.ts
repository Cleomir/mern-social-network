import Chance from "chance";

import IUser from "../../src/interfaces/IUser";

const createUserMock = (): IUser => {
  const chance = new Chance();

  return {
    name: chance.name(),
    avatar: chance.url(),
    date: new Date(),
    email: chance.email(),
    password: chance.string(),
  };
};

export default createUserMock;
