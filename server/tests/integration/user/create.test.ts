import request, { Response } from "supertest";
import Chance from "chance";

import app from "../../../src/App";
import ConnectToDB from "../../../src/db/connection";
import { DB_URL } from "../../../src/config/envVariables";

describe("Test /users path", () => {
  const chance = new Chance();

  beforeAll(async () => {
    await ConnectToDB(DB_URL);
  });

  test("It should create a user and return status 200", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({ length: 8 });

    const response: Response = await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("avatar");
    expect(response.body).toHaveProperty("date");
  });
});
