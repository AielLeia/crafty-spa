import { selectAuthUserId } from '@/libs/auth/reducer.ts';
import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';
import { createAction } from '@reduxjs/toolkit';

export type UnfollowUserParams = {
  followingId: string;
};

export const unfollowUserPending = createAction<{
  userId: string;
  followingId: string;
}>('users/unfollowUserPending');

export const unfollowUser = createAppAsyncThunk(
  'users/unfollowUser',
  (
    params: UnfollowUserParams,
    { extra: { userGateway }, getState, dispatch }
  ) => {
    const authUserId = selectAuthUserId(getState());
    dispatch(
      unfollowUserPending({
        userId: authUserId,
        followingId: params.followingId,
      })
    );
    return userGateway.unfollowUser({
      userId: authUserId,
      followingId: params.followingId,
    });
  }
);
