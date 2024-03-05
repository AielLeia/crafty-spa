import { createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import {
  ProfileTimelineViewModelType,
  selectProfileTimelineViewModel,
} from '@/pages/Profile/ProfileTimeline/profile-timeline.viewmodel.ts';
import { describe, expect, test } from 'vitest';

describe('Profile timeline view model', () => {
  test('There is no timeline in the store', () => {
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore();

    const profileTimelineViewModel = selectProfileTimelineViewModel({
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

    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.EmptyTimeline,
        info: 'There is no messages yet',
      },
    });
  });

  test('The timeline is loading', () => {
    const initialState = stateBuilder()
      .withLoadingTimelineOfUser('Bob')
      .build();
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
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

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        messages: [
          {
            id: 'msg1',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'Hello world',
            publishedAt: '7 minutes ago',
          },
        ],
      },
    });
  });

  test('There is multiples messages in the timeline', () => {
    const initialState = stateBuilder()
      .withMessages([
        {
          id: 'msg1',
          author: 'Bob',
          text: 'Hello world',
          publishedAt: '2024-03-01T07:02:00.000Z',
        },
        {
          id: 'msg2',
          author: 'Bob',
          text: 'Hello world from Bob !',
          publishedAt: '2024-02-29T07:02:00.000Z',
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
        messages: ['msg1', 'msg2', 'msg3'],
        user: 'Bob',
        id: 'bob-timeline-id',
      })
      .build();
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: 'Bob',
      getNow: () => now,
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.TimelineWithMessages,
        messages: [
          {
            id: 'msg1',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'Hello world',
            publishedAt: '7 minutes ago',
          },
          {
            id: 'msg2',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'Hello world from Bob !',
            publishedAt: '1 day ago',
          },
          {
            id: 'msg3',
            userId: 'Bob',
            username: 'Bob',
            profilePictureUrl: 'https://picsum.photos/200?random=Bob',
            text: 'How are you ?',
            publishedAt: '2 days ago',
          },
        ],
      },
    });
  });
});
