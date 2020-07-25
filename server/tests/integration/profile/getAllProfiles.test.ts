import request, { Response } from "supertest";

import app from "../../../src/App";
import * as queries from "../../../src/database/dbDirectCalls";
import createProfileMock from "../../helpers/createProfileMock";
import { INTERNAL_SERVER_ERROR } from "../../../src/config/customErrorMessages";

describe("Test GET /profiles/ path", () => {
  test("It should query all user profiles and return status 200 ", async () => {
    const profileMock = createProfileMock();
    const findAllProfilesMock = jest.spyOn(queries, "findAllProfiles");
    findAllProfilesMock.mockImplementation(async () => [profileMock]);

    const response: Response = await request(app)
      .get("/profiles/")
      .set("Content-type", "application/json")
      .send();

    expect(findAllProfilesMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    findAllProfilesMock.mockRestore();
  });

  test("It should return status 204 if no profile is found ", async () => {
    const findAllProfilesMock = jest.spyOn(queries, "findAllProfiles");
    findAllProfilesMock.mockImplementation();

    const response: Response = await request(app)
      .get("/profiles/")
      .set("Content-type", "application/json")
      .send();

    expect(findAllProfilesMock).toHaveBeenCalled();
    expect(response.status).toBe(204);
    findAllProfilesMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs", async () => {
    const findAllProfilesMock = jest.spyOn(queries, "findAllProfiles");
    findAllProfilesMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .get("/profiles/")
      .set("Content-type", "application/json")
      .send();

    expect(findAllProfilesMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    findAllProfilesMock.mockRestore();
  });
});
