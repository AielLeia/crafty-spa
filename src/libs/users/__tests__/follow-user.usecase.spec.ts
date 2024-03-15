import {
  AuthFixture,
  createAuthFixture,
} from '@/libs/auth/__tests__/auth.fixture.ts';
import { stateBuilder, stateBuilderProvider } from '@/libs/state-builder.ts';
import { buildUser } from '@/libs/users/__tests__/user.builder.ts';
import {
  createUsersFixture,
  UsersFixture,
} from '@/libs/users/__tests__/users.fixture.ts';
import { beforeEach, describe, test } from 'vitest';

describe('Feature: following a user', () => {
  let usersFixture: UsersFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const builderProvider = stateBuilderProvider();
    usersFixture = createUsersFixture({ builderProvider });
    authFixture = createAuthFixture({ builderProvider });
  });

  test('User can follow another user', async () => {
    const ismael = buildUser({ id: 'ismael-id', followingCount: 0 });
    const asma = buildUser({
      id: 'asma-id',
      followersCount: 5,
      isFollowedByAuthUser: false,
    });

    authFixture.givenAuthenticatedUserIs('ismael-id');
    usersFixture.givenExistingUsers([ismael, asma]);

    await usersFixture.whenUserFollows({
      followingId: 'asma-id',
    });

    usersFixture.thenShouldHaveFollowed({
      followingId: 'asma-id',
      userId: 'ismael-id',
    });
    usersFixture.thenAppStateShouldBe(
      stateBuilder()
        .withAuthUser('ismael-id')
        .withFollowers({ of: 'asma-id', followers: ['ismael-id'] })
        .withUsers([
          { ...ismael, followingCount: 1 },
          { ...asma, followersCount: 6, isFollowedByAuthUser: true },
        ])
        .build()
    );
  });
});
