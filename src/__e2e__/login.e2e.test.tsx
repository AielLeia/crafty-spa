import { Provider } from '@/Provider.tsx';
import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { createTestStore } from '@/libs/create-store.ts';
import { createRouter } from '@/router.tsx';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createMemoryRouter, RouteObject } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

const createMemoryRouterWithCurrentRoute =
  (currentRoute: string) => (routes: RouteObject[]) =>
    createMemoryRouter(routes, { initialEntries: [currentRoute] });

describe('Login page', () => {
  test('Should redirect to login when not authenticated', async () => {
    const store = createTestStore();
    const router = createRouter(
      { store },
      createMemoryRouterWithCurrentRoute('/')
    );

    render(<Provider store={store} router={router} />);

    const loginWithAccountElement = await screen.findByText(
      'Log in to your account'
    );
    const continueWithGoogle = await screen.findByText('Continue with Google');
    const continueWithGithub = await screen.findByText('Continue with GitHub');

    expect(loginWithAccountElement).toBeInTheDocument();
    expect(continueWithGoogle).toBeInTheDocument();
    expect(continueWithGithub).toBeInTheDocument();
  });

  test('Should redirect to home page when authentication has succeeded', async () => {
    const authGateway = new FakeAuthGateway();
    authGateway.willSucceedForGoogleAuthForUser = {
      id: 'asma-id',
      username: 'Asma',
      profilePicture: 'asma.png',
    };
    const store = createTestStore({ authGateway });
    const router = createRouter({ store });

    render(<Provider store={store} router={router} />);

    const loginWithGoogle = await screen.findByText('Continue with Google');
    await userEvent.click(loginWithGoogle);

    expect(await screen.findByText('For you')).toBeInTheDocument();
  });
});
