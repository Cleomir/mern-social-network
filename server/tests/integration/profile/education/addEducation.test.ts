import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../../src/App";
import * as queries from "../../../../src/database/queries";
import createEducationMock from "../../../helpers/createEducationMock";
import { INTERNAL_SERVER_ERROR } from "../../../../src/config/customErrorMessages";
import { signJWT } from "../../../../src/authentication/jwt";
import IEducation from "../../../../src/interfaces/IEducation";

describe("Test POST /profiles/education path", () => {
  const chance = new Chance();

  test("It should be able to add an education and return status 201 ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addEducationToProfileMock = jest.spyOn(
      queries,
      "addEducationToProfile"
    );
    addEducationToProfileMock.mockImplementation();

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [education],
      });

    expect(addEducationToProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    addEducationToProfileMock.mockRestore();
  });

  test("It should return status 400 if user id is invalid ", async () => {
    const userId: string = chance.string();
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 400 if education is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"education" is required');
  });

  test("It should return status 400 if school is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, school: undefined }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"education[0].school" is required');
  });

  test("It should return status 400 if school is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, school: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education[0].school" must be a string'
    );
  });

  test("It should return status 400 if degree is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, degree: undefined }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"education[0].degree" is required');
  });

  test("It should return status 400 if degree is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, degree: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education[0].degree" must be a string'
    );
  });

  test("It should return status 400 if field_of_study is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, field_of_study: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education[0].field_of_study" must be a string'
    );
  });

  test("It should return status 400 if from is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, from: undefined }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"education[0].from" is required');
  });

  test("It should return status 400 if from is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, from: chance.string() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education[0].from" must be a valid date'
    );
  });

  test("It should return status 400 if to is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, to: chance.string() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education[0].to" must be a valid date'
    );
  });

  test("It should return status 400 if from is greater than to ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [
          {
            ...education,
            from: chance.date({ min: new Date(2021) }),
            to: chance.date({ max: new Date(2020) }),
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education[0].to" must be greater than "ref:from"'
    );
  });

  test("It should return status 400 if current is undefined ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, current: undefined }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"education[0].current" is required');
  });

  test("It should return status 400 if current is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, current: chance.string() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education[0].current" must be a boolean'
    );
  });

  test("It should return status 400 if description is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [{ ...education, description: chance.integer() }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"education[0].description" must be a string'
    );
  });

  test("It should return status 500 if any internal error occurs ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const education: IEducation = createEducationMock();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const addEducationToProfileMock = jest.spyOn(
      queries,
      "addEducationToProfile"
    );
    addEducationToProfileMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .post("/profiles/education")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        education: [education],
      });

    expect(addEducationToProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    addEducationToProfileMock.mockRestore();
  });
});
