import request, { Response } from "supertest";
import Chance from "chance";

import app from "../../../src/App";
import * as queries from "../../../src/database/queries";
import IUser from "../../../src/interfaces/IUser";
import {
  USER_EXISTS,
  INTERNAL_SERVER_ERROR,
} from "../../../src/config/customErrorMessages";

describe("Test POST /users/register path", () => {
  const chance = new Chance();

  test("It should create a user and return status 200", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({ length: 8 });
    const mockUser: IUser = {
      id: chance.guid({ version: 4 }),
      name,
      email,
      avatar: chance.url(),
      date: new Date(),
      password,
    };
    const insertUserMock = jest.spyOn(queries, "insertUser");
    insertUserMock.mockImplementation(async () => mockUser);

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(insertUserMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("avatar");
    expect(response.body).toHaveProperty("date");
    insertUserMock.mockRestore();
  });

  test("It should return status 400 if name is undefined", async () => {
    const email = chance.email();
    const password = chance.string({ length: 8 });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"name" is required');
  });

  test("It should return status 400 if name is invalid", async () => {
    const name = chance.integer();
    const email = chance.email();
    const password = chance.string({ length: 8 });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"name" must be a string');
  });

  test("It should return status 400 if name doesn't have at least 2 characters", async () => {
    const name = chance.string({ length: 1 });
    const email = chance.email();
    const password = chance.string({ length: 8 });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"name" length must be at least 2 characters long'
    );
  });

  test("It should return status 400 if email is undefined", async () => {
    const name = chance.string();
    const password = chance.string({ length: 8 });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"email" is required');
  });

  test("It should return status 400 if email is invalid", async () => {
    const name = chance.string();
    const email = chance.string();
    const password = chance.string({ length: 8 });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"email" must be a valid email');
  });

  test("It should return status 400 if password is undefined", async () => {
    const name = chance.string();
    const email = chance.email();

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"password" is required');
  });

  test("It should return status 400 if password doesn't have at least 8 characters", async () => {
    const name = chance.string();
    const email = chance.email();
    const password = chance.string({ length: 7 });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"password" length must be at least 8 characters long'
    );
  });

  test("It should return status 400 if password has more than 20 characters", async () => {
    const name = chance.string();
    const email = chance.email();
    const password = chance.string({ length: 21 });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"password" length must be less than or equal to 20 characters long'
    );
  });

  test("It should return status 403 if user already exists", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({ length: 8 });
    const insertUserMock = jest.spyOn(queries, "insertUser");
    insertUserMock.mockImplementation(async () => {
      throw new Error(USER_EXISTS);
    });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(insertUserMock).toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(USER_EXISTS);
    insertUserMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({ length: 8 });
    const insertUserMock = jest.spyOn(queries, "insertUser");
    insertUserMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(insertUserMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    insertUserMock.mockRestore();
  });
});
