import {
  createUsersFixture,
  UsersFixture,
} from '@/libs/users/__tests__/users.fixture.ts';
import { beforeEach, describe, test } from 'vitest';

describe('Feature : Retrieving user information', () => {
  let usersFixture: UsersFixture;

  beforeEach(() => {
    usersFixture = createUsersFixture();
  });

  test('Retrieving user profile information', async () => {
    const asma = {
      id: 'asma-id',
      username: 'Asma',
      profilePicture: 'asma.png',
      followingCount: 300,
      followersCount: 20,
    };

    usersFixture.givenExistingRemoveUser(asma);

    const retrievingUser = usersFixture.whenRetrievingUser('asma-id');

    usersFixture.thenUserShouldBeLoading('asma-id');

    await retrievingUser;
    usersFixture.thenRetrievedUserIs(asma);
  });
});
