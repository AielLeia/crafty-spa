import { selectAuthUser } from '@/libs/auth/reducer.ts';
import { RootState } from '@/libs/create-store.ts';
import { selectMessages } from '@/libs/timeline/slices/message.slice.ts';
import {
  selectIsUserTimelineLoading,
  selectTimelineForUser,
} from '@/libs/timeline/slices/timelines.slice.ts';
import { format } from 'timeago.js';

export const HomeViewModelType = {
  NoTimeline: 'NO_TIMELINE',
  EmptyTimeline: 'EMPTY_TIMELINE',
  TimelineWithMessages: 'TIMELINE_WITH_MESSAGES',
  LoadingTimeline: 'LOADING_TIMELINE',
} as const;

export const selectHomeViewModel = (state: RootState, getNow: () => string) => {
  const now = getNow();
  const authUser = selectAuthUser(state);
  const timeline = selectTimelineForUser(authUser, state);
  const isUserTimelineLoading = selectIsUserTimelineLoading(authUser, state);

  if (isUserTimelineLoading) {
    return {
      timeline: {
        type: HomeViewModelType.LoadingTimeline,
        info: 'Loading ...',
      },
    };
  }

  if (!timeline) {
    return { timeline: { type: HomeViewModelType.NoTimeline } };
  }

  if (timeline.messages.length === 0) {
    return {
      timeline: {
        type: HomeViewModelType.EmptyTimeline,
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
      type: HomeViewModelType.TimelineWithMessages,
      messages: messages,
    },
  };
};
