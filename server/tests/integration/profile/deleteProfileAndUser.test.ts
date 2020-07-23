import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import { signJWT } from "../../../src/authentication/jwt";
import * as queries from "../../../src/database/queries";

describe("Test DELETE /profiles path", () => {
  const chance = new Chance();

  test("It should delete a profile and user, and return status 200", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const removeProfileAndUserMock = jest.spyOn(
      queries,
      "removeProfileAndUser"
    );
    removeProfileAndUserMock.mockImplementation();

    const response: Response = await request(app)
      .delete("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(removeProfileAndUserMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    removeProfileAndUserMock.mockRestore();
  });
});
