import { RootState } from '@/libs/create-store.ts';
import { selectMessages } from '@/libs/timeline/slices/message.slice.ts';
import {
  selectIsUserTimelineLoading,
  selectTimelineForUser,
} from '@/libs/timeline/slices/timelines.slice.ts';
import { format } from 'timeago.js';

export const ProfileTimelineViewModelType = {
  NoTimeline: 'NO_TIMELINE',
  EmptyTimeline: 'EMPTY_TIMELINE',
  TimelineWithMessages: 'TIMELINE_WITH_MESSAGES',
  LoadingTimeline: 'LOADING_TIMELINE',
} as const;

export const selectProfileTimelineViewModel =
  ({ userId, getNow }: { userId: string; getNow: () => string }) =>
  (state: RootState) => {
    const now = getNow();
    const timeline = selectTimelineForUser(userId, state);
    const isUserTimelineLoading = selectIsUserTimelineLoading(userId, state);

    if (isUserTimelineLoading) {
      return {
        timeline: {
          type: ProfileTimelineViewModelType.LoadingTimeline,
          info: 'Loading ...',
        },
      };
    }

    if (!timeline) {
      return { timeline: { type: ProfileTimelineViewModelType.NoTimeline } };
    }

    if (timeline.messages.length === 0) {
      return {
        timeline: {
          type: ProfileTimelineViewModelType.EmptyTimeline,
          info: 'There is no messages yet',
        },
      };
    }

    const messages = selectMessages(timeline.messages, state).map((msg) => ({
      id: msg.id,
      userId: msg.author,
      username: msg.author,
      profilePictureUrl: `https://picsum.photos/200?random=${msg.author}`,
      text: msg.text,
      publishedAt: format(msg.publishedAt, '', { relativeDate: now }),
    }));

    return {
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        messages: messages,
      },
    };
  };
