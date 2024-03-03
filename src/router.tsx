import { AppStore } from '@/libs/create-store.ts';
import { Home } from '@/pages/Home';
import { createHomeLoader } from '@/pages/Home/create-home-loader.ts';
import { Login } from '@/pages/Login.tsx';
import { ProtectedPageLayout } from '@/pages/ProtectedPageLayout.tsx';
import { RedirectHome } from '@/pages/RedirectHome.tsx';
import { createBrowserRouter } from 'react-router-dom';

export const createRouter = (
  { store }: { store: AppStore },
  createRouterFn = createBrowserRouter
) =>
  createRouterFn([
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: '/',
      element: <ProtectedPageLayout />,
      children: [
        {
          index: true,
          element: <RedirectHome />,
        },
        {
          path: 'home',
          loader: createHomeLoader({ store }),
          element: <Home />,
        },
      ],
    },
  ]);

export type AppRouter = ReturnType<typeof createRouter>;
