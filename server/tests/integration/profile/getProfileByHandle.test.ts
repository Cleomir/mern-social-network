import request, { Response } from "supertest";
import Chance from "chance";

import app from "../../../src/App";
import * as queries from "../../../src/database/dbDirectCalls";
import createProfileMock from "../../helpers/createProfileMock";
import { INTERNAL_SERVER_ERROR } from "../../../src/config/customErrorMessages";

describe("Test GET /profiles/handle/:handle path", () => {
  const chance = new Chance();

  test("It should query a profile by handle and return status 200 ", async () => {
    const handle = chance.string({ alpha: true });
    const profileMock = createProfileMock();
    const findOneProfileMock = jest.spyOn(queries, "findOneProfile");
    findOneProfileMock.mockImplementation(async () => profileMock);

    const response: Response = await request(app)
      .get(`/profiles/handle/${handle}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOneProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    findOneProfileMock.mockRestore();
  });

  test("It should return status 400 if handle is invalid ", async () => {
    const handle = chance.integer();

    const response: Response = await request(app)
      .get(`/profiles/handle/${handle}`)
      .set("Content-type", "application/json")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the handle pattern/);
  });

  test("It should return status 404 if profile is not found ", async () => {
    const handle = chance.string({ alpha: true });
    const findOneProfileMock = jest.spyOn(queries, "findOneProfile");
    findOneProfileMock.mockImplementation();

    const response: Response = await request(app)
      .get(`/profiles/handle/${handle}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOneProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    findOneProfileMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs ", async () => {
    const handle = chance.string({ alpha: true });
    const findOneProfileMock = jest.spyOn(queries, "findOneProfile");
    findOneProfileMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .get(`/profiles/handle/${handle}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOneProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    findOneProfileMock.mockRestore();
  });
});
