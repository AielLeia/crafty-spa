import { AppStore } from '@/libs/create-store.ts';
import { getNotifications } from '@/libs/notifications/usecases/get-notifications.usecase.ts';
import { LoaderFunction } from 'react-router-dom';

export const createNotificationLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  () => {
    store.dispatch(getNotifications());
    return null;
  };
