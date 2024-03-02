import { createTestStore } from '@/libs/create-store.ts';
import {
  HomeViewModelType,
  selectHomeViewModel,
} from '@/pages/Home/home.viewmodel.ts';
import { describe, expect, test } from 'vitest';

describe('Home view model', () => {
  test('There is no timeline in the store', () => {
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore();

    const homeViewModel = selectHomeViewModel(store.getState(), () => now);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.NoTimeline,
      },
    });
  });

  test('There is no message in the timeline', () => {
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ['alice-timeline-id'],
          entities: {
            'alice-timeline-id': {
              messages: [],
              user: 'Alice',
              id: 'alice-timeline-id',
            },
          },
          loadingTimelinesByUser: {},
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), () => now);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.EmptyTimeline,
        info: 'There is no messages yet',
      },
    });
  });

  test('The timeline is loading', () => {
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: [],
          entities: {},
          loadingTimelinesByUser: {
            Alice: true,
          },
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), () => now);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.LoadingTimeline,
        info: 'Loading ...',
      },
    });
  });

  test('There is one message in the timeline', () => {
    const now = '2024-03-01T07:09:00.000Z';

    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ['alice-timeline-id'],
          entities: {
            'alice-timeline-id': {
              messages: ['msg1'],
              user: 'Alice',
              id: 'alice-timeline-id',
            },
          },
          loadingTimelinesByUser: {},
        },
        messages: {
          ids: ['msg1'],
          entities: {
            msg1: {
              id: 'msg1',
              author: 'Bob',
              text: 'Hello world',
              publishedAt: '2024-03-01T07:02:00.000Z',
            },
          },
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), () => now);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.TimelineWithMessages,
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
    const now = '2024-03-01T07:09:00.000Z';
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ['alice-timeline-id'],
          entities: {
            'alice-timeline-id': {
              messages: ['msg1', 'msg2', 'msg3'],
              user: 'Alice',
              id: 'alice-timeline-id',
            },
          },
          loadingTimelinesByUser: {},
        },
        messages: {
          ids: ['msg1', 'msg2', 'msg3', 'msg4'],
          entities: {
            msg1: {
              id: 'msg1',
              author: 'Bob',
              text: 'Hello world',
              publishedAt: '2024-03-01T07:02:00.000Z',
            },
            msg2: {
              id: 'msg2',
              author: 'Alice',
              text: 'Hello world from Alice !',
              publishedAt: '2024-02-29T07:02:00.000Z',
            },
            msg3: {
              id: 'msg3',
              author: 'Alice',
              text: 'How are you ?',
              publishedAt: '2024-02-28T07:02:00.000Z',
            },
            msg4: {
              id: 'msg4',
              author: 'Charles',
              text: 'Hello from Charles',
              publishedAt: '2024-02-28T07:02:00.000Z',
            },
          },
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), () => now);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.TimelineWithMessages,
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
            userId: 'Alice',
            username: 'Alice',
            profilePictureUrl: 'https://picsum.photos/200?random=Alice',
            text: 'Hello world from Alice !',
            publishedAt: '1 day ago',
          },
          {
            id: 'msg3',
            userId: 'Alice',
            username: 'Alice',
            profilePictureUrl: 'https://picsum.photos/200?random=Alice',
            text: 'How are you ?',
            publishedAt: '2 days ago',
          },
        ],
      },
    });
  });
});
