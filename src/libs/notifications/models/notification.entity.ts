import { createEntityAdapter } from '@reduxjs/toolkit';

export type Notification = {
  id: string;
  title: string;
  text: string;
  occurredAt: string;
  url: string;
  read: boolean;
  imageUrl: string;
};

export const notificationAdapter = createEntityAdapter<Notification>();
