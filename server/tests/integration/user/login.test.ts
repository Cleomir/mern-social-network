import request, { Response } from "supertest";
import Chance from "chance";

import app from "../../../src/App";
import * as dbDirectCalls from "../../../src/database/dbDirectCalls";
import * as auth from "../../../src/authentication/password";
import IUser from "../../../src/interfaces/IUser";
import {
  INVALID_CREDENTIALS,
  INTERNAL_SERVER_ERROR,
} from "../../../src/config/customErrorMessages";

describe("Test /users/login path", () => {
  const chance = new Chance();

  test("It should login and return status 200", async () => {
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
    const findOneUserMock = jest.spyOn(dbDirectCalls, "findOneUser");
    const comparePasswordMock = jest.spyOn(auth, "comparePassword");
    findOneUserMock.mockImplementation(async () => mockUser);
    comparePasswordMock.mockImplementation(async () => true);

    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ email, password });

    expect(comparePasswordMock).toHaveBeenCalled();
    expect(findOneUserMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    comparePasswordMock.mockRestore();
    findOneUserMock.mockRestore();
  });

  test("It should return status 400 if email is undefined", async () => {
    const password = chance.string({ length: 8 });

    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"email" is required');
  });

  test("It should return status 400 if email is invalid", async () => {
    const email = chance.string();
    const password = chance.string({ length: 8 });

    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"email" must be a valid email');
  });

  test("It should return status 400 if password is undefined", async () => {
    const email = chance.email();

    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ email });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"password" is required');
  });

  test("It should return status 400 if password doesn't have at least 8 characters", async () => {
    const name = chance.string();
    const email = chance.email();
    const password = chance.string({ length: 7 });

    const response: Response = await request(app)
      .post("/users/login")
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

  test("It should return status 404 if user is not found", async () => {
    const email = chance.email();
    const password = chance.string({ length: 8 });
    const findOneUserMock = jest.spyOn(dbDirectCalls, "findOneUser");
    findOneUserMock.mockImplementation();

    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ email, password });

    expect(findOneUserMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
    findOneUserMock.mockRestore();
  });

  test("It should return status 400 if password doesn't match", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({
      length: 8,
      alpha: true,
      numeric: true,
      symbols: false,
    });
    const mockUser: IUser = {
      id: chance.guid({ version: 4 }),
      name,
      email,
      avatar: chance.url(),
      date: new Date(),
      password,
    };
    const findOneUserMock = jest.spyOn(dbDirectCalls, "findOneUser");
    findOneUserMock.mockImplementation(async () => mockUser);

    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({
        name,
        email,
        password: chance.string({
          length: 8,
          alpha: true,
          numeric: true,
          symbols: false,
        }),
      });

    expect(findOneUserMock).toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(INVALID_CREDENTIALS);
    findOneUserMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({ length: 8 });
    const findOneUserMock = jest.spyOn(dbDirectCalls, "findOneUser");
    findOneUserMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(findOneUserMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    findOneUserMock.mockRestore();
  });
});
