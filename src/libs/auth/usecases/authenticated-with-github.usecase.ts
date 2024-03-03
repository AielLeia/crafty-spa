import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';

export const authenticateWithGithub = createAppAsyncThunk(
  'auth/authenticateWithGithub',
  async (_, { extra: { authGateway } }) => {
    const authUser = authGateway.authenticateWithGithub();

    return authUser;
  }
);
