import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../../src/App";
import * as queries from "../../../../src/database/queries";
import {
  INTERNAL_SERVER_ERROR,
  PROFILE_NOT_FOUND,
  NO_EXPERIENCE,
} from "../../../../src/config/customErrorMessages";
import { signJWT } from "../../../../src/authentication/jwt";

describe("Test DELETE /profiles/experience path", () => {
  const chance = new Chance();

  test("It should be able to delete an experience and return status 200 ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const experienceId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const deleteExperienceFromProfileMock = jest.spyOn(
      queries,
      "removeExperienceFromProfile"
    );
    deleteExperienceFromProfileMock.mockImplementation();

    const response: Response = await request(app)
      .delete(`/profiles/experience/${experienceId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(deleteExperienceFromProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    deleteExperienceFromProfileMock.mockRestore();
  });

  test("It should return status 400 if user id is invalid ", async () => {
    const userId: string = chance.string();
    const experienceId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .delete(`/profiles/experience/${experienceId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 400 if experience id is invalid ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const experienceId: string = chance.string({
      alpha: true,
      numeric: true,
      symbols: false,
    });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .delete(`/profiles/experience/${experienceId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 404 if profile is not found ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const experienceId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const deleteExperienceFromProfileMock = jest.spyOn(
      queries,
      "removeExperienceFromProfile"
    );
    deleteExperienceFromProfileMock.mockImplementation(async () => {
      throw new Error(PROFILE_NOT_FOUND);
    });

    const response: Response = await request(app)
      .delete(`/profiles/experience/${experienceId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(deleteExperienceFromProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    deleteExperienceFromProfileMock.mockRestore();
  });

  test("It should return status 404 if experience is not found ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const experienceId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const deleteExperienceFromProfileMock = jest.spyOn(
      queries,
      "removeExperienceFromProfile"
    );
    deleteExperienceFromProfileMock.mockImplementation(async () => {
      throw new Error(NO_EXPERIENCE);
    });

    const response: Response = await request(app)
      .delete(`/profiles/experience/${experienceId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(deleteExperienceFromProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(NO_EXPERIENCE);
    deleteExperienceFromProfileMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs ", async () => {
    const userId: string = chance.hash({ length: 24 });
    const experienceId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const deleteExperienceFromProfileMock = jest.spyOn(
      queries,
      "removeExperienceFromProfile"
    );
    deleteExperienceFromProfileMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .delete(`/profiles/experience/${experienceId}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(deleteExperienceFromProfileMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    deleteExperienceFromProfileMock.mockRestore();
  });
});
