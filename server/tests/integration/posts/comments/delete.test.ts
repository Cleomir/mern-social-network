import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../../src/App";
import * as queries from "../../../../src/database/queries";
import {
  INTERNAL_SERVER_ERROR,
  POST_NOT_FOUND,
  FORBIDDEN_OPERATION,
} from "../../../../src/config/customErrorMessages";
import { signJWT } from "../../../../src/authentication/jwt";

describe("Test DELETE /posts/comments/:post_id", () => {
  const chance = new Chance();

  test("It should delete a comment and return status 200", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const commentId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addCommentToPostMock = jest.spyOn(queries, "removeCommentFromPost");
    addCommentToPostMock.mockImplementation();

    const response: Response = await request(app)
      .delete(`/posts/comments/${postId}/${commentId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(addCommentToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    addCommentToPostMock.mockRestore();
  });

  test("It should return status 400 if post id is invalid", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: number = chance.integer();
    const commentId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .delete(`/posts/comments/${postId}/${commentId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 400 if comment id is invalid", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const commentId: number = chance.integer();
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .delete(`/posts/comments/${postId}/${commentId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 404 if post is not found", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const commentId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addCommentToPostMock = jest.spyOn(queries, "removeCommentFromPost");
    addCommentToPostMock.mockImplementation(async () => {
      throw new Error(POST_NOT_FOUND);
    });

    const response: Response = await request(app)
      .delete(`/posts/comments/${postId}/${commentId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(addCommentToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(POST_NOT_FOUND);
    addCommentToPostMock.mockRestore();
  });

  test("It should return status 403 if comment doesn't belong to user", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const commentId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addCommentToPostMock = jest.spyOn(queries, "removeCommentFromPost");
    addCommentToPostMock.mockImplementation(async () => {
      throw new Error(FORBIDDEN_OPERATION);
    });

    const response: Response = await request(app)
      .delete(`/posts/comments/${postId}/${commentId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(addCommentToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(FORBIDDEN_OPERATION);
    addCommentToPostMock.mockRestore();
  });

  test("It should return status 500 if any error occurs", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const commentId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addCommentToPostMock = jest.spyOn(queries, "removeCommentFromPost");
    addCommentToPostMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .delete(`/posts/comments/${postId}/${commentId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(addCommentToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    addCommentToPostMock.mockRestore();
  });
});
