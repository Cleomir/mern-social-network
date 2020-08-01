import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../../src/App";
import * as queries from "../../../../src/database/queries";
import {
  INTERNAL_SERVER_ERROR,
  POST_NOT_FOUND,
  POST_ALREADY_LIKED,
} from "../../../../src/config/customErrorMessages";
import { signJWT } from "../../../../src/authentication/jwt";

describe("Test POST /posts/likes/:post_id", () => {
  const chance = new Chance();

  test("It should add a like to a post and return status 201", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addLikeToPostMock = jest.spyOn(queries, "addLikeToPost");
    addLikeToPostMock.mockImplementation();

    const response: Response = await request(app)
      .post(`/posts/likes/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(addLikeToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    addLikeToPostMock.mockRestore();
  });

  test("It should return status 400 if post id is invalid", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: number = chance.integer();
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post(`/posts/likes/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 404 if post is not found", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addLikeToPostMock = jest.spyOn(queries, "addLikeToPost");
    addLikeToPostMock.mockImplementation(async () => {
      throw new Error(POST_NOT_FOUND);
    });

    const response: Response = await request(app)
      .post(`/posts/likes/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(addLikeToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(POST_NOT_FOUND);
    addLikeToPostMock.mockRestore();
  });

  test("It should return status 403 if post has already been liked", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addLikeToPostMock = jest.spyOn(queries, "addLikeToPost");
    addLikeToPostMock.mockImplementation(async () => {
      throw new Error(POST_ALREADY_LIKED);
    });

    const response: Response = await request(app)
      .post(`/posts/likes/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(addLikeToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(POST_ALREADY_LIKED);
    addLikeToPostMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addLikeToPostMock = jest.spyOn(queries, "addLikeToPost");
    addLikeToPostMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .post(`/posts/likes/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(addLikeToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    addLikeToPostMock.mockRestore();
  });
});
