import { Notification } from '@/libs/notifications/models/notification.entity.ts';

export interface NotificationGateway {
  getNotifications({
    authUserId,
  }: {
    authUserId: string;
  }): Promise<Notification[]>;
}
