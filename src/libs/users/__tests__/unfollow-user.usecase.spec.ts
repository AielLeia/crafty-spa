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

describe('Feature: Unfollowing a user', () => {
  let usersFixture: UsersFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const builderProvider = stateBuilderProvider();
    usersFixture = createUsersFixture({ builderProvider });
    authFixture = createAuthFixture({ builderProvider });
  });

  test('User can unfollow another user', async () => {
    const ismael = buildUser({ id: 'ismael-id', followingCount: 1 });
    const asma = buildUser({
      id: 'asma-id',
      followersCount: 6,
      isFollowedByAuthUser: true,
    });

    authFixture.givenAuthenticatedUserIs('ismael-id');
    usersFixture.givenUserFollows({
      userId: 'ismael-id',
      followingId: 'asma-id',
    });
    usersFixture.givenExistingUsers([ismael, asma]);

    await usersFixture.whenUserUnfollows({
      followingId: 'asma-id',
    });

    usersFixture.thenShouldHaveUnfollowed({
      followingId: 'asma-id',
      userId: 'ismael-id',
    });
    usersFixture.thenAppStateShouldBe(
      stateBuilder()
        .withAuthUser('ismael-id')
        .withFollowers({ of: 'asma-id', followers: [] })
        .withUsers([
          { ...ismael, followingCount: 0 },
          { ...asma, followersCount: 5, isFollowedByAuthUser: false },
        ])
        .build()
    );
  });

  test('User and another user follow each other, one user decides to unfollow the other', async () => {
    const ismael = buildUser({
      id: 'ismael-id',
      followingCount: 1,
      followersCount: 1,
    });
    const asma = buildUser({
      id: 'asma-id',
      followersCount: 6,
      followingCount: 1,
      isFollowedByAuthUser: true,
    });

    authFixture.givenAuthenticatedUserIs('ismael-id');
    usersFixture.givenUserFollows({
      userId: 'ismael-id',
      followingId: 'asma-id',
    });
    usersFixture.givenUserFollows({
      userId: 'asma-id',
      followingId: 'ismael-id',
    });
    usersFixture.givenExistingUsers([ismael, asma]);

    await usersFixture.whenUserUnfollows({
      followingId: 'asma-id',
    });

    usersFixture.thenShouldHaveUnfollowed({
      followingId: 'asma-id',
      userId: 'ismael-id',
    });
    usersFixture.thenAppStateShouldBe(
      stateBuilder()
        .withAuthUser('ismael-id')
        .withFollowers({ of: 'asma-id', followers: [] })
        .withFollowers({ of: 'ismael-id', followers: ['asma-id'] })
        .withFollowing({ of: 'asma-id', following: ['ismael-id'] })
        .withUsers([
          { ...ismael, followingCount: 0, followersCount: 1 },
          {
            ...asma,
            followersCount: 5,
            followingCount: 1,
            isFollowedByAuthUser: false,
          },
        ])
        .build()
    );
  });
});
