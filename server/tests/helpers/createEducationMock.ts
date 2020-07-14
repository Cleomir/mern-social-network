import Chance from "chance";
import IEducation from "../../src/interfaces/IEducation";

const createEducationMock = (educationId?: string): IEducation => {
  const chance = new Chance();
  const from = chance.timestamp();
  const to = chance.integer({ min: from, max: Date.now() });

  // generate random education

  return {
    id: educationId,
    school: chance.string(),
    degree: chance.string(),
    field_of_study: chance.string(),
    from: new Date(from),
    to: new Date(to),
    current: chance.bool(),
    description: chance.string(),
  };
};

export default createEducationMock;
