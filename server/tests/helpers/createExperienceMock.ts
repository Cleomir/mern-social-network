import Chance from "chance";
import IExperience from "../../src/interfaces/IExperience";

const addExperienceToProfile = (experienceId: string): IExperience => {
  const chance = new Chance();
  const from = chance.timestamp();
  const to = chance.integer({ min: from, max: Date.now() });

  return {
    id: experienceId,
    title: chance.string(),
    company: chance.string(),
    location: chance.string(),
    from: new Date(from),
    to: new Date(to),
    current: chance.bool(),
    description: chance.string(),
  };
};

export default addExperienceToProfile;
