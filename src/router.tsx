import { Layout } from './pages/Layout';
import { AppStore } from '@/libs/create-store.ts';
import { Home } from '@/pages/Home';
import { createHomeLoader } from '@/pages/Home/create-home-loader.ts';
import { createBrowserRouter } from 'react-router-dom';

export const createRouter = ({ store }: { store: AppStore }) =>
  createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          loader: createHomeLoader({ store }),
          element: <Home />,
        },
      ],
    },
  ]);

export type AppRouter = ReturnType<typeof createRouter>;
