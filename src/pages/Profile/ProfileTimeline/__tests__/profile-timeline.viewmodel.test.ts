import { AppDispatch, createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { postMessage } from '@/libs/timeline/usecases/post-message.usecase.ts';
import { buildUser } from '@/libs/users/__tests__/user.builder.ts';
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
  userId = 'users-id',
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
  userId = 'users-id',
  getNow = () => new Date().toISOString(),
  dispatch = vi.fn(),
}: {
  userId: string;
  getNow?: () => string;
  dispatch?: AppDispatch;
}) => createProfileTimelineViewModel({ userId, getNow, dispatch });

describe('Profile timeline view models', () => {
  test('There is no timeline in the store', () => {
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore();

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'ismael-id',
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
        id: 'ismael-timeline-id',
        messages: [],
        user: 'ismael-id',
      })
      .build();

    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'ismael-id',
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.EmptyTimeline,
        info: 'There is no messages yet',
        timelineId: 'ismael-timeline-id',
      },
    });
  });

  test('The timeline is loading', () => {
    const initialState = stateBuilder()
      .withLoadingTimelineOfUser('Ismael')
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'Ismael',
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.LoadingTimeline,
        info: 'Loading ...',
      },
    });
  });

  test('There is one message in the timeline', () => {
    const ismael = buildUser({
      id: 'ismael-id',
      username: 'Ismael',
      profilePicture: 'ismael.png',
    });
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg1',
          author: 'ismael-id',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
      ])
      .withTimeline({
        messages: ['msg1'],
        user: 'ismael-id',
        id: 'ismael-timeline-id',
      })
      .withUsers([ismael])
      .build();

    const now = '2024-03-01T07:09:00.000Z';

    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'ismael-id',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        timelineId: 'ismael-timeline-id',
        messages: [
          createMessageView({
            id: 'msg1',
            userId: 'ismael-id',
            username: 'Ismael',
            profilePictureUrl: 'ismael.png',
            text: 'Hello world',
            publishedAt: '7 minutes ago',
            backgroundColor: 'muted',
          }),
        ],
      },
    });
  });

  test('There is multiples messages in the timeline : message are displayed by published date desc', () => {
    const ismael = buildUser({
      id: 'ismael-id',
      username: 'Ismael',
      profilePicture: 'ismael.png',
    });
    const charles = buildUser({
      id: 'charles-id',
      username: 'Charles',
      profilePicture: 'charles.png',
    });
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg2',
          author: 'ismael-id',
          text: 'Hello world from Ismael !',
          publishedAt: '2024-02-29T07:02:00.000Z',
        },
        {
          id: 'msg1',
          author: 'ismael-id',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
        {
          id: 'msg3',
          author: 'ismael-id',
          text: 'How are you ?',
          publishedAt: '2024-02-28T07:02:00.000Z',
        },
        {
          id: 'msg4',
          author: 'charles-id',
          text: 'Hello from Charles',
          publishedAt: '2024-02-28T07:02:00.000Z',
        },
      ])
      .withTimeline({
        messages: ['msg3', 'msg2', 'msg1'],
        user: 'ismael-id',
        id: 'ismael-timeline-id',
      })
      .withUsers([ismael, charles])
      .build();
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'ismael-id',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        timelineId: 'ismael-timeline-id',
        messages: [
          createMessageView({
            id: 'msg1',
            userId: 'ismael-id',
            username: 'Ismael',
            profilePictureUrl: 'ismael.png',
            text: 'Hello world',
            publishedAt: '7 minutes ago',
            backgroundColor: 'muted',
          }),
          createMessageView({
            id: 'msg2',
            userId: 'ismael-id',
            username: 'Ismael',
            profilePictureUrl: 'ismael.png',
            text: 'Hello world from Ismael !',
            publishedAt: '1 day ago',
            backgroundColor: 'muted',
          }),
          createMessageView({
            id: 'msg3',
            userId: 'ismael-id',
            username: 'Ismael',
            profilePictureUrl: 'ismael.png',
            text: 'How are you ?',
            publishedAt: '2 days ago',
            backgroundColor: 'muted',
          }),
        ],
      },
    });
  });

  test('The message could not have been posted', () => {
    const ismael = buildUser({
      id: 'ismael-id',
      username: 'Ismael',
      profilePicture: 'ismael.png',
    });
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg1',
          author: 'ismael-id',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
      ])
      .withTimeline({
        messages: ['msg1'],
        user: 'ismael-id',
        id: 'ismael-timeline-id',
      })
      .withMessageNotPosted({
        messageId: 'msg1',
        errorMessage: 'Cannot post message',
      })
      .withUsers([ismael])
      .build();

    const now = '2024-03-01T07:09:00.000Z';

    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'ismael-id',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        timelineId: 'ismael-timeline-id',
        messages: [
          createMessageView({
            id: 'msg1',
            userId: 'ismael-id',
            username: 'Ismael',
            profilePictureUrl: 'ismael.png',
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
    const ismael = buildUser({
      id: 'ismael-id',
    });
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg1',
          author: 'ismael-id',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
      ])
      .withTimeline({
        messages: ['msg1'],
        user: 'ismael-id',
        id: 'ismael-timeline-id',
      })
      .withMessageNotPosted({
        messageId: 'msg1',
        errorMessage: 'Cannot post message',
      })
      .withUsers([ismael])
      .build();

    const now = '2024-03-01T07:09:00.000Z';

    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: 'ismael-id',
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
      timelineId: 'ismael-timeline-id',
      text: 'Hello world',
    });
  });
});
