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

  test("Retrieving the 10 user's followers", async () => {
    usersFixture.givenExistingRemoveFollowers({
      of: 'Asma',
      followers: [
        'F1-ID',
        'F2-ID',
        'F3-ID',
        'F4-ID',
        'F5-ID',
        'F6-ID',
        'F7-ID',
        'F8-ID',
        'F9-ID',
        'F10-ID',
      ],
    });

    const followersRetrieving = usersFixture.whenRetrievingFollowersOf('Asma');

    usersFixture.thenFollowersShouldBeLoading({ of: 'Asma' });
    await followersRetrieving;
    usersFixture.thenFollowersShouldBe({
      of: 'Asma',
      followers: [
        'F1-ID',
        'F2-ID',
        'F3-ID',
        'F4-ID',
        'F5-ID',
        'F6-ID',
        'F7-ID',
        'F8-ID',
        'F9-ID',
        'F10-ID',
      ],
    });
  });
});
