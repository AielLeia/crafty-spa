import { timelinesByUser, messages as messageMap } from '@/libs/fake-data.ts';
import {
  GetUserTimelineResponse,
  TimelineGateway,
} from '@/libs/timeline/models/timeline.gateway.ts';

export class FakeDataTimelineGateway implements TimelineGateway {
  getUserTimeline({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserTimelineResponse> {
    return new Promise((resolve, reject) => {
      const timeline = timelinesByUser.get(userId);

      if (!timeline) {
        return reject('No timeline');
      }

      const messages = timeline.messages
        .map((msgId) => {
          const message = messageMap.get(msgId);
          if (!message) return null;

          return {
            id: message.id,
            text: message.text,
            author: message.authorId, // acts as username
            publishedAt: message.publishedAt.toISOString(),
          };
        })
        .filter(Boolean);

      setTimeout(() => {
        return resolve({
          timeline: {
            id: timeline.id,
            user: timeline.user,
            messages,
          },
        });
      }, 500);
    });
  }
}
