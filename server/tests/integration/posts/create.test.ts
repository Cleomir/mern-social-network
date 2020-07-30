import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import * as queries from "../../../src/database/queries";
import createPostMock from "../../helpers/createPostMock";
import { INTERNAL_SERVER_ERROR } from "../../../src/config/customErrorMessages";
import { signJWT } from "../../../src/authentication/jwt";

describe("Test POST /posts/", () => {
  const chance = new Chance();

  test("It should create a post and return status 201 ", async () => {
    const userId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const postMock = createPostMock(uuid(), userId);
    const addPostMock = jest.spyOn(queries, "addPost");
    addPostMock.mockImplementation();

    const response: Response = await request(app)
      .post(`/posts`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(postMock);

    expect(addPostMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    addPostMock.mockRestore();
  });

  test("It should return status 400 if post is undefined ", async () => {
    const userId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post(`/posts`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"text" is required');
  });

  test("It should return status 400 if text is invalid ", async () => {
    const userId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const postMock = createPostMock(uuid(), userId);

    const response: Response = await request(app)
      .post(`/posts`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...postMock, text: chance.integer() });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"text" must be a string');
  });

  test("It should return status 400 if avatar is invalid ", async () => {
    const userId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const postMock = createPostMock(uuid(), userId);

    const response: Response = await request(app)
      .post(`/posts`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...postMock, avatar: chance.integer() });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"avatar" must be a string');
  });

  test("It should return status 400 if name is invalid ", async () => {
    const userId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const postMock = createPostMock(uuid(), userId);

    const response: Response = await request(app)
      .post(`/posts`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...postMock, name: chance.integer() });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"name" must be a string');
  });

  test("It should return status 500 if any internal error occurs", async () => {
    const userId = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const postMock = createPostMock(uuid(), userId);
    const addPostMock = jest.spyOn(queries, "addPost");
    addPostMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .post(`/posts`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(postMock);

    expect(addPostMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    addPostMock.mockRestore();
  });
});
