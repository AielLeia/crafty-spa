import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';

export const authenticateWithGoogle = createAppAsyncThunk(
  'auth/authenticateWithGoogle',
  async (_, { extra: { authGateway } }) => {
    const authUser = authGateway.authenticateWithGoogle();

    return authUser;
  }
);
