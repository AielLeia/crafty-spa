import { User } from '@/libs/users/models/user.entity.ts';

export type GetUserTimelineResponse = {
  timeline: {
    id: string;
    user: User;
    messages: {
      id: string;
      text: string;
      author: User;
      publishedAt: string;
    }[];
  };
};

export interface TimelineGateway {
  getUserTimeline({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserTimelineResponse>;
}
