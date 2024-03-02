import { AppStore } from '@/libs/create-store.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { LoaderFunction } from 'react-router-dom';

export const createHomeLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  () => {
    store.dispatch(getAuthUserTimeline());
    return null;
  };
