import { AppStore } from '@/libs/create-store.ts';
import { Home } from '@/pages/Home';
import { createHomeLoader } from '@/pages/Home/create-home-loader.ts';
import { Login } from '@/pages/Login.tsx';
import { ProtectedPageLayout } from '@/pages/ProtectedPageLayout.tsx';
import { createBrowserRouter } from 'react-router-dom';

export const createRouter = ({ store }: { store: AppStore }) =>
  createBrowserRouter([
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
          loader: createHomeLoader({ store }),
          element: <Home />,
        },
        {
          path: 'login',
          element: <Login />,
        },
      ],
    },
  ]);

export type AppRouter = ReturnType<typeof createRouter>;
