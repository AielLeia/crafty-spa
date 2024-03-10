import { AppStore } from '@/libs/create-store.ts';
import { getUserFollowers } from '@/libs/users/usecases/get-user-followers.usecase.ts';
import { LoaderFunction } from 'react-router-dom';

export const createProfileFollowersLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  ({ params }) => {
    const userId = params.userId as string;
    store.dispatch(getUserFollowers({ userId }));
    return null;
  };
