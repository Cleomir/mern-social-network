import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import { signJWT } from "../../../src/authentication/jwt";
import createProfileMock from "../../helpers/createProfileMock";
import * as queries from "../../../src/database/queries";
import IProfile from "../../../src/interfaces/IProfile";

describe("Test /profiles path", () => {
  const chance = new Chance();

  test("It should create a profile and return status 200", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const insertProfileMock = jest.spyOn(queries, "insertProfile");
    insertProfileMock.mockImplementation();

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
      });

    expect(insertProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    insertProfileMock.mockRestore();
  });

  test("It should return status 401 if user is not authenticated", async () => {
    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .send();

    expect(response.status).toBe(401);
  });

  test("It should return status 400 if handle is undefined", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        handle: undefined,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"handle" is required');
  });

  test("It should return status 400 if handle is invalid", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        handle: chance.integer(),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"handle" must be a string');
  });

  test("It should return status 400 if handle is greater than 40 characters", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        handle: chance.string({ length: 41 }),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"handle" length must be less than or equal to 40 characters long'
    );
  });

  test("It should return status 400 if status is undefined", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        status: undefined,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"status" is required');
  });

  test("It should return status 400 if status is invalid", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        status: chance.integer(),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"status" must be a string');
  });

  test("It should return status 400 if skills is undefined", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        skills: undefined,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"skills" is required');
  });

  test("It should return status 400 if skills is empty", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        skills: [],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"skills" must contain at least 1 items'
    );
  });

  test("It should return status 400 if skills length is greater than 50", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const skills = new Array(51);
    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
        skills: skills.fill(chance.string(), 0, 51),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"skills" must contain less than or equal to 50 items'
    );
  });
});
