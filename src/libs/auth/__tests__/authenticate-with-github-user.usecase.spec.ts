import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { authenticateWithGithub } from '@/libs/auth/usecases/authenticated-with-github.usecase.ts';
import { createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { describe, expect, test } from 'vitest';

describe('Feature: Authentication with Github', () => {
  test('Use can authenticate with Github successfully', async () => {
    givenAuthenticationWithGithubWithSucceedForUser('Alice');

    await whenUserAuthenticateWithGithub();

    thenUserShouldBeAuthenticated({ authUser: 'Alice' });
  });
});

const authGateway = new FakeAuthGateway();
const store = createTestStore({ authGateway });

function givenAuthenticationWithGithubWithSucceedForUser(user: string) {
  authGateway.willSucceedForGithubAuthForUser = user;
}

async function whenUserAuthenticateWithGithub() {
  await store.dispatch(authenticateWithGithub());
}

function thenUserShouldBeAuthenticated({ authUser }: { authUser: string }) {
  const expectedState = stateBuilder().withAuthUser(authUser).build();
  expect(store.getState()).toEqual(expectedState);
}
