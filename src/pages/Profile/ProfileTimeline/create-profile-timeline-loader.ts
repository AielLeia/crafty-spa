import { AppStore } from '@/libs/create-store.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import { LoaderFunction } from 'react-router-dom';

export const createProfileTimelineLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  ({ params }) => {
    const userId = params.userId as string;
    store.dispatch(getUserTimeline({ userId }));
    return null;
  };
