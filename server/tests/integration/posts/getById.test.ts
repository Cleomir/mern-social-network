import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import * as queries from "../../../src/database/dbDirectCalls";
import { INTERNAL_SERVER_ERROR } from "../../../src/config/customErrorMessages";
import createPostMock from "../../helpers/createPostMock";
import IPost from "../../../src/interfaces/IPost";

describe("Test GET /posts/:id", () => {
  const chance = new Chance();

  test("It should query a post by id and return status 200", async () => {
    const postId: string = chance.hash({ length: 24 });
    const postMock: IPost = createPostMock(postId, uuid());
    const findOnePostMock = jest.spyOn(queries, "findOnePost");
    findOnePostMock.mockImplementation(async () => postMock);

    const response: Response = await request(app)
      .get(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOnePostMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    findOnePostMock.mockRestore();
  });

  test("It should return status 400 if post id is invalid", async () => {
    const postId: string = chance.string({
      alpha: true,
      numeric: true,
      symbols: false,
    });

    const response: Response = await request(app)
      .get(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 404 if post is not found", async () => {
    const postId: string = chance.hash({ length: 24 });
    const findOnePostMock = jest.spyOn(queries, "findOnePost");
    findOnePostMock.mockImplementation(async () => undefined);

    const response: Response = await request(app)
      .get(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOnePostMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    findOnePostMock.mockRestore();
  });

  test("It should return status 500 if any error occurs", async () => {
    const postId: string = chance.hash({ length: 24 });
    const findOnePostMock = jest.spyOn(queries, "findOnePost");
    findOnePostMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .get(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .send();

    expect(findOnePostMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    findOnePostMock.mockRestore();
  });
});
