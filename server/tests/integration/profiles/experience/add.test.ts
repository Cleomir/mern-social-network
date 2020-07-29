import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../../src/App";
import * as queries from "../../../../src/database/queries";
import createExperienceMock from "../../../helpers/createExperienceMock";
import {
  INTERNAL_SERVER_ERROR,
  PROFILE_NOT_FOUND,
} from "../../../../src/config/customErrorMessages";
import { signJWT } from "../../../../src/authentication/jwt";
import IExperience from "../../../../src/interfaces/IExperience";

describe("Test POST /profiles/experience path", () => {
  const chance = new Chance();

  test("It should be able to add an experience and return status 201 ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addExperienceToProfileMock = jest.spyOn(
      queries,
      "addExperienceToProfile"
    );
    addExperienceToProfileMock.mockImplementation();

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [experienceMock],
      });

    expect(addExperienceToProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    addExperienceToProfileMock.mockRestore();
  });

  test("It should return status 400 if user id is invalid ", async () => {
    const userId: string = chance.string();
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 400 if experience is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch('"experience" is required');
  });

  test("It should return status 400 if title is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, title: undefined }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"experience[0].title" is required');
  });

  test("It should return status 400 if title is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, title: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience[0].title" must be a string'
    );
  });

  test("It should return status 400 if company is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, company: undefined }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"experience[0].company" is required');
  });

  test("It should return status 400 if company is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, company: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience[0].company" must be a string'
    );
  });

  test("It should return status 400 if location is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, location: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience[0].location" must be a string'
    );
  });

  test("It should return status 400 if from is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, from: undefined }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"experience[0].from" is required');
  });

  test("It should return status 400 if from is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [
          {
            ...experienceMock,
            from: chance.string({ alpha: true, numeric: true, symbols: false }),
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience[0].from" must be a valid date'
    );
  });

  test("It should return status 400 if to is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, to: chance.string() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience[0].to" must be a valid date'
    );
  });

  test("It should return status 400 if from is greater than to ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [
          {
            ...experienceMock,
            from: chance.date({ min: new Date(2021) }),
            to: chance.date({ max: new Date(2020) }),
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience[0].to" must be greater than "ref:from"'
    );
  });

  test("It should return status 400 if current is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, current: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience[0].current" must be a boolean'
    );
  });

  test("It should return status 400 if description is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [{ ...experienceMock, description: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"experience[0].description" must be a string'
    );
  });

  test("It should return status 404 if profile is not found ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addExperienceToProfileMock = jest.spyOn(
      queries,
      "addExperienceToProfile"
    );
    addExperienceToProfileMock.mockImplementation(async () => {
      throw new Error(PROFILE_NOT_FOUND);
    });

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [experienceMock],
      });

    expect(addExperienceToProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(PROFILE_NOT_FOUND);
    addExperienceToProfileMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const experienceMock: IExperience = createExperienceMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addExperienceToProfileMock = jest.spyOn(
      queries,
      "addExperienceToProfile"
    );
    addExperienceToProfileMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .post("/profiles/experience")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: [experienceMock],
      });

    expect(addExperienceToProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    addExperienceToProfileMock.mockRestore();
  });
});
