import request, { Response } from "supertest";
import Chance from "chance";

import app from "../../../src/App";
import ConnectToDB from "../../../src/db/connection";
import { DB_URL } from "../../../src/config/envVariables";
import User from "../../../src/db/models/User";

describe("Test /users/login path", () => {
  const chance = new Chance();

  beforeAll(async () => {
    await ConnectToDB(DB_URL);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("It should login and return status 200", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({ length: 8 });

    await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });
    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
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

    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ email, password });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("It should return status 400 if password doesn't match", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({ length: 8 });

    await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });
    const response: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ name, email, password: chance.string({ length: 8 }) });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("email or password incorrect");
  });
});
