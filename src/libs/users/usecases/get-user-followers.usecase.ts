import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';

export type GetUserFollowersParams = {
  userId: string;
};

export const getUserFollowers = createAppAsyncThunk(
  'users/getUserFollowers',
  (params: GetUserFollowersParams, { extra: { userGateway } }) => {
    return userGateway.getUserFollowers({ userId: params.userId });
  }
);
