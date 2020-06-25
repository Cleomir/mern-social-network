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
});
