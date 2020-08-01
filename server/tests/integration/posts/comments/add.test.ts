import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../../src/App";
import * as queries from "../../../../src/database/queries";
import {
  INTERNAL_SERVER_ERROR,
  POST_NOT_FOUND,
} from "../../../../src/config/customErrorMessages";
import createCommentMock from "../../../helpers/createCommentMock";
import { signJWT } from "../../../../src/authentication/jwt";
import IComment from "../../../../src/interfaces/IComment";

describe("Test POST /posts/comments/:post_id", () => {
  const chance = new Chance();

  test("It should add a comment to a post and return status 201", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const commentMock: IComment = createCommentMock(uuid(), uuid());
    const addCommentToPostMock = jest.spyOn(queries, "addCommentToPost");
    addCommentToPostMock.mockImplementation();

    const response: Response = await request(app)
      .post(`/posts/comments/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(commentMock);

    expect(addCommentToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    addCommentToPostMock.mockRestore();
  });

  test("It should return status 400 if comment is undefined", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post(`/posts/comments/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"text" is required');
  });

  test("It should return status 400 if avatar is invalid", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const commentMock: IComment = createCommentMock(uuid(), uuid());
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post(`/posts/comments/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...commentMock, avatar: chance.integer() });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"avatar" must be a string');
  });

  test("It should return status 400 if text is undefined", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const commentMock: IComment = createCommentMock(uuid(), uuid());
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post(`/posts/comments/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...commentMock, text: undefined });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"text" is required');
  });

  test("It should return status 400 if text is invalid", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const commentMock: IComment = createCommentMock(uuid(), uuid());
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post(`/posts/comments/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...commentMock, text: chance.integer() });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"text" must be a string');
  });

  test("It should return status 400 if name is invalid", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const commentMock: IComment = createCommentMock(uuid(), uuid());
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post(`/posts/comments/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...commentMock, name: chance.integer() });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"name" must be a string');
  });

  test("It should return status 404 if post is not found", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const commentMock: IComment = createCommentMock(uuid(), uuid());
    const addCommentToPostMock = jest.spyOn(queries, "addCommentToPost");
    addCommentToPostMock.mockImplementation(async () => {
      throw new Error(POST_NOT_FOUND);
    });

    const response: Response = await request(app)
      .post(`/posts/comments/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(commentMock);

    expect(addCommentToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    addCommentToPostMock.mockRestore();
  });

  test("It should return status 500 if any error occurs", async () => {
    const userId: string = chance.hash({ length: 24 });
    const postId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const commentMock: IComment = createCommentMock(uuid(), uuid());
    const addCommentToPostMock = jest.spyOn(queries, "addCommentToPost");
    addCommentToPostMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .post(`/posts/comments/${postId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(commentMock);

    expect(addCommentToPostMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    addCommentToPostMock.mockRestore();
  });
});
