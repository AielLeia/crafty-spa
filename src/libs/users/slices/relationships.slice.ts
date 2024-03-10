import {
  Relationship,
  relationshipAdapter,
} from '@/libs/users/models/relationship.entity.ts';
import { getUserFollowers } from '@/libs/users/usecases/get-user-followers.usecase.ts';
import { getUserFollowing } from '@/libs/users/usecases/get-user-following.usecase.ts';
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
          user: action.meta.arg.userId,
          follow: user.id,
        }))
      );

      state.loadingFollowersOf[action.meta.arg.userId] = false;
    });

    builder.addCase(getUserFollowing.fulfilled, (state, action) => {
      relationshipAdapter.addMany(
        state,
        action.payload.following.map((user) => ({
          user: user.id,
          follow: action.meta.arg.userId,
        }))
      );
      state.loadingFollowingOf[action.meta.arg.userId] = false;
    });
  },
});
