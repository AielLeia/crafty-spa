import { RootState } from '@/libs/create-store.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import { User, usersAdapter } from '@/libs/users/models/user.entity.ts';
import { followUserPending } from '@/libs/users/usecases/follow-user.usecase.ts';
import { getUserFollowers } from '@/libs/users/usecases/get-user-followers.usecase.ts';
import { getUserFollowing } from '@/libs/users/usecases/get-user-following.usecase.ts';
import { getUser } from '@/libs/users/usecases/get-user.usecase.ts';
import { unfollowUserPending } from '@/libs/users/usecases/unfollow-user.usecase.ts';
import { createSlice, EntityState, isAnyOf } from '@reduxjs/toolkit';

export type UserSliceState = EntityState<User, string> & {
  loadingUsers: { [userId: string]: boolean };
};

export const userSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loadingUsers: {},
  }) as UserSliceState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(getUserFollowers.fulfilled, (state, action) => {
      usersAdapter.upsertMany(state, action.payload.followers);
    });

    builder.addCase(getUserFollowing.fulfilled, (state, action) => {
      usersAdapter.upsertMany(state, action.payload.following);
    });

    builder.addCase(getUser.pending, (state, action) => {
      const { userId } = action.meta.arg;
      state.loadingUsers[userId] = true;
    });

    builder.addCase(getUser.fulfilled, (state, action) => {
      const { userId } = action.meta.arg;
      state.loadingUsers[userId] = false;

      usersAdapter.upsertOne(state, action.payload);
    });

    builder.addCase(followUserPending, (state, action) => {
      const { userId, followingId } = action.payload;
      const followerUser = usersAdapter
        .getSelectors()
        .selectById(state, userId);
      const followingUser = usersAdapter
        .getSelectors()
        .selectById(state, followingId);

      usersAdapter.updateMany(state, [
        {
          id: userId,
          changes: {
            followingCount: followerUser.followingCount + 1,
          },
        },
        {
          id: followingId,
          changes: {
            followersCount: followingUser.followersCount + 1,
            isFollowedByAuthUser: true,
          },
        },
      ]);
    });

    builder.addCase(unfollowUserPending, (state, action) => {
      const { userId, followingId } = action.payload;
      const followerUser = usersAdapter
        .getSelectors()
        .selectById(state, userId);
      const followingUser = usersAdapter
        .getSelectors()
        .selectById(state, followingId);

      usersAdapter.updateMany(state, [
        {
          id: userId,
          changes: {
            followingCount: followerUser.followingCount - 1,
          },
        },
        {
          id: followingId,
          changes: {
            followersCount: followingUser.followersCount - 1,
            isFollowedByAuthUser: false,
          },
        },
      ]);
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

export const selectIsUserLoading = (userId: string, state: RootState) =>
  state.users.users.loadingUsers[userId] ?? false;
