import { AppStore } from '@/libs/create-store.ts';
import { LoaderFunction } from 'react-router-dom';

export const createProfileTimelineLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  () => {
    return null;
  };
