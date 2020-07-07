import request, { Response } from "supertest";
import Chance from "chance";

import app from "../../../src/App";

describe("Test /profiles path", () => {
  const chance = new Chance();

  test.skip("It should create a profile and return status 200", async () => {
    const name = chance.name();
    const email = chance.email();
    const password = chance.string({ length: 8 });
    const handle = chance.string({ length: 20 });
    const company = chance.string();
    const website = chance.string();
    const location = chance.string();
    const status = chance.string();
    const skills = [];
    const bio = chance.string();
    const github_username = chance.string();
    const from = chance.timestamp();
    const to = chance.integer({ min: from, max: Date.now() });
    const experience = [];
    const education = [];
    const social = {
      youtube: chance.string(),
      twitter: chance.string(),
      facebook: chance.string(),
      linkedin: chance.string(),
      instagram: chance.string(),
    };

    // generate random skills
    for (let index = 0; index < chance.integer({ min: 1, max: 50 }); index++) {
      skills.push(chance.string());
    }

    // generate random experiences
    for (let index = 0; index < chance.integer({ min: 0, max: 10 }); index++) {
      experience.push({
        title: chance.string(),
        company: chance.string(),
        location: chance.string(),
        from,
        to,
        current: chance.bool(),
        description: chance.string(),
      });
    }

    for (let index = 0; index < chance.integer({ min: 0, max: 5 }); index++) {
      education.push({
        school: chance.string(),
        degree: chance.string(),
        field_of_study: chance.string(),
        from,
        to,
        current: chance.bool(),
        description: chance.string(),
      });
    }

    await request(app)
      .post("/users/register")
      .set("Content-type", "application/json")
      .send({ name, email, password });
    const loginResponse: Response = await request(app)
      .post("/users/login")
      .set("Content-type", "application/json")
      .send({ email, password });
    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send({
        handle,
        company,
        website,
        location,
        status,
        skills,
        bio,
        github_username,
        experience,
        education,
        social,
      });

    expect(response.status).toBe(201);
  });

  test.skip("It should return status 401 if user is not authenticated", async () => {
    const response: Response = await request(app)
      .post("/profiles")
      .set("Content-type", "application/json")
      .send();

    expect(response.status).toBe(401);
  });
});
