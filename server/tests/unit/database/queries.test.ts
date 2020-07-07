import Chance from "chance";
import { v4 as uuid } from "uuid";

import IUser from "../../../src/interfaces/IUser";
import { insertUser, insertProfile } from "../../../src/database/queries";
import {
  USER_EXISTS,
  PROFILE_EXISTS,
  PROFILE_HANDLE_EXISTS,
} from "../../../src/config/customErrorMessages";
import IProfile from "../../../src/interfaces/IProfile";

describe("Test database/queries.ts file", () => {
  const chance = new Chance();

  test("It should be able to insert an user", async () => {
    const requestId: string = uuid();
    const user: IUser = {
      name: chance.name(),
      avatar: chance.url(),
      date: new Date(),
      email: chance.email(),
      password: chance.string(),
    };
    const findUserMock = jest.fn();
    const saveUserMock = jest.fn();

    await insertUser(user, findUserMock, saveUserMock, requestId);

    expect(findUserMock).toHaveBeenCalledWith({ email: user.email });
    expect(saveUserMock).toHaveBeenCalled();
  });

  test(`It should throw "${USER_EXISTS}" if user exists`, async () => {
    const requestId: string = uuid();
    const user: IUser = {
      name: chance.name(),
      avatar: chance.url(),
      date: new Date(),
      email: chance.email(),
      password: chance.string(),
    };
    const findUserMock = jest.fn(async () => user);
    const saveUserMock = jest.fn();

    await expect(() =>
      insertUser(user, findUserMock, saveUserMock, requestId)
    ).rejects.toThrow(USER_EXISTS);
  });

  test("It should be able to insert a profile", async () => {
    // arrange
    const requestId: string = uuid();
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
    const profile: IProfile = {
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
    const findProfileMock = jest.fn();
    const saveProfileMock = jest.fn();

    // act
    await insertProfile(profile, findProfileMock, saveProfileMock, requestId);

    // assert
    expect(findProfileMock).toHaveBeenCalledWith({ user: userId }, requestId);
    expect(findProfileMock).toHaveBeenLastCalledWith(
      {
        handle: handle,
      },
      requestId
    );
    expect(saveProfileMock).toHaveBeenCalled();
  });

  test(`It should throw ${PROFILE_EXISTS} if profile exits`, async () => {
    // arrange
    const requestId: string = uuid();
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
    const profile: IProfile = {
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
    const findProfileMock = jest.fn(async () => profile);
    const saveProfileMock = jest.fn();

    // assert
    await expect(() =>
      insertProfile(profile, findProfileMock, saveProfileMock, requestId)
    ).rejects.toThrow(PROFILE_EXISTS);
  });

  test(`It should throw ${PROFILE_HANDLE_EXISTS} if profile handle exits`, async () => {
    // arrange
    const requestId: string = uuid();
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
    const profile: IProfile = {
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
    const findProfileMock = jest
      .fn()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(profile);
    const saveProfileMock = jest.fn();

    // assert
    await expect(() =>
      insertProfile(profile, findProfileMock, saveProfileMock, requestId)
    ).rejects.toThrow(PROFILE_HANDLE_EXISTS);
  });
});
