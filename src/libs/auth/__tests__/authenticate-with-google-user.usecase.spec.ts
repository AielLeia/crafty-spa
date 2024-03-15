import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { authenticateWithGoogle } from '@/libs/auth/usecases/authenticated-with-google.usecase.ts';
import { createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { describe, expect, test } from 'vitest';

describe('Feature: Authentication with google', () => {
  test('Use can authenticate with google successfully', async () => {
    givenAuthenticationWithGoogleWithSucceedForUser({
      id: 'asma-id',
      username: 'Asma',
      profilePicture: 'asma.png',
    });

    await whenUserAuthenticateWithGoogle();

    thenUserShouldBeAuthenticated({
      authUser: {
        id: 'asma-id',
        username: 'Asma',
        profilePicture: 'asma.png',
      },
    });
  });
});

const authGateway = new FakeAuthGateway();
const store = createTestStore({ authGateway });

function givenAuthenticationWithGoogleWithSucceedForUser(user: {
  id: string;
  username: string;
  profilePicture: string;
}) {
  authGateway.willSucceedForGoogleAuthForUser = user;
}

async function whenUserAuthenticateWithGoogle() {
  await store.dispatch(authenticateWithGoogle());
}

function thenUserShouldBeAuthenticated({
  authUser,
}: {
  authUser: { id: string; username: string; profilePicture: string };
}) {
  const expectedState = stateBuilder().withAuthUser(authUser).build();
  expect(store.getState()).toEqual(expectedState);
}
