import { AppStore, createTestStore, RootState } from '@/libs/create-store.ts';
import {
  stateBuilder,
  StatebuilderProvider,
  stateBuilderProvider,
} from '@/libs/state-builder.ts';
import { FakeUserGateway } from '@/libs/users/infra/fake-user.gateway.ts';
import { User } from '@/libs/users/models/user.entity.ts';
import {
  selectAreFollowersLoadingOf,
  selectAreFollowingLoadingOf,
} from '@/libs/users/slices/relationships.slice.ts';
import { selectIsUserLoading } from '@/libs/users/slices/user.slice.ts';
import { followUser } from '@/libs/users/usecases/follow-user.usecase.ts';
import { getUserFollowers } from '@/libs/users/usecases/get-user-followers.usecase.ts';
import { getUserFollowing } from '@/libs/users/usecases/get-user-following.usecase.ts';
import { getUser } from '@/libs/users/usecases/get-user.usecase.ts';
import { unfollowUser } from '@/libs/users/usecases/unfollow-user.usecase.ts';
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

type FollowingCommandDsl = {
  followingId: string;
};

type UnfollowingCommandDsl = {
  followingId: string;
};

type ExistingUserFollowsDsl = {
  followingId: string;
  userId: string;
};

type ExpectedFollowingDsl = {
  followingId: string;
  userId: string;
};

type ExpectedUnfollowingDsl = {
  followingId: string;
  userId: string;
};

export const createUsersFixture = ({
  builderProvider = stateBuilderProvider(),
}: Partial<{
  builderProvider: StatebuilderProvider;
}> = {}) => {
  let store: AppStore;
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
      builderProvider.setState((builder) => builder.withUsers(exitingUsers));
    },

    givenExistingRemoveUser(exitingUser: UserDsl) {
      userGateway.users.set(exitingUser.id, exitingUser);
    },

    givenUserFollows(existingUserDsl: ExistingUserFollowsDsl) {
      builderProvider.setState((builder) =>
        builder.withFollowers({
          of: existingUserDsl.followingId,
          followers: [existingUserDsl.userId],
        })
      );
    },

    async whenRetrievingFollowersOf(user: string) {
      store = createTestStore({ userGateway }, builderProvider.getState());

      return store.dispatch(getUserFollowers({ userId: user }));
    },

    async whenRetrievingFollowingOf(user: string) {
      store = createTestStore({ userGateway }, builderProvider.getState());

      return store.dispatch(getUserFollowing({ userId: user }));
    },

    async whenRetrievingUser(userId: string) {
      store = createTestStore({ userGateway });

      return store.dispatch(getUser({ userId }));
    },

    async whenUserFollows(followingCommandDsl: FollowingCommandDsl) {
      store = createTestStore({ userGateway }, builderProvider.getState());

      return store.dispatch(
        followUser({ followingId: followingCommandDsl.followingId })
      );
    },

    async whenUserUnfollows(unfollowingCommandDsl: UnfollowingCommandDsl) {
      store = createTestStore({ userGateway }, builderProvider.getState());

      return store.dispatch(
        unfollowUser({ followingId: unfollowingCommandDsl.followingId })
      );
    },

    thenFollowersShouldBeLoading({ of }: { of: string }) {
      const isLoading = selectAreFollowersLoadingOf(of, store.getState());

      expect(isLoading).toEqual(true);
    },

    thenFollowingShouldBeLoading({ of }: { of: string }) {
      const isLoading = selectAreFollowingLoadingOf(of, store.getState());

      expect(isLoading).toEqual(true);
    },

    thenUserShouldBeLoading(userId: string) {
      const isUserLoading = selectIsUserLoading(userId, store.getState());

      expect(isUserLoading).toBe(true);
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

    thenRetrievedUserIs(expectedUser: UserDsl) {
      const expectedState = stateBuilder()
        .withUsers([expectedUser])
        .withNotLoadingUser({ userId: expectedUser.id })
        .build();

      expect(store.getState()).toEqual(expectedState);
    },

    thenShouldHaveFollowed(expectedFollowingDsl: ExpectedFollowingDsl) {
      expect(userGateway.lastFollowedUserBy).toEqual(expectedFollowingDsl);
    },

    thenShouldHaveUnfollowed(expectedUnfollowingDsl: ExpectedUnfollowingDsl) {
      expect(userGateway.lastUnfollowedUserBy).toEqual(expectedUnfollowingDsl);
    },

    thenAppStateShouldBe(expectedState: RootState) {
      expect(store.getState()).toEqual(expectedState);
    },
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
