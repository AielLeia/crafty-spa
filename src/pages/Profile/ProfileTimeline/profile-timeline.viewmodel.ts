import { AppDispatch, RootState } from '@/libs/create-store.ts';
import {
  selectErrorMessage,
  selectMessagesOrderedByPublicationDateDesc,
} from '@/libs/timeline/slices/message.slice.ts';
import {
  selectIsUserTimelineLoading,
  selectTimelineForUser,
} from '@/libs/timeline/slices/timelines.slice.ts';
import { postMessage } from '@/libs/timeline/usecases/post-message.usecase.ts';
import { format } from 'timeago.js';

export const ProfileTimelineViewModelType = {
  NoTimeline: 'NO_TIMELINE',
  EmptyTimeline: 'EMPTY_TIMELINE',
  TimelineWithMessages: 'TIMELINE_WITH_MESSAGES',
  LoadingTimeline: 'LOADING_TIMELINE',
} as const;

export const createProfileTimelineViewModel =
  ({
    userId,
    getNow,
    dispatch,
  }: {
    userId: string;
    getNow: () => string;
    dispatch: AppDispatch;
  }) =>
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
          timelineId: timeline.id,
          info: 'There is no messages yet',
        },
      };
    }

    const messages = selectMessagesOrderedByPublicationDateDesc(
      timeline.messages,
      state
    ).map((msg) => {
      const errorMessage = selectErrorMessage(msg.id, state);
      const failedToBePosted = errorMessage !== undefined;
      const retryToPostMessage = () =>
        dispatch(
          postMessage({
            messageId: msg.id,
            timelineId: timeline.id,
            text: msg.text,
          })
        );
      return {
        id: msg.id,
        userId: msg.author,
        username: msg.author,
        profilePictureUrl: `https://picsum.photos/200?random=${msg.author}`,
        text: msg.text,
        publishedAt: format(msg.publishedAt, '', { relativeDate: now }),
        failedToBePosted,
        errorMessage,
        backgroundColor: failedToBePosted ? 'red.50' : 'muted',
        retryToPostMessage,
      };
    });

    return {
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        timelineId: timeline.id,
        messages: messages,
      },
    };
  };
