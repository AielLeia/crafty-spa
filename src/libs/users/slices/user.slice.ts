import { RootState } from '@/libs/create-store.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import { usersAdapter } from '@/libs/users/models/user.entity.ts';
import { getUserFollowers } from '@/libs/users/usecases/get-user-followers.usecase.ts';
import { getUserFollowing } from '@/libs/users/usecases/get-user-following.usecase.ts';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {},

  extraReducers(builder) {
    builder.addCase(getUserFollowers.fulfilled, (state, action) => {
      usersAdapter.upsertMany(state, action.payload.followers);
    });

    builder.addCase(getUserFollowing.fulfilled, (state, action) => {
      usersAdapter.upsertMany(state, action.payload.following);
    });

    builder.addMatcher(
      isAnyOf(getAuthUserTimeline.fulfilled, getUserTimeline.fulfilled),
      (state, action) => {
        usersAdapter.upsertMany(state, [
          action.payload.user,
          ...action.payload.messages.map((m) => m.author),
        ]);
      }
    );
  },
});

export const selectUser = (userId: string, state: RootState) =>
  usersAdapter.getSelectors().selectById(state.users.users, userId);
