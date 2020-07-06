import Chance from "chance";

import IUser from "../../../src/interfaces/IUser";
import { insertUser } from "../../../src/database/queries";

describe("Test database/queries.ts file", () => {
  const chance = new Chance();

  test("happy path", async () => {
    const findUserMock = jest.fn();
    const saveUserMock = jest.fn();
    const user: IUser = {
      name: chance.name(),
      avatar: chance.url(),
      date: new Date(),
      email: chance.email(),
      password: chance.string(),
    };

    await insertUser(
      user,
      findUserMock,
      saveUserMock,
      chance.guid({ version: 4 })
    );

    expect(findUserMock).toHaveBeenCalledWith({ email: user.email });
    expect(saveUserMock).toHaveBeenCalled();
  });
});
