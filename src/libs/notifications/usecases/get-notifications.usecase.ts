import { selectAuthUserId } from '@/libs/auth/reducer.ts';
import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';

export const getNotifications = createAppAsyncThunk(
  'notifications/getNotifications',
  (_, { extra: { notificationGateway }, getState }) => {
    const authUserId = selectAuthUserId(getState());
    return notificationGateway.getNotifications({ authUserId });
  }
);
