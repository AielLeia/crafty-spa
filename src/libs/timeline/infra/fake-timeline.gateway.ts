import {
  GetUserTimelineResponse,
  TimelineGateway,
} from '@/libs/timeline/models/timeline.gateway.ts';

export class FakeTimelineGateway implements TimelineGateway {
  timelinesByUser: Map<
    string,
    {
      user: string;
      messages: { text: string; author: string; publishedAt: string }[];
    }
  > = new Map();

  getUserTimeline({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserTimelineResponse> {
    const timelines = this.timelinesByUser.get(userId);

    if (!timelines) {
      return Promise.reject();
    }

    return Promise.resolve({
      timeline: timelines,
    });
  }
}
