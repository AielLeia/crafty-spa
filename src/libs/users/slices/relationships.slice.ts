import { RootState } from '@/libs/create-store.ts';
import {
  Relationship,
  relationshipAdapter,
} from '@/libs/users/models/relationship.entity.ts';
import { followUserPending } from '@/libs/users/usecases/follow-user.usecase.ts';
import { getUserFollowers } from '@/libs/users/usecases/get-user-followers.usecase.ts';
import { getUserFollowing } from '@/libs/users/usecases/get-user-following.usecase.ts';
import { unfollowUserPending } from '@/libs/users/usecases/unfollow-user.usecase.ts';
import { createSlice, EntityState } from '@reduxjs/toolkit';

type RelationshipsSliceState = EntityState<Relationship, string> & {
  loadingFollowersOf: { [userId: string]: boolean };
  loadingFollowingOf: { [userId: string]: boolean };
};

export const relationshipsSlice = createSlice({
  name: 'relationships',
  initialState: relationshipAdapter.getInitialState({
    loadingFollowersOf: {},
    loadingFollowingOf: {},
  }) as RelationshipsSliceState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(getUserFollowers.pending, (state, action) => {
      state.loadingFollowersOf[action.meta.arg.userId] = true;
    });

    builder.addCase(getUserFollowing.pending, (state, action) => {
      state.loadingFollowingOf[action.meta.arg.userId] = true;
    });

    builder.addCase(getUserFollowers.fulfilled, (state, action) => {
      relationshipAdapter.addMany(
        state,
        action.payload.followers.map((user) => ({
          user: user.id,
          follow: action.meta.arg.userId,
        }))
      );

      state.loadingFollowersOf[action.meta.arg.userId] = false;
    });

    builder.addCase(getUserFollowing.fulfilled, (state, action) => {
      relationshipAdapter.addMany(
        state,
        action.payload.following.map((user) => ({
          user: action.meta.arg.userId,
          follow: user.id,
        }))
      );
      state.loadingFollowingOf[action.meta.arg.userId] = false;
    });

    builder.addCase(followUserPending, (state, action) => {
      const { userId, followingId } = action.payload;
      relationshipAdapter.addOne(state, {
        user: userId,
        follow: followingId,
      });
    });

    builder.addCase(unfollowUserPending, (state, action) => {
      const { userId, followingId } = action.payload;
      relationshipAdapter.removeOne(state, `${userId}->${followingId}`);
    });
  },
});

export const selectAreFollowersLoadingOf = (of: string, state: RootState) =>
  state.users.relationships.loadingFollowersOf[of] ?? false;

export const selectFollowersOf = (of: string, state: RootState) => {
  return relationshipAdapter
    .getSelectors()
    .selectAll(state.users.relationships)
    .filter((relationship) => relationship.follow === of)
    .map((followers) => followers.user);
};

export const selectAreFollowingLoadingOf = (of: string, state: RootState) =>
  state.users.relationships.loadingFollowingOf[of] ?? false;

export const selectFollowingOf = (of: string, state: RootState) => {
  return relationshipAdapter
    .getSelectors()
    .selectAll(state.users.relationships)
    .filter((relationship) => relationship.user === of)
    .map((followers) => followers.follow);
};
