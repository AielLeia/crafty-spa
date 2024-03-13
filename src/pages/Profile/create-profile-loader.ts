import { AppStore } from '@/libs/create-store.ts';
import { getUser } from '@/libs/users/usecases/get-user.usecase.ts';
import { LoaderFunction } from 'react-router-dom';

export const createProfileLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  ({ params }) => {
    const userId = params.userId as string;
    store.dispatch(getUser({ userId }));
    return null;
  };
