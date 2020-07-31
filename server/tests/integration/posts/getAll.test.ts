import request, { Response } from "supertest";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import * as queries from "../../../src/database/dbDirectCalls";
import { INTERNAL_SERVER_ERROR } from "../../../src/config/customErrorMessages";
import createPostMock from "../../helpers/createPostMock";
import IPost from "../../../src/interfaces/IPost";

describe("Test GET /posts", () => {
  test("It should query all posts and return status 200", async () => {
    const findAllPostsMock = jest.spyOn(queries, "findAllPosts");
    const postMock: IPost = createPostMock(uuid(), uuid());
    findAllPostsMock.mockImplementation(async () => [postMock]);

    const response: Response = await request(app)
      .get(`/posts`)
      .set("Content-type", "application/json")
      .send();

    expect(findAllPostsMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    findAllPostsMock.mockRestore();
  });

  test("It should return status 204 if there are no posts", async () => {
    const findAllPostsMock = jest.spyOn(queries, "findAllPosts");
    findAllPostsMock.mockImplementation(async () => []);

    const response: Response = await request(app)
      .get(`/posts`)
      .set("Content-type", "application/json")
      .send();

    expect(findAllPostsMock).toHaveBeenCalled();
    expect(response.status).toBe(204);
    findAllPostsMock.mockRestore();
  });

  test("It should return status 500 if any error occurs", async () => {
    const findAllPostsMock = jest.spyOn(queries, "findAllPosts");
    findAllPostsMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .get(`/posts`)
      .set("Content-type", "application/json")
      .send();

    expect(findAllPostsMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    findAllPostsMock.mockRestore();
  });
});
