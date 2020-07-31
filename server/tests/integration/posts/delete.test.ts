import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import * as queries from "../../../src/database/queries";
import {
  INTERNAL_SERVER_ERROR,
  POST_NOT_FOUND,
  FORBIDDEN_OPERATION,
} from "../../../src/config/customErrorMessages";
import { signJWT } from "../../../src/authentication/jwt";

describe("Test DELETE /posts/:id", () => {
  const chance = new Chance();

  test("It should delete a post and return status 200 ", async () => {
    const userId = chance.hash({ length: 24 });
    const postId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const deletePostMock = jest.spyOn(queries, "removePost");
    deletePostMock.mockImplementation();

    const response: Response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(deletePostMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    deletePostMock.mockRestore();
  });

  test("It should return status 400 if post id is invalid ", async () => {
    const userId = chance.hash({ length: 24 });
    const postId = uuid();
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 404 if post is not found ", async () => {
    const userId = chance.hash({ length: 24 });
    const postId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const deletePostMock = jest.spyOn(queries, "removePost");
    deletePostMock.mockImplementation(async () => {
      throw new Error(POST_NOT_FOUND);
    });

    const response: Response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(deletePostMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    deletePostMock.mockRestore();
  });

  test("It should return status 403 if post doesn't belong to user", async () => {
    const userId = chance.hash({ length: 24 });
    const postId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const deletePostMock = jest.spyOn(queries, "removePost");
    deletePostMock.mockImplementation(async () => {
      throw new Error(FORBIDDEN_OPERATION);
    });

    const response: Response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(deletePostMock).toHaveBeenCalled();
    expect(response.status).toBe(403);
    deletePostMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs", async () => {
    const userId = chance.hash({ length: 24 });
    const postId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const deletePostMock = jest.spyOn(queries, "removePost");
    deletePostMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(deletePostMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    deletePostMock.mockRestore();
  });
});
