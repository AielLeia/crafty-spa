import { selectAuthUserId } from '@/libs/auth/reducer.ts';
import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';
import { createAction } from '@reduxjs/toolkit';

export type FollowUserParams = {
  followingId: string;
};

export const followUserPending = createAction<{
  userId: string;
  followingId: string;
}>('users/followUserPending');

export const followUser = createAppAsyncThunk(
  'users/followUser',
  (
    params: FollowUserParams,
    { extra: { userGateway }, getState, dispatch }
  ) => {
    const authUserId = selectAuthUserId(getState());
    dispatch(
      followUserPending({ userId: authUserId, followingId: params.followingId })
    );
    return userGateway.followUser({
      userId: authUserId,
      followingId: params.followingId,
    });
  }
);
