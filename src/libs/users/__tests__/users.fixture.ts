import { AppStore, createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { FakeUserGateway } from '@/libs/users/infra/fake-user.gateway.ts';
import { User } from '@/libs/users/models/user.entity.ts';
import {
  selectAreFollowersLoadingOf,
  selectAreFollowingLoadingOf,
} from '@/libs/users/slices/relationships.slice.ts';
import { getUserFollowers } from '@/libs/users/usecases/get-user-followers.usecase.ts';
import { getUserFollowing } from '@/libs/users/usecases/get-user-following.usecase.ts';
import { expect } from 'vitest';

type UserDsl = User;

type FollowersDsl = {
  of: string;
  followers: UserDsl[];
};

type FollowingDsl = {
  of: string;
  following: UserDsl[];
};

export const createUsersFixture = () => {
  let store: AppStore;
  let currentState = stateBuilder();
  const userGateway = new FakeUserGateway();

  return {
    givenExistingRemoveFollowers(givenUserFollowers: FollowersDsl) {
      userGateway.givenGetUserFollowersResponseFor({
        user: givenUserFollowers.of,
        followers: givenUserFollowers.followers,
      });
    },

    givenExistingRemoveFollowing(givenUserFollowing: FollowingDsl) {
      userGateway.givenGetUserFollowingResponseFor({
        user: givenUserFollowing.of,
        following: givenUserFollowing.following,
      });
    },

    givenExistingUsers(exitingUsers: UserDsl[]) {
      currentState = currentState.withUsers(exitingUsers);
    },

    async whenRetrievingFollowersOf(user: string) {
      store = createTestStore({ userGateway }, currentState.build());

      return store.dispatch(getUserFollowers({ userId: user }));
    },

    async whenRetrievingFollowingOf(user: string) {
      store = createTestStore({ userGateway }, currentState.build());

      return store.dispatch(getUserFollowing({ userId: user }));
    },

    thenFollowersShouldBeLoading({ of }: { of: string }) {
      const isLoading = selectAreFollowersLoadingOf(of, store.getState());

      expect(isLoading).toEqual(true);
    },

    thenFollowingShouldBeLoading({ of }: { of: string }) {
      const isLoading = selectAreFollowingLoadingOf(of, store.getState());

      expect(isLoading).toEqual(true);
    },

    thenFollowersShouldBe(expectedFollowersOfUser: FollowersDsl) {
      const expectedState = stateBuilder()
        .withFollowers({
          of: expectedFollowersOfUser.of,
          followers: expectedFollowersOfUser.followers.map((f) => f.id),
        })
        .withUsers(expectedFollowersOfUser.followers)
        .withFollowersNotLoading({ of: expectedFollowersOfUser.of })
        .build();

      expect(store.getState()).toEqual(expectedState);
    },

    thenFollowingShouldBe(expectedFollowingOfUser: FollowingDsl) {
      const expectedState = stateBuilder()
        .withFollowing({
          of: expectedFollowingOfUser.of,
          following: expectedFollowingOfUser.following.map((f) => f.id),
        })
        .withUsers(expectedFollowingOfUser.following)
        .withFollowingNotLoading({ of: expectedFollowingOfUser.of })
        .build();

      expect(store.getState()).toEqual(expectedState);
    },
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
