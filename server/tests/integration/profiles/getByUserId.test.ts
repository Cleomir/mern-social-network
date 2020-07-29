import request, { Response } from "supertest";
import Chance from "chance";

import app from "../../../src/App";
import * as queries from "../../../src/database/dbDirectCalls";
import createProfileMock from "../../helpers/createProfileMock";
import { INTERNAL_SERVER_ERROR } from "../../../src/config/customErrorMessages";

describe("Test GET /profiles/:user_id path", () => {
  const chance = new Chance();

  test("It should query a profile by id and return status 200 ", async () => {
    const userId = chance.hash({ length: 24 });
    const profileMock = createProfileMock();
    const findOneProfileMock = jest.spyOn(queries, "findOneProfile");
    findOneProfileMock.mockImplementation(async () => profileMock);

    const response: Response = await request(app)
      .get(`/profiles/${userId}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOneProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    findOneProfileMock.mockRestore();
  });

  test("It should return status 400 if handle is invalid ", async () => {
    const userId = chance.integer();

    const response: Response = await request(app)
      .get(`/profiles/${userId}`)
      .set("Content-type", "application/json")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 404 if profile is not found ", async () => {
    const userId = chance.hash({ length: 24 });
    const findOneProfileMock = jest.spyOn(queries, "findOneProfile");
    findOneProfileMock.mockImplementation();

    const response: Response = await request(app)
      .get(`/profiles/${userId}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOneProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    findOneProfileMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs ", async () => {
    const userId = chance.hash({ length: 24 });
    const findOneProfileMock = jest.spyOn(queries, "findOneProfile");
    findOneProfileMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .get(`/profiles/${userId}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOneProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    findOneProfileMock.mockRestore();
  });
});
