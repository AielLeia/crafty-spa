import { AppStore, createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { FakeUserGateway } from '@/libs/users/infra/fake-user.gateway.ts';
import { getUserFollowers } from '@/libs/users/usecases/get-user-followers.usecase.ts';
import { getUserFollowing } from '@/libs/users/usecases/get-user-following.usecase.ts';
import { expect } from 'vitest';

type DslTestFollowers = {
  of: string;
  followers: string[];
};

type DslTestFollowing = {
  of: string;
  following: string[];
};

export const createUsersFixture = () => {
  let store: AppStore;
  const userGateway = new FakeUserGateway();

  return {
    givenExistingRemoveFollowers(givenUserFollowers: DslTestFollowers) {
      userGateway.givenGetUserFollowersResponseFor({
        user: givenUserFollowers.of,
        followers: givenUserFollowers.followers,
      });
    },

    givenExistingRemoveFollowing(givenUserFollowing: DslTestFollowing) {
      userGateway.givenGetUserFollowingResponseFor({
        user: givenUserFollowing.of,
        following: givenUserFollowing.following,
      });
    },

    async whenRetrievingFollowersOf(user: string) {
      store = createTestStore({ userGateway });

      return store.dispatch(getUserFollowers({ userId: user }));
    },

    async whenRetrievingFollowingOf(user: string) {
      store = createTestStore({ userGateway });

      return store.dispatch(getUserFollowing({ userId: user }));
    },

    thenFollowersShouldBeLoading({ of }: { of: string }) {
      const expectedState = stateBuilder().withFollowersLoading({ of }).build();

      expect(expectedState).toEqual(store.getState());
    },

    thenFollowingShouldBeLoading({ of }: { of: string }) {
      const expectedState = stateBuilder().withFollowingLoading({ of }).build();

      expect(expectedState).toEqual(store.getState());
    },

    thenFollowersShouldBe(expectedFollowersOfUser: DslTestFollowers) {
      const expectedState = stateBuilder()
        .withFollowers({
          ...expectedFollowersOfUser,
        })
        .withFollowersNotLoading({ of: expectedFollowersOfUser.of })
        .build();

      expect(expectedState).toEqual(store.getState());
    },

    thenFollowingShouldBe(expectedFollowingOfUser: DslTestFollowing) {
      const expectedState = stateBuilder()
        .withFollowing({
          ...expectedFollowingOfUser,
        })
        .withFollowingNotLoading({ of: expectedFollowingOfUser.of })
        .build();

      expect(expectedState).toEqual(store.getState());
    },
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
