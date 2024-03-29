import { AuthUser } from '@/libs/auth/models/auth.gateway.ts';
import { authenticateWithGithub } from '@/libs/auth/usecases/authenticated-with-github.usecase.ts';
import { authenticateWithGoogle } from '@/libs/auth/usecases/authenticated-with-google.usecase.ts';
import { RootState } from '@/libs/create-store.ts';
import { createAction, createReducer } from '@reduxjs/toolkit';

export type AuthState = {
  authUser?: AuthUser;
};

export const userAuthenticated = createAction<{
  authUser: AuthUser;
}>('auth/userAuthenticated');

export const reducer = createReducer<AuthState>(
  {
    authUser: undefined,
  },
  (builder) => {
    builder.addCase(userAuthenticated, (state, action) => {
      state.authUser = action.payload.authUser;
    });

    builder.addCase(authenticateWithGoogle.fulfilled, (state, action) => {
      state.authUser = action.payload;
    });

    builder.addCase(authenticateWithGithub.fulfilled, (state, action) => {
      state.authUser = action.payload;
    });
  }
);

export const selectIsUserAuthenticated = (state: RootState) =>
  state.auth.authUser !== undefined;

export const selectAuthUserId = (state: RootState) =>
  state.auth.authUser?.id ?? '';
