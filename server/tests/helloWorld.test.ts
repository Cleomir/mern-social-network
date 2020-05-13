import request from "supertest";

import app from "../src/App";

describe("Test / path", () => {
  test("It should return status 200", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  });
});
