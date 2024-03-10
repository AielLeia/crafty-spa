import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';

export type GetUserFollowingParams = {
  userId: string;
};

export const getUserFollowing = createAppAsyncThunk(
  'users/getUserFollowing',
  (params: GetUserFollowingParams, { extra: { userGateway } }) => {
    return userGateway.getUserFollowing({ userId: params.userId });
  }
);
