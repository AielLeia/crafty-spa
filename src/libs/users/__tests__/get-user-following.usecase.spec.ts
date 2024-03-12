import { buildUser } from '@/libs/users/__tests__/user.builder.ts';
import {
  createUsersFixture,
  UsersFixture,
} from '@/libs/users/__tests__/users.fixture.ts';
import { beforeEach, describe, test } from 'vitest';

describe('Feature: Getting the users following', () => {
  let usersFixture: UsersFixture;

  beforeEach(() => {
    usersFixture = createUsersFixture();
  });

  test("Retrieving the 2 user's following", async () => {
    usersFixture.givenExistingUsers([
      buildUser({
        id: 'ismael-id',
        username: 'Ismael',
        profilePicture: 'ismael.png',
        followersCount: 5,
        followingCount: 10,
      }),
    ]);
    usersFixture.givenExistingRemoveFollowing({
      of: 'Asma',
      following: [
        buildUser({
          id: 'ismael-id',
          username: 'Ismael BG',
          profilePicture: 'ismael-bg.png',
          followersCount: 5,
          followingCount: 1000,
        }),
        buildUser({
          id: 'aboubaker-id',
          username: 'Aboubaker',
          profilePicture: 'aboubaker.png',
          followersCount: 50,
          followingCount: 10000,
        }),
      ],
    });

    const followingRetrieving = usersFixture.whenRetrievingFollowingOf('Asma');

    usersFixture.thenFollowingShouldBeLoading({ of: 'Asma' });
    await followingRetrieving;
    usersFixture.thenFollowingShouldBe({
      of: 'Asma',
      following: [
        buildUser({
          id: 'ismael-id',
          username: 'Ismael BG',
          profilePicture: 'ismael-bg.png',
          followersCount: 5,
          followingCount: 1000,
        }),
        buildUser({
          id: 'aboubaker-id',
          username: 'Aboubaker',
          profilePicture: 'aboubaker.png',
          followersCount: 50,
          followingCount: 10000,
        }),
      ],
    });
  });
});
