import Chance from "chance";

import IProfile from "../../src/interfaces/IProfile";

const createProfileMock = (): IProfile => {
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
  const social = {
    youtube: `youtube.com/channel/${chance.string({ alpha: true })}`,
    twitter: `twitter.com/${chance.string({ alpha: true })}`,
    facebook: `facebook.com/${chance.string({ alpha: true })}`,
    linkedin: `linkedin.com/in/${chance.string({ alpha: true })}`,
    instagram: `instagram.com/${chance.string({ alpha: true })}`,
  };

  // generate random skills
  for (let index = 0; index < chance.integer({ min: 1, max: 50 }); index++) {
    skills.push(chance.string());
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
    education: undefined,
    experience: undefined,
    social,
  };
};

export default createProfileMock;
