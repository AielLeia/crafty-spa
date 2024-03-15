import { AppStore } from '@/libs/create-store.ts';
import { Home } from '@/pages/Home';
import { createHomeLoader } from '@/pages/Home/create-home-loader.ts';
import { Login } from '@/pages/Login.tsx';
import { Notifications } from '@/pages/Notifications';
import { createNotificationLoader } from '@/pages/Notifications/create-notification-loader.ts';
import { ProfileFollowers } from '@/pages/Profile/ProfileFollowers';
import { createProfileFollowersLoader } from '@/pages/Profile/ProfileFollowers/create-profile-followers-loader.ts';
import { ProfileFollowing } from '@/pages/Profile/ProfileFollowing';
import { createProfileFollowingLoader } from '@/pages/Profile/ProfileFollowing/create-profile-following-loader.ts';
import { ProfileLayout } from '@/pages/Profile/ProfileLayout.tsx';
import { ProfileTimeline } from '@/pages/Profile/ProfileTimeline/ProfileTimeline.tsx';
import { createProfileTimelineLoader } from '@/pages/Profile/ProfileTimeline/create-profile-timeline-loader.ts';
import { createProfileLoader } from '@/pages/Profile/create-profile-loader.ts';
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
        {
          path: 'notifications',
          loader: createNotificationLoader({ store }),
          element: <Notifications />,
        },
        {
          path: 'u/:userId',
          element: <ProfileLayout />,
          loader: createProfileLoader({ store }),
          children: [
            {
              index: true,
              element: <ProfileTimeline />,
              loader: createProfileTimelineLoader({ store }),
            },
            {
              path: 'following',
              element: <ProfileFollowing />,
              loader: createProfileFollowingLoader({ store }),
            },
            {
              path: 'followers',
              element: <ProfileFollowers />,
              loader: createProfileFollowersLoader({ store }),
            },
          ],
        },
      ],
    },
  ]);

export type AppRouter = ReturnType<typeof createRouter>;
