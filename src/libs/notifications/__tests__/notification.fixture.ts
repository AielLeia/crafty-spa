import { AppStore, createTestStore } from '@/libs/create-store.ts';
import { FakeNotificationGateway } from '@/libs/notifications/infra/fake-notification.gateway.ts';
import { selectAreNotificationLoading } from '@/libs/notifications/slices/notifications.slice.ts';
import { getNotifications } from '@/libs/notifications/usecases/get-notifications.usecase.ts';
import {
  stateBuilder,
  StatebuilderProvider,
  stateBuilderProvider,
} from '@/libs/state-builder.ts';
import { expect } from 'vitest';

type NotificationDsl = {
  id: string;
  title: string;
  text: string;
  occurredAt: string;
  url: string;
  read: boolean;
  imageUrl: string;
};

type NotificationsDsl = NotificationDsl[];

type NotificationsForUseDsl = {
  [userId: string]: NotificationsDsl;
};

export const createNotificationFixture = ({
  builderProvider = stateBuilderProvider(),
}: Partial<{
  builderProvider: StatebuilderProvider;
}> = {}) => {
  let store: AppStore;
  const notificationGateway = new FakeNotificationGateway();

  return {
    givenExistingRemoteNotifications(
      existingNotificationForUser: NotificationsForUseDsl
    ) {
      notificationGateway.notifications = new Map(
        Object.entries(existingNotificationForUser)
      );
    },

    async whenRetrievingNotifications() {
      store = createTestStore(
        { notificationGateway },
        builderProvider?.getState()
      );

      return store.dispatch(getNotifications());
    },

    thenNotificationsShouldBeLoading() {
      const areNotificationLoading = selectAreNotificationLoading(
        store.getState()
      );
      expect(areNotificationLoading).toBe(true);
    },

    thenNotificationsShouldBe(expectedNotifications: NotificationsDsl) {
      const expectedState = stateBuilder(builderProvider?.getState())
        .withNotificationNotLoading()
        .withNotifications(expectedNotifications)
        .build();

      expect(store.getState()).toEqual(expectedState);
    },
  };
};

export type NotificationFixture = ReturnType<typeof createNotificationFixture>;
