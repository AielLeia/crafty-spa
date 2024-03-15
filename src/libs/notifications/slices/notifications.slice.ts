import { RootState } from '@/libs/create-store.ts';
import {
  Notification,
  notificationAdapter,
} from '@/libs/notifications/models/notification.entity.ts';
import { getNotifications } from '@/libs/notifications/usecases/get-notifications.usecase.ts';
import { createSlice, EntityState } from '@reduxjs/toolkit';

export type NotificationsSliceState = EntityState<Notification, string> & {
  loading: boolean;
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationAdapter.getInitialState({
    loading: false,
  }) as NotificationsSliceState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(getNotifications.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.loading = false;
      notificationAdapter.addMany(state, action.payload);
    });
  },
});

export const selectAreNotificationLoading = (state: RootState) =>
  state.notifications.loading;
