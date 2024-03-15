import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { userAuthenticated } from '@/libs/auth/reducer.ts';
import { createTestStore } from '@/libs/create-store.ts';
import { describe, expect, test } from 'vitest';

describe('On auth state change listener', () => {
  test('Should dispatch an userAuthenticated action when auth gateway notifies the users is authenticated', () => {
    const authGateway = new FakeAuthGateway();
    const store = createTestStore({ authGateway });

    authGateway.simulateAuthStateChanged({
      id: 'asma-id',
      username: 'Asma',
      profilePicture: 'asma.png',
    });

    expect(store.getActions()).toContainEqual(
      userAuthenticated({
        authUser: {
          id: 'asma-id',
          username: 'Asma',
          profilePicture: 'asma.png',
        },
      })
    );
  });
});
