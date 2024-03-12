import {
  timelinesByUser,
  messages as messageMap,
  users,
  followersByUser,
  followingByUser,
} from '@/libs/fake-data.ts';
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
          const author = users.get(message.authorId);
          if (!author) return null;

          return {
            id: message.id,
            text: message.text,
            author: {
              id: author.id,
              username: author.username,
              profilePicture: author.profilePicture,
              followersCount: (followersByUser.get(author.id) ?? []).length,
              followingCount: (followingByUser.get(author.id) ?? []).length,
            },
            publishedAt: message.publishedAt.toISOString(),
          };
        })
        .filter(Boolean);

      const user = users.get(timeline.user);

      if (!user) return null;

      setTimeout(() => {
        return resolve({
          timeline: {
            id: timeline.id,
            user: {
              id: user.id,
              username: user.username,
              profilePicture: user.profilePicture,
              followersCount: (followersByUser.get(user.id) ?? []).length,
              followingCount: (followingByUser.get(user.id) ?? []).length,
            },
            messages,
          },
        });
      }, 500);
    });
  }
}
