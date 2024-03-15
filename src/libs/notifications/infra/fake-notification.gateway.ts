import { Notification } from '@/libs/notifications/models/notification.entity.ts';
import { NotificationGateway } from '@/libs/notifications/models/notification.gateway.ts';

export class FakeNotificationGateway implements NotificationGateway {
  notifications!: Map<string, Notification[]>;

  getNotifications({
    authUserId,
  }: {
    authUserId: string;
  }): Promise<Notification[]> {
    const notifications = this.notifications.get(authUserId) ?? [];

    return Promise.resolve(notifications);
  }
}
