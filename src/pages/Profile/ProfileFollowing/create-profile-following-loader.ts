import { AppStore } from '@/libs/create-store.ts';
import { getUserFollowing } from '@/libs/users/usecases/get-user-following.usecase.ts';
import { LoaderFunction } from 'react-router-dom';

export const createProfileFollowingLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  ({ params }) => {
    const userId = params.userId as string;
    store.dispatch(getUserFollowing({ userId }));
    return null;
  };
