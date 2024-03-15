import {
  AuthFixture,
  createAuthFixture,
} from '@/libs/auth/__tests__/auth.fixture.ts';
import {
  createNotificationFixture,
  NotificationFixture,
} from '@/libs/notifications/__tests__/notification.fixture.ts';
import { stateBuilderProvider } from '@/libs/state-builder.ts';
import { beforeEach, describe, test } from 'vitest';

describe('Feature: Retrieving authenticated user notifications', () => {
  let notificationFixture: NotificationFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const builderProvider = stateBuilderProvider();
    authFixture = createAuthFixture({ builderProvider });
    notificationFixture = createNotificationFixture({ builderProvider });
  });

  test('User is authenticated and has no notifications', async () => {
    authFixture.givenAuthenticatedUserIs('asma-id');
    notificationFixture.givenExistingRemoteNotifications({ 'asma-id': [] });

    const notificationRetrieving =
      notificationFixture.whenRetrievingNotifications();

    notificationFixture.thenNotificationsShouldBeLoading();

    await notificationRetrieving;
    notificationFixture.thenNotificationsShouldBe([]);
  });

  test('User is authenticated and has few notifications', async () => {
    authFixture.givenAuthenticatedUserIs('asma-id');
    notificationFixture.givenExistingRemoteNotifications({
      'asma-id': [
        {
          id: 'n1-id',
          title: 'Title 1',
          text: 'Text 1',
          occurredAt: '2024-03-15T07:00:00.000Z',
          url: 'https://some.url',
          read: false,
          imageUrl: 'image.png',
        },
        {
          id: 'n2-id',
          title: 'Title 2',
          text: 'Text 2',
          occurredAt: '2024-03-15T06:30:00.000Z',
          url: 'https://some-2.url',
          read: true,
          imageUrl: 'image.png',
        },
      ],
    });

    const notificationRetrieving =
      notificationFixture.whenRetrievingNotifications();

    notificationFixture.thenNotificationsShouldBeLoading();

    await notificationRetrieving;
    notificationFixture.thenNotificationsShouldBe([
      {
        id: 'n1-id',
        title: 'Title 1',
        text: 'Text 1',
        occurredAt: '2024-03-15T07:00:00.000Z',
        url: 'https://some.url',
        read: false,
        imageUrl: 'image.png',
      },
      {
        id: 'n2-id',
        title: 'Title 2',
        text: 'Text 2',
        occurredAt: '2024-03-15T06:30:00.000Z',
        url: 'https://some-2.url',
        read: true,
        imageUrl: 'image.png',
      },
    ]);
  });
});
