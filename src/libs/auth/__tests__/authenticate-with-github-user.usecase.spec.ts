import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { authenticateWithGithub } from '@/libs/auth/usecases/authenticated-with-github.usecase.ts';
import { createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { describe, expect, test } from 'vitest';

describe('Feature: Authentication with Github', () => {
  test('Use can authenticate with Github successfully', async () => {
    givenAuthenticationWithGithubWithSucceedForUser({
      id: 'asma-id',
      username: 'Asma',
      profilePicture: 'asma.png',
    });

    await whenUserAuthenticateWithGithub();

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

function givenAuthenticationWithGithubWithSucceedForUser(user: {
  id: string;
  username: string;
  profilePicture: string;
}) {
  authGateway.willSucceedForGithubAuthForUser = user;
}

async function whenUserAuthenticateWithGithub() {
  await store.dispatch(authenticateWithGithub());
}

function thenUserShouldBeAuthenticated({
  authUser,
}: {
  authUser: {
    id: string;
    username: string;
    profilePicture: string;
  };
}) {
  const expectedState = stateBuilder().withAuthUser(authUser).build();
  expect(store.getState()).toEqual(expectedState);
}
