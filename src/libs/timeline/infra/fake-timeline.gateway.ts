import {
  GetUserTimelineResponse,
  TimelineGateway,
} from '@/libs/timeline/models/timeline.gateway.ts';

export class FakeTimelineGateway implements TimelineGateway {
  timelinesByUser: Map<
    string,
    {
      id: string;
      user: string;
      messages: {
        id: string;
        text: string;
        author: string;
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
