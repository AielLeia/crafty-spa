import { AppDispatch, createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { postMessage } from '@/libs/timeline/usecases/post-message.usecase.ts';
import {
  ProfileTimelineViewModelType,
  createProfileTimelineViewModel,
} from '@/pages/Profile/ProfileTimeline/profile-timeline.viewmodel.ts';
import { describe, expect, test, vi } from 'vitest';

type MessageView = {
  id: string;
  userId: string;
  username: string;
  profilePictureUrl: string;
  text: string;
  publishedAt: string;
  failedToBePosted: boolean;
  backgroundColor: string;
  errorMessage?: string;
};

const createMessageView = ({
  id = 'msg-id',
  userId = 'user-id',
  username = 'username',
  text = 'text',
  profilePictureUrl = 'profile-picture-url',
  publishedAt = new Date().toISOString(),
  failedToBePosted = false,
  backgroundColor = '',
  errorMessage,
}: Partial<MessageView> = {}): MessageView => {
  return {
    id,
    userId,
    username,
    text,
    profilePictureUrl,
    publishedAt,
    failedToBePosted,
    errorMessage,
    backgroundColor,
  };
};

const createTestProfileTimelineViewModel = ({
  userId = 'user-id',
  getNow = () => new Date().toISOString(),
  dispatch = vi.fn(),
}: {
  userId: string;
  getNow?: () => string;
  dispatch?: AppDispatch;
}) => createProfileTimelineViewModel({ userId, getNow, dispatch });

describe('Profile timeline view model', () => {
  test('There is no timeline in the store', () => {
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore();

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.NoTimeline,
      },
    });
  });

  test('There is no message in the timeline', () => {
    const initialState = stateBuilder()
      .withTimeline({
        id: 'bob-timeline-id',
        messages: [],
        user: 'Bob',
      })
      .build();

    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'Bob',
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.EmptyTimeline,
        info: 'There is no messages yet',
        timelineId: 'bob-timeline-id',
      },
    });
  });

  test('The timeline is loading', () => {
    const initialState = stateBuilder()
      .withLoadingTimelineOfUser('Bob')
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'Bob',
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.LoadingTimeline,
        info: 'Loading ...',
      },
    });
  });

  test('There is one message in the timeline', () => {
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg1',
          author: 'Bob',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
      ])
      .withTimeline({
        messages: ['msg1'],
        user: 'Bob',
        id: 'bob-timeline-id',
      })
      .build();

    const now = '2024-03-01T07:09:00.000Z';

    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        timelineId: 'bob-timeline-id',
        messages: [
          createMessageView({
            id: 'msg1',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'Hello world',
            publishedAt: '7 minutes ago',
            backgroundColor: 'muted',
          }),
        ],
      },
    });
  });

  test('There is multiples messages in the timeline : message are displayed by published date desc', () => {
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg2',
          author: 'Bob',
          text: 'Hello world from Bob !',
          publishedAt: '2024-02-29T07:02:00.000Z',
        },
        {
          id: 'msg1',
          author: 'Bob',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
        {
          id: 'msg3',
          author: 'Bob',
          text: 'How are you ?',
          publishedAt: '2024-02-28T07:02:00.000Z',
        },
        {
          id: 'msg4',
          author: 'Charles',
          text: 'Hello from Charles',
          publishedAt: '2024-02-28T07:02:00.000Z',
        },
      ])
      .withTimeline({
        messages: ['msg3', 'msg2', 'msg1'],
        user: 'Bob',
        id: 'bob-timeline-id',
      })
      .build();
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        timelineId: 'bob-timeline-id',
        messages: [
          createMessageView({
            id: 'msg1',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'Hello world',
            publishedAt: '7 minutes ago',
            backgroundColor: 'muted',
          }),
          createMessageView({
            id: 'msg2',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'Hello world from Bob !',
            publishedAt: '1 day ago',
            backgroundColor: 'muted',
          }),
          createMessageView({
            id: 'msg3',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'How are you ?',
            publishedAt: '2 days ago',
            backgroundColor: 'muted',
          }),
        ],
      },
    });
  });

  test('The message could not have been posted', () => {
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg1',
          author: 'Bob',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
      ])
      .withTimeline({
        messages: ['msg1'],
        user: 'Bob',
        id: 'bob-timeline-id',
      })
      .withMessageNotPosted({
        messageId: 'msg1',
        errorMessage: 'Cannot post message',
      })
      .build();

    const now = '2024-03-01T07:09:00.000Z';

    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        timelineId: 'bob-timeline-id',
        messages: [
          createMessageView({
            id: 'msg1',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'Hello world',
            publishedAt: '7 minutes ago',
            failedToBePosted: true,
            errorMessage: 'Cannot post message',
            backgroundColor: 'red.50',
          }),
        ],
      },
    });
  });

  test('The message could not posted can be retried', () => {
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg1',
          author: 'Bob',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
      ])
      .withTimeline({
        messages: ['msg1'],
        user: 'Bob',
        id: 'bob-timeline-id',
      })
      .withMessageNotPosted({
        messageId: 'msg1',
        errorMessage: 'Cannot post message',
      })
      .build();

    const now = '2024-03-01T07:09:00.000Z';

    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
      dispatch: store.dispatch,
    })(store.getState());

    if (
      ProfileTimelineViewModelType.TimelineWithMessages !==
      profileTimelineViewModel.timeline.type
    )
      throw new Error('Impossible state');

    profileTimelineViewModel.timeline.messages[0].retryToPostMessage();
    expect(store.getDispatchedUseCaseArgs(postMessage)).toEqual({
      messageId: 'msg1',
      timelineId: 'bob-timeline-id',
      text: 'Hello world',
    });
  });
});
