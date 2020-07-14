import Chance from "chance";
import { v4 as uuid } from "uuid";

import IUser from "../../../src/interfaces/IUser";
import {
  insertUser,
  insertProfile,
  removeUser,
  removeProfile,
  removeProfileAndUser,
  removeEducationFromProfile,
  removeExperienceFromProfile,
  addEducationToProfile,
} from "../../../src/database/queries";
import {
  USER_EXISTS,
  PROFILE_EXISTS,
  PROFILE_HANDLE_EXISTS,
  USER_NOT_FOUND,
  PROFILE_NOT_FOUND,
  NO_EDUCATION,
  NO_EXPERIENCE,
} from "../../../src/config/customErrorMessages";
import IProfile from "../../../src/interfaces/IProfile";
import createProfileMock from "../../helpers/createProfileMock";
import createUserMock from "../../helpers/createUserMock";
import createEducationMock from "../../helpers/createEducationMock";
import createExperienceMock from "../../helpers/createExperienceMock";

describe("Test database/queries.ts file", () => {
  const chance = new Chance();

  test("insertUser() should insert an user", async () => {
    const requestId: string = uuid();
    const user: IUser = createUserMock();
    const findUserMock = jest.fn();
    const saveUserMock = jest.fn();

    await insertUser(user, findUserMock, saveUserMock, requestId);

    expect(findUserMock).toHaveBeenCalledWith({ email: user.email }, requestId);
    expect(saveUserMock).toHaveBeenCalled();
  });

  test(`insertUser() should throw "${USER_EXISTS}" if user exists`, async () => {
    const requestId: string = uuid();
    const user: IUser = createUserMock();
    const findUserMock = jest.fn(async () => user);
    const saveUserMock = jest.fn();

    await expect(() =>
      insertUser(user, findUserMock, saveUserMock, requestId)
    ).rejects.toThrow(USER_EXISTS);
  });

  test("insertProfile() should be able to insert a profile", async () => {
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const findProfileMock = jest.fn();
    const saveProfileMock = jest.fn();

    await insertProfile(profile, findProfileMock, saveProfileMock, requestId);

    expect(findProfileMock).toHaveBeenCalledWith(
      { user: profile.user },
      requestId
    );
    expect(findProfileMock).toHaveBeenLastCalledWith(
      {
        handle: profile.handle,
      },
      requestId
    );
    expect(saveProfileMock).toHaveBeenCalled();
  });

  test(`insertProfile() should throw ${PROFILE_EXISTS} if profile exits`, async () => {
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const findProfileMock = jest.fn(async () => profile);
    const saveProfileMock = jest.fn();

    await expect(() =>
      insertProfile(profile, findProfileMock, saveProfileMock, requestId)
    ).rejects.toThrow(PROFILE_EXISTS);
  });

  test(`insertProfile() should throw ${PROFILE_HANDLE_EXISTS} if profile handle exits`, async () => {
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const findProfileMock = jest
      .fn()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(profile);
    const saveProfileMock = jest.fn();

    await expect(() =>
      insertProfile(profile, findProfileMock, saveProfileMock, requestId)
    ).rejects.toThrow(PROFILE_HANDLE_EXISTS);
  });

  test(`removeUser() should be able to delete an user`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const user: IUser = createUserMock();
    const findUserMock = jest.fn(async () => user);
    const deleteUserMock = jest.fn();

    await removeUser(userId, findUserMock, deleteUserMock, requestId);

    expect(findUserMock).toHaveBeenLastCalledWith({ _id: userId }, requestId);
    expect(deleteUserMock).toHaveBeenCalled();
  });

  test(`removeUser() should throw ${USER_NOT_FOUND} if user doesn't exist`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const findUserMock = jest.fn();
    const deleteUserMock = jest.fn();

    await expect(() =>
      removeUser(userId, findUserMock, deleteUserMock, requestId)
    ).rejects.toThrow(USER_NOT_FOUND);
  });

  test(`removeProfile () should be able to delete a profile`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const findProfileMock = jest.fn(async () => profile);
    const deleteUserMock = jest.fn();

    await removeProfile(userId, findProfileMock, deleteUserMock, requestId);

    expect(findProfileMock).toHaveBeenLastCalledWith(
      { user: userId },
      requestId
    );
    expect(deleteUserMock).toHaveBeenCalled();
  });

  test(`removeProfile() should throw ${PROFILE_NOT_FOUND} if profile doesn't exist`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const findProfileMock = jest.fn();
    const deleteUserMock = jest.fn();

    await expect(() =>
      removeProfile(userId, findProfileMock, deleteUserMock, requestId)
    ).rejects.toThrow(PROFILE_NOT_FOUND);
  });

  test(`removeProfileAndUser() should delete a user and its profile`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const user: IUser = createUserMock();
    const profile: IProfile = createProfileMock();
    const findProfileMock = jest.fn(async () => profile);
    const findUserMock = jest.fn(async () => user);
    const deleteDocumentMock = jest.fn();

    await removeProfileAndUser(
      userId,
      findProfileMock,
      findUserMock,
      deleteDocumentMock,
      requestId
    );

    expect(findProfileMock).toBeCalled();
    expect(findUserMock).toBeCalled();
    expect(deleteDocumentMock).toBeCalledTimes(2);
  });

  test(`removeEducationFromProfile() should delete an education from a profile`, async () => {
    const userId = chance.guid({ version: 4 });
    const educationId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    profile.education = [createEducationMock(educationId)];
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await removeEducationFromProfile(
      userId,
      educationId,
      findProfileMock,
      saveDocumentMock,
      requestId
    );

    expect(findProfileMock).toBeCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toBeCalled();
  });

  test(`removeEducationFromProfile() should throw ${PROFILE_NOT_FOUND} if profile doesn't exist`, async () => {
    const userId = chance.guid({ version: 4 });
    const educationId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const findProfileMock = jest.fn();
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeEducationFromProfile(
        userId,
        educationId,
        findProfileMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(PROFILE_NOT_FOUND);
  });

  test(`removeEducationFromProfile() should throw ${NO_EDUCATION} if education doesn't exist`, async () => {
    const userId = chance.guid({ version: 4 });
    const educationId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeEducationFromProfile(
        userId,
        educationId,
        findProfileMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(NO_EDUCATION);
  });

  test(`removeEducationFromProfile() should throw ${NO_EDUCATION} if education id is not found`, async () => {
    const userId = chance.guid({ version: 4 });
    const educationId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    profile.education = [createEducationMock(educationId)];
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeEducationFromProfile(
        userId,
        uuid(),
        findProfileMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(NO_EDUCATION);
  });

  test(`removeExperienceFromProfile() should delete an experience from a profile`, async () => {
    const userId = chance.guid({ version: 4 });
    const experienceId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    profile.experience = [createExperienceMock(experienceId)];
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await removeExperienceFromProfile(
      userId,
      experienceId,
      findProfileMock,
      saveDocumentMock,
      requestId
    );

    expect(findProfileMock).toBeCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toBeCalled();
  });

  test(`removeExperienceFromProfile() should throw ${PROFILE_NOT_FOUND} if profile doesn't exist`, async () => {
    const userId = chance.guid({ version: 4 });
    const experienceId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const findProfileMock = jest.fn();
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeExperienceFromProfile(
        userId,
        experienceId,
        findProfileMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(PROFILE_NOT_FOUND);
  });

  test(`removeExperienceFromProfile() should throw ${NO_EXPERIENCE} if experience doesn't exist`, async () => {
    const userId = chance.guid({ version: 4 });
    const experienceId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeExperienceFromProfile(
        userId,
        experienceId,
        findProfileMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(NO_EXPERIENCE);
  });

  test(`removeExperienceFromProfile() should throw ${NO_EXPERIENCE} if education id is not found`, async () => {
    const userId = chance.guid({ version: 4 });
    const experienceId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    profile.experience = [createExperienceMock(experienceId)];
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeExperienceFromProfile(
        userId,
        uuid(),
        findProfileMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(NO_EXPERIENCE);
  });

  test(`addEducationToProfile() should add an experience to a profile`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const educationMock = [createEducationMock()];
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await addEducationToProfile(
      userId,
      educationMock,
      findProfileMock,
      saveDocumentMock,
      requestId
    );

    expect(findProfileMock).toBeCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toBeCalled();
  });

  test(`addEducationToProfile() should add multiple experiences to a profile`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const educationMock = [createEducationMock()];
    profile.education = [createEducationMock()];
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await addEducationToProfile(
      userId,
      educationMock,
      findProfileMock,
      saveDocumentMock,
      requestId
    );

    expect(findProfileMock).toBeCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toBeCalled();
  });

  test(`addEducationToProfile() should throw ${USER_NOT_FOUND} if profile is not found`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const educationMock = [createEducationMock()];
    const findProfileMock = jest.fn();
    const saveDocumentMock = jest.fn();

    await expect(() =>
      addEducationToProfile(
        userId,
        educationMock,
        findProfileMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(USER_NOT_FOUND);
  });
});
