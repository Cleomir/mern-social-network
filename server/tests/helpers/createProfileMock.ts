import Chance from "chance";

import IProfile from "../../src/interfaces/IProfile";

export const createProfileMock = (): IProfile => {
  const chance = new Chance();
  const userId = chance.guid({ version: 4 });
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
      from: new Date(from),
      to: new Date(to),
      current: chance.bool(),
      description: chance.string(),
    });
  }

  // generate random education
  for (let index = 0; index < chance.integer({ min: 0, max: 5 }); index++) {
    education.push({
      school: chance.string(),
      degree: chance.string(),
      field_of_study: chance.string(),
      from: new Date(from),
      to: new Date(to),
      current: chance.bool(),
      description: chance.string(),
    });
  }
  return {
    user: userId,
    handle,
    company,
    website,
    location,
    status,
    skills,
    bio,
    github_username,
    education,
    experience,
    social,
  };
};
