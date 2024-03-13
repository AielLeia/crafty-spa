import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';

export const getUser = createAppAsyncThunk(
  'users/getUser',
  async (params: { userId: string }, { extra: { userGateway } }) => {
    const { user } = await userGateway.getUser({ userId: params.userId });
    return user;
  }
);
