import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import { signJWT } from "../../../src/authentication/jwt";
import createProfileMock from "../../helpers/createProfileMock";
import * as queries from "../../../src/database/queries";
import IProfile from "../../../src/interfaces/IProfile";

describe("Test /profiles path", () => {
  const chance = new Chance();

  test("It should create a profile and return status 200", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const insertProfileMock = jest.spyOn(queries, "insertProfile");
    insertProfileMock.mockImplementation();

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
      });

    expect(insertProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    insertProfileMock.mockRestore();
  });

  test("It should return status 401 if user is not authenticated", async () => {
    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .send();

    expect(response.status).toBe(401);
  });

  test("It should return status 400 if handle is undefined", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        handle: undefined,
      });

    expect(response.status).toBe(400);
  });
});
