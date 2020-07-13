import IProfile from "../../src/interfaces/IProfile";

import Chance from "chance";

const addExperienceToProfile = (
  profile: IProfile,
  experienceNumber: number
): IProfile => {
  const chance = new Chance();
  const from = chance.timestamp();
  const to = chance.integer({ min: from, max: Date.now() });

  for (let index = 0; index < experienceNumber; index++) {
    if (profile.experience) {
      profile.experience.push({
        id: chance.guid({ version: 4 }),
        title: chance.string(),
        company: chance.string(),
        location: chance.string(),
        from: new Date(from),
        to: new Date(to),
        current: chance.bool(),
        description: chance.string(),
      });
    } else {
      profile.experience = [
        {
          id: chance.guid({ version: 4 }),
          title: chance.string(),
          company: chance.string(),
          location: chance.string(),
          from: new Date(from),
          to: new Date(to),
          current: chance.bool(),
          description: chance.string(),
        },
      ];
    }
  }

  return profile;
};

export default addExperienceToProfile;
