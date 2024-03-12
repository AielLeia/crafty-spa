import {
  GetUserTimelineResponse,
  TimelineGateway,
} from '@/libs/timeline/models/timeline.gateway.ts';
import { User } from '@/libs/users/models/user.entity.ts';

export class FakeTimelineGateway implements TimelineGateway {
  timelinesByUser: Map<
    string,
    {
      id: string;
      user: User;
      messages: {
        id: string;
        text: string;
        author: User;
        publishedAt: string;
      }[];
    }
  > = new Map();

  constructor(private readonly delay = 0) {}

  getUserTimeline({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserTimelineResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const timelines = this.timelinesByUser.get(userId);

        if (!timelines) {
          return reject();
        }

        return resolve({
          timeline: timelines,
        });
      }, this.delay)
    );
  }
}
