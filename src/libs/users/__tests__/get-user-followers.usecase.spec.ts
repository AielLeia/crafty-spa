import {
  createUsersFixture,
  UsersFixture,
} from '@/libs/users/__tests__/users.fixture.ts';
import { beforeEach, describe, test } from 'vitest';

describe('Feature: Getting the users followers', () => {
  let usersFixture: UsersFixture;

  beforeEach(() => {
    usersFixture = createUsersFixture();
  });

  test("Retrieving the 2 user's followers", async () => {
    usersFixture.givenExistingUsers([
      {
        id: 'ismael-id',
        username: 'Ismael',
        profilePicture: 'ismael.png',
        followersCount: 5,
        followingCount: 10,
      },
    ]);
    usersFixture.givenExistingRemoveFollowers({
      of: 'Asma',
      followers: [
        {
          id: 'ismael-id',
          username: 'Ismael BG',
          profilePicture: 'ismael-bg.png',
          followersCount: 5,
          followingCount: 1000,
        },
        {
          id: 'aboubaker-id',
          username: 'Aboubaker',
          profilePicture: 'aboubaker.png',
          followersCount: 50,
          followingCount: 10000,
        },
      ],
    });

    const followersRetrieving = usersFixture.whenRetrievingFollowersOf('Asma');

    usersFixture.thenFollowersShouldBeLoading({ of: 'Asma' });
    await followersRetrieving;
    usersFixture.thenFollowersShouldBe({
      of: 'Asma',
      followers: [
        {
          id: 'ismael-id',
          username: 'Ismael BG',
          profilePicture: 'ismael-bg.png',
          followersCount: 5,
          followingCount: 1000,
        },
        {
          id: 'aboubaker-id',
          username: 'Aboubaker',
          profilePicture: 'aboubaker.png',
          followersCount: 50,
          followingCount: 10000,
        },
      ],
    });
  });
});
