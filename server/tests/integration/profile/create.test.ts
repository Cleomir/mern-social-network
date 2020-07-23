import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import { signJWT } from "../../../src/authentication/jwt";
import createProfileMock from "../../helpers/createProfileMock";
import * as queries from "../../../src/database/queries";
import IProfile from "../../../src/interfaces/IProfile";
import createExperienceMock from "../../helpers/createExperienceMock";
import createEducationMock from "../../helpers/createEducationMock";
import {
  PROFILE_EXISTS,
  PROFILE_HANDLE_EXISTS,
  INTERNAL_SERVER_ERROR,
} from "../../../src/config/customErrorMessages";

describe("Test POST /profiles path", () => {
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

  test("It should return status 400 if experience length is greater than 10", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    profile.experience = [];
    for (let i = 0; i <= 10; i++) {
      profile.experience.push(createExperienceMock());
    }
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience" must contain less than or equal to 10 items'
    );
  });

  test("It should return status 400 if education length is greater than 5", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    profile.education = [];
    for (let i = 0; i <= 5; i++) {
      profile.education.push(createEducationMock());
    }
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education" must contain less than or equal to 5 items'
    );
  });

  test("It should return status 400 if company is invalid", async () => {
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
        company: chance.integer(),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"company" must be a string');
  });

  test("It should return status 400 if website is invalid", async () => {
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
        website: chance.integer(),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"website" must be a string');
  });

  test("It should return status 400 if location is invalid", async () => {
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
        location: chance.integer(),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"location" must be a string');
  });

  test("It should return status 400 if bio is invalid", async () => {
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
        bio: chance.integer(),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"bio" must be a string');
  });

  test("It should return status 400 if github username is invalid", async () => {
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
        github_username: chance.integer(),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"github_username" must be a string');
  });

  test("It should return status 400 if youtube link is not a string ", async () => {
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
        social: { youtube: chance.integer() },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"social.youtube" must be a string');
  });

  test("It should return status 400 if twitter link is not a string ", async () => {
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
        social: { twitter: chance.integer() },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"social.twitter" must be a string');
  });

  test("It should return status 400 if facebook link is not a string ", async () => {
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
        social: { facebook: chance.integer() },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"social.facebook" must be a string');
  });

  test("It should return status 400 if linkedin link is not a string ", async () => {
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
        social: { linkedin: chance.integer() },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"social.linkedin" must be a string');
  });

  test("It should return status 400 if instagram link is not a string ", async () => {
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
        social: { instagram: chance.integer() },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"social.instagram" must be a string');
  });

  test("It should return 403 if profile already exists", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const insertProfileMock = jest.spyOn(queries, "insertProfile");
    insertProfileMock.mockImplementation(async () => {
      throw new Error(PROFILE_EXISTS);
    });

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
      });

    expect(insertProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(PROFILE_EXISTS);
    insertProfileMock.mockRestore();
  });

  test("It should return 403 if profile handle already exists", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const insertProfileMock = jest.spyOn(queries, "insertProfile");
    insertProfileMock.mockImplementation(async () => {
      throw new Error(PROFILE_HANDLE_EXISTS);
    });

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
      });

    expect(insertProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(PROFILE_HANDLE_EXISTS);
    insertProfileMock.mockRestore();
  });

  test("It should return 500 if any internal error occurs", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const profile: IProfile = createProfileMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const insertProfileMock = jest.spyOn(queries, "insertProfile");
    insertProfileMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...profile,
      });

    expect(insertProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    insertProfileMock.mockRestore();
  });
});
