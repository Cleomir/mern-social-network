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
  addExperienceToProfile,
  addPost,
  removePost,
  addLikeToPost,
  removeLikeFromPost,
  addCommentToPost,
  removeCommentFromPost,
} from "../../../src/database/queries";
import {
  USER_EXISTS,
  PROFILE_EXISTS,
  PROFILE_HANDLE_EXISTS,
  USER_NOT_FOUND,
  PROFILE_NOT_FOUND,
  NO_EDUCATION,
  NO_EXPERIENCE,
  POST_NOT_FOUND,
  FORBIDDEN_OPERATION,
  POST_ALREADY_LIKED,
  POST_NOT_LIKED,
} from "../../../src/config/customErrorMessages";
import IProfile from "../../../src/interfaces/IProfile";
import createProfileMock from "../../helpers/createProfileMock";
import createUserMock from "../../helpers/createUserMock";
import createEducationMock from "../../helpers/createEducationMock";
import createExperienceMock from "../../helpers/createExperienceMock";
import createPostMock from "../../helpers/createPostMock";
import createCommentMock from "../../helpers/createCommentMock";
import addLikeToPostMock from "../../helpers/addLikeToPostMock";
import IPost from "../../../src/interfaces/IPost";
import IComment from "../../../src/interfaces/IComment";

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

    expect(findProfileMock).toHaveBeenCalled();
    expect(findUserMock).toHaveBeenCalled();
    expect(deleteDocumentMock).toHaveBeenCalledTimes(2);
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

    expect(findProfileMock).toHaveBeenCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
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

    expect(findProfileMock).toHaveBeenCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
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

  test(`addEducationToProfile() should add an education to a profile`, async () => {
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

    expect(findProfileMock).toHaveBeenCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`addEducationToProfile() should add multiple educations to a profile`, async () => {
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

    expect(findProfileMock).toHaveBeenCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`addEducationToProfile() should throw ${PROFILE_NOT_FOUND} if profile is not found`, async () => {
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
    ).rejects.toThrow(PROFILE_NOT_FOUND);
  });

  test(`addExperienceToProfile() should add an experience to a profile`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const experienceMock = [createExperienceMock()];
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await addExperienceToProfile(
      userId,
      experienceMock,
      findProfileMock,
      saveDocumentMock,
      requestId
    );

    expect(findProfileMock).toHaveBeenCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`addExperienceToProfile() should add multiple experiences to a profile`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const profile: IProfile = createProfileMock();
    const experienceMock = [createExperienceMock()];
    profile.experience = [createExperienceMock()];
    const findProfileMock = jest.fn(async () => profile);
    const saveDocumentMock = jest.fn();

    await addExperienceToProfile(
      userId,
      experienceMock,
      findProfileMock,
      saveDocumentMock,
      requestId
    );

    expect(findProfileMock).toHaveBeenCalledWith({ user: userId }, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`addExperienceToProfile() should throw ${PROFILE_NOT_FOUND} if profile is not found`, async () => {
    const userId = chance.guid({ version: 4 });
    const requestId: string = uuid();
    const experienceMock = [createExperienceMock()];
    const findProfileMock = jest.fn();
    const saveDocumentMock = jest.fn();

    await expect(() =>
      addExperienceToProfile(
        userId,
        experienceMock,
        findProfileMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(PROFILE_NOT_FOUND);
  });

  test(`addPost() should create a post`, async () => {
    const postId: string = uuid();
    const requestId: string = uuid();
    const post: IPost = createPostMock(postId, uuid());
    const saveDocumentMock = jest.fn();

    await addPost(post, saveDocumentMock, requestId);

    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`removePost() should delete a post`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    const post: IPost = createPostMock(postId, userId);
    const findPostMock = jest.fn(async () => post);
    const deleteDocumentMock = jest.fn();

    await removePost(
      userId,
      postId,
      findPostMock,
      deleteDocumentMock,
      requestId
    );

    expect(findPostMock).toHaveBeenCalledWith(postId, requestId);
    expect(deleteDocumentMock).toHaveBeenCalled();
  });

  test(`removePost() should throw ${POST_NOT_FOUND} if post is not found`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    const findPostMock = jest.fn();
    const deleteDocumentMock = jest.fn();

    await expect(() =>
      removePost(userId, postId, findPostMock, deleteDocumentMock, requestId)
    ).rejects.toThrow(POST_NOT_FOUND);
  });

  test(`removePost() should throw ${FORBIDDEN_OPERATION} if post doesn't belong to user`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    const post: IPost = createPostMock(postId, chance.string());
    const findPostMock = jest.fn(async () => post);
    const deleteDocumentMock = jest.fn();

    await expect(() =>
      removePost(userId, postId, findPostMock, deleteDocumentMock, requestId)
    ).rejects.toThrow(FORBIDDEN_OPERATION);
  });

  test(`addLikeToPost() should add a like to a post`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    const post: IPost = createPostMock(postId, userId);
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await addLikeToPost(
      userId,
      postId,
      findPostMock,
      saveDocumentMock,
      requestId
    );

    expect(findPostMock).toHaveBeenCalledWith(postId, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`addLikeToPost() should add multiple likes to a post`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    let post: IPost = createPostMock(postId, userId);
    post = addLikeToPostMock(post, uuid());
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await addLikeToPost(
      userId,
      postId,
      findPostMock,
      saveDocumentMock,
      requestId
    );

    expect(findPostMock).toHaveBeenCalledWith(postId, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`addLikeToPost() should throw ${POST_NOT_FOUND} if post post is not found`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    const findPostMock = jest.fn();
    const saveDocumentMock = jest.fn();

    await expect(() =>
      addLikeToPost(userId, postId, findPostMock, saveDocumentMock, requestId)
    ).rejects.toThrow(POST_NOT_FOUND);
  });

  test(`addLikeToPost() should throw ${POST_ALREADY_LIKED} if post is already liked`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    let post: IPost = createPostMock(postId, userId);
    post = addLikeToPostMock(post, userId);
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await expect(() =>
      addLikeToPost(userId, postId, findPostMock, saveDocumentMock, requestId)
    ).rejects.toThrow(POST_ALREADY_LIKED);
  });

  test(`removeLikeFromPost() should remove a like from a post`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    let post: IPost = createPostMock(postId, userId);
    post = addLikeToPostMock(post, userId);
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await removeLikeFromPost(
      userId,
      postId,
      findPostMock,
      saveDocumentMock,
      requestId
    );

    expect(findPostMock).toHaveBeenCalledWith(postId, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`removeLikeFromPost() should throw ${POST_NOT_FOUND} if post is not found`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    const findPostMock = jest.fn();
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeLikeFromPost(
        userId,
        postId,
        findPostMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(POST_NOT_FOUND);
  });

  test(`removeLikeFromPost() should throw ${POST_NOT_LIKED} if post doesn't have any like`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    let post: IPost = createPostMock(postId, userId);
    post = addLikeToPostMock(post, uuid());
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeLikeFromPost(
        userId,
        postId,
        findPostMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(POST_NOT_LIKED);
  });

  test(`addCommentToPost() should a comment to a post`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    const post: IPost = createPostMock(postId, userId);
    const comment: IComment = createCommentMock(uuid(), userId);
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await addCommentToPost(
      postId,
      comment,
      findPostMock,
      saveDocumentMock,
      requestId
    );

    expect(findPostMock).toHaveBeenCalledWith(postId, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`addCommentToPost() should add multiple comments to a post`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const requestId: string = uuid();
    const post: IPost = createPostMock(postId, userId);
    post.comments = [createCommentMock(uuid(), userId)];
    const comment: IComment = createCommentMock(uuid(), uuid());
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await addCommentToPost(
      postId,
      comment,
      findPostMock,
      saveDocumentMock,
      requestId
    );

    expect(findPostMock).toHaveBeenCalledWith(postId, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`addCommentToPost() should throw ${POST_NOT_FOUND} if post is not found`, async () => {
    const postId: string = uuid();
    const requestId: string = uuid();
    const comment: IComment = createCommentMock(uuid(), uuid());
    const findPostMock = jest.fn();
    const saveDocumentMock = jest.fn();

    await expect(() =>
      addCommentToPost(
        postId,
        comment,
        findPostMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(POST_NOT_FOUND);
  });

  test(`removeCommentFromPost() should remove a comment from a post`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const commentId: string = uuid();
    const requestId: string = uuid();
    const post: IPost = createPostMock(postId, userId);
    post.comments = [createCommentMock(commentId, userId)];
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await removeCommentFromPost(
      postId,
      commentId,
      userId,
      findPostMock,
      saveDocumentMock,
      requestId
    );

    expect(findPostMock).toHaveBeenCalledWith(postId, requestId);
    expect(saveDocumentMock).toHaveBeenCalled();
  });

  test(`removeCommentFromPost() should throw ${POST_NOT_FOUND} if post is not found`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const commentId: string = uuid();
    const requestId: string = uuid();
    const findPostMock = jest.fn();
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeCommentFromPost(
        postId,
        commentId,
        userId,
        findPostMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(POST_NOT_FOUND);
  });

  test(`removeCommentFromPost() should throw ${FORBIDDEN_OPERATION} if comment doesn't belong to user`, async () => {
    const userId = chance.guid({ version: 4 });
    const postId: string = uuid();
    const commentId: string = uuid();
    const requestId: string = uuid();
    const post: IPost = createPostMock(postId, userId);
    post.comments = [createCommentMock(commentId, uuid())];
    const findPostMock = jest.fn(async () => post);
    const saveDocumentMock = jest.fn();

    await expect(() =>
      removeCommentFromPost(
        postId,
        commentId,
        userId,
        findPostMock,
        saveDocumentMock,
        requestId
      )
    ).rejects.toThrow(FORBIDDEN_OPERATION);
  });
});
