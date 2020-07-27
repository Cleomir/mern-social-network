import request, { Response } from "supertest";
import Chance from "chance";
import { v4 as uuid } from "uuid";

import app from "../../../src/App";
import { signJWT } from "../../../src/authentication/jwt";
import * as queries from "../../../src/database/queries";
import {
  USER_NOT_FOUND,
  PROFILE_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../../src/config/customErrorMessages";

describe("Test DELETE /profiles path", () => {
  const chance = new Chance();

  test("It should delete a profile and user, and return status 200", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const removeProfileAndUserMock = jest.spyOn(
      queries,
      "removeProfileAndUser"
    );
    removeProfileAndUserMock.mockImplementation();

    const response: Response = await request(app)
      .delete("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(removeProfileAndUserMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    removeProfileAndUserMock.mockRestore();
  });

  test("It should return status 400 if user id is invalid", async () => {
    const userId: string = chance.string();
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());

    const response: Response = await request(app)
      .delete("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/fails to match the id pattern/);
  });

  test("It should return status 403 if user is not found", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const removeProfileAndUserMock = jest.spyOn(
      queries,
      "removeProfileAndUser"
    );
    removeProfileAndUserMock.mockImplementation(async () => {
      throw new Error(USER_NOT_FOUND);
    });

    const response: Response = await request(app)
      .delete("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(removeProfileAndUserMock).toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(USER_NOT_FOUND);
    removeProfileAndUserMock.mockRestore();
  });

  test("It should return status 403 if profile is not found", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const removeProfileAndUserMock = jest.spyOn(
      queries,
      "removeProfileAndUser"
    );
    removeProfileAndUserMock.mockImplementation(async () => {
      throw new Error(PROFILE_NOT_FOUND);
    });

    const response: Response = await request(app)
      .delete("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(removeProfileAndUserMock).toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(PROFILE_NOT_FOUND);
    removeProfileAndUserMock.mockRestore();
  });

  test("It should return status 500 if any internal error occurs", async () => {
    const userId: string = chance.hash({ length: 24 });
    const name: string = chance.name();
    const email: string = chance.email();
    const avatar: string = chance.url();
    const token: string = signJWT({ id: userId, name, email, avatar }, uuid());
    const removeProfileAndUserMock = jest.spyOn(
      queries,
      "removeProfileAndUser"
    );
    removeProfileAndUserMock.mockImplementation(async () => {
      throw new Error(INTERNAL_SERVER_ERROR);
    });

    const response: Response = await request(app)
      .delete("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(removeProfileAndUserMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(INTERNAL_SERVER_ERROR);
    removeProfileAndUserMock.mockRestore();
  });
});
