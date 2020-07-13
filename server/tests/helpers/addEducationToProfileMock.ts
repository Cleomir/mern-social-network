import IProfile from "../../src/interfaces/IProfile";

import Chance from "chance";

const addEducationToProfile = (
  profile: IProfile,
  educationId: string
): IProfile => {
  const chance = new Chance();
  const from = chance.timestamp();
  const to = chance.integer({ min: from, max: Date.now() });

  // generate random education

  if (profile.education) {
    profile.education.push({
      id: educationId,
      school: chance.string(),
      degree: chance.string(),
      field_of_study: chance.string(),
      from: new Date(from),
      to: new Date(to),
      current: chance.bool(),
      description: chance.string(),
    });
  } else {
    profile.education = [
      {
        id: educationId,
        school: chance.string(),
        degree: chance.string(),
        field_of_study: chance.string(),
        from: new Date(from),
        to: new Date(to),
        current: chance.bool(),
        description: chance.string(),
      },
    ];
  }

  return profile;
};

export default addEducationToProfile;
